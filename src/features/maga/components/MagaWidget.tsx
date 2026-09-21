"use client";

import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type PointerEvent as ReactPointerEvent,
} from "react";
import dynamic from "next/dynamic";
import { usePathname } from "next/navigation";
import { X } from "lucide-react";
import { MagaChatPanel } from "./MagaChatPanel";
import { useMagaChat } from "../hooks/useMagaChat";
import { useMagaVisibility } from "@/hooks/settings/useMagaVisibility";

const MagaRobot3D = dynamic(
  () => import("./MagaRobot3D").then((m) => m.MagaRobot3D),
  { ssr: false },
);

const HIDDEN_ON = ["/pos", "/aide"];
const FULL_PAGE = ["/help"];

/* -------------------------------------------------------------------------- */
/*  Réglages du déplacement                                                   */
/* -------------------------------------------------------------------------- */

/** Breakpoint Tailwind `lg` : sépare l'affichage bureau de l'affichage responsive. */
const DESKTOP_QUERY = "(min-width: 1024px)";

/** 1 cm CSS = 96 / 2.54 px → déplacement maximal vers la gauche : 10 cm. */
const CM_IN_PX = 96 / 2.54;
const MAX_SHIFT_LEFT_PX = 10 * CM_IN_PX;

/** Bureau : Maga ne passe jamais sous la Sidebar (`lg:ml-[240px]`). */
const SIDEBAR_WIDTH_PX = 240;
const SIDEBAR_GAP_PX = 16;
/** Responsive : marge minimale gardée avec le bord gauche de l'écran. */
const EDGE_GAP_PX = 12;

/** Taille du robot fermé (mêmes valeurs que les classes du bouton). */
const ROBOT_SIZE = {
  mobile: { width: 76, height: 94 },
  desktop: { width: 132, height: 164 },
};

/** Distance minimale (px) avant qu'un appui devienne un glissement (≠ clic). */
const DRAG_THRESHOLD_PX = 4;

/** Détection « Maga cache-t-il une information ? » */
const SAMPLE_STEP_PX = 10;
const MAX_SAMPLES = 400;
const DETECTION_DELAY_MS = 120;

/* -------------------------------------------------------------------------- */
/*  Utilitaires                                                               */
/* -------------------------------------------------------------------------- */

type Box = { left: number; top: number; right: number; bottom: number };

function intersects(rect: DOMRect, box: Box) {
  return (
    rect.width > 0 &&
    rect.height > 0 &&
    rect.left < box.right &&
    rect.right > box.left &&
    rect.top < box.bottom &&
    rect.bottom > box.top
  );
}

const INFO_TAGS = new Set([
  "IMG",
  "CANVAS",
  "VIDEO",
  "IFRAME",
  "INPUT",
  "TEXTAREA",
  "SELECT",
  "BUTTON",
  "A",
]);

/** Élément qui « porte » de l'information (texte, icône, graphique, champ, bouton…). */
function isInformative(el: Element, box: Box, range: Range): boolean {
  const style = getComputedStyle(el);
  if (style.visibility === "hidden" || Number(style.opacity) === 0) return false;

  if (INFO_TAGS.has(el.tagName)) return true;
  if (el instanceof SVGElement) return true; // icônes, graphiques, donut…

  // Texte propre à l'élément, réellement situé sous la zone de Maga.
  for (const node of Array.from(el.childNodes)) {
    if (node.nodeType !== Node.TEXT_NODE) continue;
    if (!(node.nodeValue ?? "").trim()) continue;
    range.selectNodeContents(node);
    for (const rect of Array.from(range.getClientRects())) {
      if (intersects(rect, box)) return true;
    }
  }
  return false;
}

/**
 * Échantillonne la zone qu'occupe Maga à sa position PAR DÉFAUT et indique si
 * au moins une information (texte, icône, graphique, bouton…) se trouve
 * dessous. Les éléments de Maga lui-même sont ignorés.
 */
function coversInformation(box: Box, widget: Element): boolean {
  const vw = document.documentElement.clientWidth;
  const vh = document.documentElement.clientHeight;
  const left = Math.max(box.left, 0);
  const top = Math.max(box.top, 0);
  const right = Math.min(box.right, vw - 1);
  const bottom = Math.min(box.bottom, vh - 1);
  const width = right - left;
  const height = bottom - top;
  if (width <= 0 || height <= 0) return false;

  const step = Math.max(SAMPLE_STEP_PX, Math.ceil(Math.sqrt((width * height) / MAX_SAMPLES)));
  const cols = Math.max(1, Math.ceil(width / step));
  const rows = Math.max(1, Math.ceil(height / step));
  const range = document.createRange();
  const seen = new Set<Element>();

  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      const x = left + ((c + 0.5) * width) / cols;
      const y = top + ((r + 0.5) * height) / rows;
      for (const el of document.elementsFromPoint(x, y)) {
        if (seen.has(el)) continue;
        seen.add(el);
        if (el === document.documentElement || el === document.body) continue;
        if (widget.contains(el)) continue;
        if (isInformative(el, box, range)) return true;
      }
    }
  }
  return false;
}

/* -------------------------------------------------------------------------- */
/*  Composant                                                                 */
/* -------------------------------------------------------------------------- */

export function MagaWidget() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const chat = useMagaChat();
  const { enabled: isMagaVisible } = useMagaVisibility();

  const shown =
    isMagaVisible && !HIDDEN_ON.includes(pathname) && !FULL_PAGE.includes(pathname);

  // Décalage horizontal (px, ≤ 0) du robot fermé, mémorisé POUR la page courante.
  const [drag, setDrag] = useState({ path: pathname, x: 0 });
  // Nouvelle page → retour immédiat à la position par défaut.
  if (drag.path !== pathname) {
    setDrag({ path: pathname, x: 0 });
  }

  // Résultat de la détection : le déplacement est-il permis, et jusqu'où ?
  const [layout, setLayout] = useState({ canDrag: false, maxLeft: 0 });
  const [isDragging, setIsDragging] = useState(false);

  const containerRef = useRef<HTMLDivElement>(null);
  const timerRef = useRef<number | null>(null);
  const gestureRef = useRef<{ startX: number; startShift: number; moved: boolean } | null>(null);
  const suppressClickRef = useRef(false);

  const dragAllowed = shown && layout.canDrag && layout.maxLeft > 0;
  const shift = dragAllowed ? Math.min(0, Math.max(-layout.maxLeft, drag.x)) : 0;

  const resetPosition = useCallback(() => {
    setDrag((prev) => (prev.x === 0 ? prev : { ...prev, x: 0 }));
  }, []);

  /* ---- Détection : le robot cache-t-il quelque chose à sa place par défaut ? --- */
  const measure = useCallback(() => {
    const el = containerRef.current;
    if (!el) return;

    const desktop = window.matchMedia(DESKTOP_QUERY).matches;
    const robot = desktop ? ROBOT_SIZE.desktop : ROBOT_SIZE.mobile;
    const cs = getComputedStyle(el);
    const vw = document.documentElement.clientWidth;
    const vh = document.documentElement.clientHeight;
    const marginRight = parseFloat(cs.right) || 0;
    const marginBottom = parseFloat(cs.bottom) || 0;

    // Zone du robot fermé à sa position par défaut (indépendante du décalage
    // et de l'état ouvert/fermé du panneau).
    const box: Box = {
      right: vw - marginRight,
      left: vw - marginRight - robot.width,
      bottom: vh - marginBottom,
      top: vh - marginBottom - robot.height,
    };

    const canDrag = coversInformation(box, el);
    const leftLimit = desktop ? SIDEBAR_WIDTH_PX + SIDEBAR_GAP_PX : EDGE_GAP_PX;
    const maxLeft = canDrag
      ? Math.max(0, Math.min(MAX_SHIFT_LEFT_PX, box.left - leftLimit))
      : 0;

    setLayout((prev) =>
      prev.canDrag === canDrag && Math.abs(prev.maxLeft - maxLeft) < 1
        ? prev
        : { canDrag, maxLeft },
    );

    if (!canDrag) {
      // Rien n'est caché → pas de déplacement : position par défaut.
      if (!gestureRef.current) resetPosition();
    } else {
      // L'écran a rétréci : on ramène le robot dans la limite autorisée.
      setDrag((prev) => (prev.x < -maxLeft ? { ...prev, x: -maxLeft } : prev));
    }
  }, [resetPosition]);

  const scheduleMeasure = useCallback(() => {
    if (timerRef.current !== null) window.clearTimeout(timerRef.current);
    timerRef.current = window.setTimeout(() => {
      timerRef.current = null;
      measure();
    }, DETECTION_DELAY_MS);
  }, [measure]);

  // Re-détection : nouvelle page, ouverture/fermeture, chargement des données
  // (DOM), défilement, redimensionnement.
  useEffect(() => {
    if (!shown) return;
    scheduleMeasure();

    window.addEventListener("resize", scheduleMeasure);
    window.addEventListener("scroll", scheduleMeasure, { capture: true, passive: true });
    const observer = new MutationObserver(scheduleMeasure);
    observer.observe(document.body, { childList: true, subtree: true, characterData: true });

    return () => {
      window.removeEventListener("resize", scheduleMeasure);
      window.removeEventListener("scroll", scheduleMeasure, { capture: true });
      observer.disconnect();
      if (timerRef.current !== null) {
        window.clearTimeout(timerRef.current);
        timerRef.current = null;
      }
    };
  }, [shown, pathname, open, scheduleMeasure]);

  // Passage bureau ↔ responsive → retour automatique à la position par défaut.
  useEffect(() => {
    const mq = window.matchMedia(DESKTOP_QUERY);
    mq.addEventListener("change", resetPosition);
    return () => mq.removeEventListener("change", resetPosition);
  }, [resetPosition]);

  /* ---- Glissement (souris, tactile, stylet) — uniquement vers la gauche ---- */
  function handlePointerDown(e: ReactPointerEvent<HTMLElement>) {
    if (!dragAllowed || e.button !== 0) return;
    gestureRef.current = { startX: e.clientX, startShift: shift, moved: false };
    e.currentTarget.setPointerCapture(e.pointerId);
  }

  function handlePointerMove(e: ReactPointerEvent<HTMLElement>) {
    const gesture = gestureRef.current;
    if (!gesture) return;
    const dx = e.clientX - gesture.startX;
    if (!gesture.moved && Math.abs(dx) < DRAG_THRESHOLD_PX) return;
    if (!gesture.moved) {
      gesture.moved = true;
      setIsDragging(true);
    }
    // Bornes : jamais à droite de la position d'origine, jamais au-delà de 10 cm.
    const next = Math.min(0, Math.max(-layout.maxLeft, gesture.startShift + dx));
    setDrag({ path: pathname, x: next });
  }

  function handlePointerEnd(e: ReactPointerEvent<HTMLElement>) {
    const gesture = gestureRef.current;
    if (!gesture) return;
    gestureRef.current = null;
    if (e.currentTarget.hasPointerCapture(e.pointerId)) {
      e.currentTarget.releasePointerCapture(e.pointerId);
    }
    if (gesture.moved) {
      // Évite que la fin d'un glissement soit interprétée comme un clic.
      suppressClickRef.current = true;
      window.setTimeout(() => {
        suppressClickRef.current = false;
      }, 0);
      setIsDragging(false);
    }
  }

  if (!shown) return null;

  const dragCursor = dragAllowed
    ? isDragging
      ? "cursor-grabbing touch-pan-y"
      : "cursor-grab touch-pan-y"
    : "";

  // Le conteneur reste TOUJOURS à sa position par défaut : seul le bouton du
  // robot fermé est décalé. La boîte de dialogue s'ouvre donc à sa place
  // d'origine, et non là où le robot a été déplacé.
  return (
    <div
      ref={containerRef}
      className="fixed bottom-[92px] lg:bottom-6 right-4 lg:right-6 z-50 flex flex-col items-end gap-3 pointer-events-none"
    >
      {open ? (
        <>
          {/* Fond assombri — mobile uniquement, le panneau devient quasi plein écran */}
          <div
            className="lg:hidden fixed inset-0 z-30 bg-black/30 backdrop-blur-[1px] pointer-events-auto"
            onClick={() => setOpen(false)}
          />
          <section
            className="fixed inset-x-3 top-[76px] bottom-[84px] z-40 lg:static lg:inset-auto lg:z-auto lg:w-[340px] lg:h-[520px] max-w-[calc(100vw-24px)] bg-white lg:bg-white/92 lg:backdrop-blur-[24px] border border-border-glass rounded-3xl shadow-sidebar overflow-hidden flex flex-col pointer-events-auto"
          >
            <header className="flex items-center gap-2 px-4 py-3 border-b border-border-divider flex-shrink-0">
              <div className="w-[56px] h-[68px] lg:w-[72px] lg:h-[86px] shrink-0">
                <MagaRobot3D mood={chat.mood} />
              </div>
              <div className="min-w-0">
                <p className="text-[13px] font-bold text-text-primary leading-tight">Maga</p>
                <p className="text-[11px] text-text-muted truncate">
                  {chat.sending ? "Réfléchit…" : "Assistant officine · en ligne"}
                </p>
              </div>
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="ml-auto p-1.5 rounded-full hover:bg-surface-muted text-text-muted"
                aria-label="Fermer Maga"
              >
                <X size={16} />
              </button>
            </header>
            <div className="flex-1 min-h-0 p-3 bg-surface-muted/60">
              <MagaChatPanel
                messages={chat.messages}
                suggestions={chat.suggestions}
                sending={chat.sending}
                send={chat.send}
              />
            </div>
          </section>
        </>
      ) : (
        <button
          type="button"
          onClick={() => {
            if (suppressClickRef.current) return;
            setOpen(true);
          }}
          onDragStart={(e) => e.preventDefault()}
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerEnd}
          onPointerCancel={handlePointerEnd}
          style={{
            transform: shift !== 0 ? `translateX(${shift}px)` : undefined,
            transition: isDragging ? "none" : "transform 200ms ease-out",
          }}
          className={`relative group pointer-events-auto select-none ${dragCursor}`}
          aria-label="Ouvrir Maga"
          title={dragAllowed ? "Cliquer pour ouvrir · glisser vers la gauche pour déplacer" : undefined}
        >
          <span className="hidden lg:block absolute -top-9 right-1 whitespace-nowrap rounded-full bg-brand-darkest text-white text-[10px] font-bold px-2.5 py-1 opacity-90 group-hover:opacity-100">
            Maga · officine
          </span>
          <div className="w-[76px] h-[94px] lg:w-[132px] lg:h-[164px] drop-shadow-[0_12px_24px_rgba(11,143,104,0.28)]">
            <MagaRobot3D mood={chat.mood} />
          </div>
        </button>
      )}
    </div>
  );
}
