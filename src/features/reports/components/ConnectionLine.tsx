"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";

interface ConnectionLineProps {
  activeTab: string;
}

export function ConnectionLine({ activeTab }: ConnectionLineProps) {
  const [path, setPath] = useState("");
  const [p1, setP1] = useState({ x: 0, y: 0 });
  const [p2, setP2] = useState({ x: 0, y: 0 });
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const updatePath = () => {
      // Disable on mobile viewports
      if (window.innerWidth < 1024) {
        setIsVisible(false);
        return;
      }

      const startEl = document.getElementById("sidebar-nav-reports");
      const endEl = document.getElementById(`reports-tab-${activeTab}`);

      if (startEl && endEl) {
        const startRect = startEl.getBoundingClientRect();
        const endRect = endEl.getBoundingClientRect();

        const x1 = startRect.right - 2; // Offset slightly into the button
        const y1 = startRect.top + startRect.height / 2;

        const x2 = endRect.left + 2; // Offset slightly into the tab
        const y2 = endRect.top + endRect.height / 2;

        // Create an S-curve by putting control points halfway horizontally
        const midX = x1 + (x2 - x1) / 2;
        
        setP1({ x: x1, y: y1 });
        setP2({ x: x2, y: y2 });
        setPath(`M ${x1} ${y1} C ${midX} ${y1}, ${midX} ${y2}, ${x2} ${y2}`);
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };

    updatePath();
    window.addEventListener("resize", updatePath);
    
    // Short delay to recalculate in case of concurrent layout shifts
    const timeout = setTimeout(updatePath, 150);

    return () => {
      window.removeEventListener("resize", updatePath);
      clearTimeout(timeout);
    };
  }, [activeTab]);

  if (!isVisible) return null;

  return (
    <svg 
      className="fixed inset-0 pointer-events-none z-50 overflow-visible"
      style={{ width: "100%", height: "100%" }}
    >
      <motion.path
        d={path}
        fill="none"
        stroke="#0B8F68"
        strokeWidth="5"
        strokeLinecap="round"
        style={{ filter: "drop-shadow(0px 0px 4px rgba(11,143,104,0.4))" }}
        initial={{ pathLength: 0, opacity: 0 }}
        animate={{ pathLength: 1, opacity: 1, d: path }}
        transition={{ 
          type: "spring", 
          stiffness: 300, 
          damping: 30,
          opacity: { duration: 0.2 }
        }}
      />
      
      {/* Node at start (Sidebar) */}
      <motion.circle
        cx={p1.x}
        cy={p1.y}
        r="4.5"
        fill="#A7F3D0" // Emerald 200
        stroke="#0B8F68"
        strokeWidth="1.5"
        initial={{ scale: 0 }}
        animate={{ scale: 1, cx: p1.x, cy: p1.y }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
      />
      
      {/* Node at end (Active tab) */}
      <motion.circle
        cx={p2.x}
        cy={p2.y}
        r="4.5"
        fill="#A7F3D0" // Emerald 200
        stroke="#0B8F68"
        strokeWidth="1.5"
        initial={{ scale: 0 }}
        animate={{ scale: 1, cx: p2.x, cy: p2.y }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
      />
    </svg>
  );
}
