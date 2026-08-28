"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";
import type { MagaMood } from "@/api/maga.api";

type MagaRobot3DProps = {
  mood: MagaMood;
  className?: string;
};

type MagaParts = {
  root: THREE.Group;
  head: THREE.Group;
  body: THREE.Mesh;
  antennaBulb: THREE.Mesh;
  antennaLight: THREE.PointLight;
  lids: THREE.Mesh[];
  pupils: THREE.Mesh[];
  mouth: THREE.Mesh;
  cheeks: THREE.Mesh[];
  armR: THREE.Mesh;
  armL: THREE.Mesh;
};

function plastic(color: string, extras: Partial<THREE.MeshPhysicalMaterialParameters> = {}) {
  return new THREE.MeshPhysicalMaterial({
    color,
    roughness: 0.28,
    metalness: 0.08,
    clearcoat: 0.9,
    clearcoatRoughness: 0.18,
    sheen: 0.4,
    sheenColor: new THREE.Color("#ffffff"),
    ...extras,
  });
}

function buildMaga(): MagaParts {
  const root = new THREE.Group();

  const head = new THREE.Group();
  head.position.y = 0.42;
  const skull = new THREE.Mesh(new THREE.SphereGeometry(0.46, 48, 48), plastic("#d9fff2"));
  skull.castShadow = true;
  head.add(skull);

  const visor = new THREE.Mesh(
    new THREE.SphereGeometry(0.462, 32, 16, 0, Math.PI * 2, 0, Math.PI * 0.22),
    new THREE.MeshPhysicalMaterial({
      color: "#ffffff",
      roughness: 0.05,
      metalness: 0.2,
      transparent: true,
      opacity: 0.28,
      clearcoat: 1,
    }),
  );
  visor.rotation.x = -0.15;
  head.add(visor);

  function makeEye(x: number) {
    const eye = new THREE.Group();
    eye.position.set(x, 0.06, 0.36);
    const white = new THREE.Mesh(new THREE.SphereGeometry(0.13, 24, 24), plastic("#f4fffb", { roughness: 0.12 }));
    const iris = new THREE.Mesh(
      new THREE.SphereGeometry(0.08, 20, 20),
      new THREE.MeshPhysicalMaterial({ color: "#0b3b32", roughness: 0.2, metalness: 0.15 }),
    );
    iris.position.z = 0.06;
    const pupil = new THREE.Mesh(
      new THREE.SphereGeometry(0.045, 16, 16),
      new THREE.MeshBasicMaterial({ color: "#7dffd2" }),
    );
    pupil.position.z = 0.1;
    const shine = new THREE.Mesh(
      new THREE.SphereGeometry(0.025, 12, 12),
      new THREE.MeshBasicMaterial({ color: "#ffffff" }),
    );
    shine.position.set(-0.035, 0.04, 0.13);
    const lid = new THREE.Mesh(
      new THREE.SphereGeometry(0.136, 20, 16, 0, Math.PI * 2, 0, Math.PI * 0.55),
      plastic("#8ad9c6"),
    );
    lid.rotation.x = Math.PI;
    lid.position.y = 0.02;
    eye.add(white, iris, pupil, shine, lid);
    head.add(eye);
    return { pupil, lid };
  }

  const left = makeEye(-0.15);
  const right = makeEye(0.15);

  const mouth = new THREE.Mesh(
    new THREE.TorusGeometry(0.09, 0.018, 12, 24, Math.PI),
    plastic("#0b3b32", { roughness: 0.4 }),
  );
  mouth.position.set(0, -0.16, 0.38);
  mouth.rotation.z = Math.PI;
  head.add(mouth);

  const cheekMat = plastic("#ff8aa0", { transparent: true, opacity: 0, roughness: 0.5 });
  const cheekL = new THREE.Mesh(new THREE.SphereGeometry(0.05, 12, 12), cheekMat);
  const cheekR = new THREE.Mesh(new THREE.SphereGeometry(0.05, 12, 12), cheekMat.clone());
  cheekL.position.set(-0.28, -0.1, 0.32);
  cheekR.position.set(0.28, -0.1, 0.32);
  head.add(cheekL, cheekR);

  const earGeo = new THREE.CapsuleGeometry(0.05, 0.08, 6, 12);
  const earMat = plastic("#5aa894");
  const earL = new THREE.Mesh(earGeo, earMat);
  const earR = new THREE.Mesh(earGeo, earMat);
  earL.position.set(-0.46, 0.02, 0);
  earR.position.set(0.46, 0.02, 0);
  head.add(earL, earR);

  const antenna = new THREE.Mesh(new THREE.CylinderGeometry(0.018, 0.022, 0.28, 12), plastic("#7ad0c2"));
  antenna.position.y = 0.58;
  const antennaBulb = new THREE.Mesh(
    new THREE.SphereGeometry(0.07, 20, 20),
    new THREE.MeshPhysicalMaterial({
      color: "#2ee59d",
      emissive: "#148a6a",
      emissiveIntensity: 0.85,
      roughness: 0.15,
      metalness: 0.1,
      transmission: 0.15,
      thickness: 0.4,
    }),
  );
  antennaBulb.position.y = 0.74;
  const antennaLight = new THREE.PointLight("#2ee59d", 0.8, 3);
  antennaLight.position.y = 0.74;
  head.add(antenna, antennaBulb, antennaLight);

  const body = new THREE.Mesh(
    new THREE.CapsuleGeometry(0.28, 0.28, 10, 20),
    plastic("#0B8F68", { roughness: 0.32 }),
  );
  body.position.y = -0.22;
  body.castShadow = true;

  const screen = new THREE.Mesh(
    new THREE.PlaneGeometry(0.28, 0.16),
    new THREE.MeshPhysicalMaterial({
      color: "#06251f",
      emissive: "#0B8F68",
      emissiveIntensity: 0.35,
      roughness: 0.2,
    }),
  );
  screen.position.set(0, -0.12, 0.29);
  body.add(screen);

  const armGeo = new THREE.CapsuleGeometry(0.055, 0.22, 6, 12);
  const armMat = plastic("#7ad0c2");
  const armL = new THREE.Mesh(armGeo, armMat);
  const armR = new THREE.Mesh(armGeo, armMat);
  armL.position.set(-0.38, -0.12, 0.04);
  armR.position.set(0.38, -0.12, 0.04);
  armL.rotation.z = 0.35;
  armR.rotation.z = -0.35;
  armL.castShadow = true;
  armR.castShadow = true;

  const legGeo = new THREE.CapsuleGeometry(0.06, 0.12, 6, 12);
  const legMat = plastic("#5aa894");
  const legL = new THREE.Mesh(legGeo, legMat);
  const legR = new THREE.Mesh(legGeo, legMat);
  legL.position.set(-0.12, -0.58, 0);
  legR.position.set(0.12, -0.58, 0);

  root.add(head, body, armL, armR, legL, legR);
  root.position.y = 0.08;

  return {
    root,
    head,
    body,
    antennaBulb,
    antennaLight,
    lids: [left.lid, right.lid],
    pupils: [left.pupil, right.pupil],
    mouth,
    cheeks: [cheekL, cheekR],
    armR,
    armL,
  };
}

export function MagaRobot3D({ mood, className }: MagaRobot3DProps) {
  const hostRef = useRef<HTMLDivElement>(null);
  const moodRef = useRef<MagaMood>(mood);
  moodRef.current = mood;

  useEffect(() => {
    const host = hostRef.current;
    if (!host) return;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(32, 1, 0.1, 40);
    camera.position.set(0, 0.15, 3.15);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.08;
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    host.appendChild(renderer.domElement);

    const hemi = new THREE.HemisphereLight("#e8fff6", "#7aa894", 1.05);
    const key = new THREE.DirectionalLight("#ffffff", 1.35);
    key.position.set(2.2, 3.2, 3.4);
    key.castShadow = true;
    key.shadow.mapSize.set(1024, 1024);
    const fill = new THREE.DirectionalLight("#a8f24a", 0.28);
    fill.position.set(-2.4, 1.2, 1.5);
    const rim = new THREE.DirectionalLight("#ffffff", 0.45);
    rim.position.set(0, 1.5, -3);
    scene.add(hemi, key, fill, rim);

    const maga = buildMaga();
    scene.add(maga.root);

    const ground = new THREE.Mesh(
      new THREE.CircleGeometry(1.1, 40),
      new THREE.ShadowMaterial({ opacity: 0.22 }),
    );
    ground.rotation.x = -Math.PI / 2;
    ground.position.y = -0.78;
    ground.receiveShadow = true;
    scene.add(ground);

    const pointer = { x: 0, y: 0 };
    const onMove = (e: PointerEvent) => {
      const r = host.getBoundingClientRect();
      pointer.x = ((e.clientX - r.left) / r.width) * 2 - 1;
      pointer.y = -(((e.clientY - r.top) / r.height) * 2 - 1);
    };
    host.addEventListener("pointermove", onMove);

    const resize = () => {
      const w = host.clientWidth || 180;
      const h = host.clientHeight || 220;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h, false);
    };
    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(host);

    let raf = 0;
    const clock = new THREE.Clock();

    const loop = () => {
      raf = requestAnimationFrame(loop);
      const t = clock.getElapsedTime();
      const m = moodRef.current;

      const bob =
        m === "happy" ? Math.sin(t * 6) * 0.08 :
        m === "talk" ? Math.sin(t * 5) * 0.03 :
        m === "listen" ? Math.sin(t * 2.2) * 0.04 :
        Math.sin(t * 1.6) * 0.025;
      maga.root.position.y = 0.08 + bob;
      maga.root.rotation.y = THREE.MathUtils.lerp(maga.root.rotation.y, pointer.x * 0.35, 0.08);
      maga.head.rotation.y = THREE.MathUtils.lerp(maga.head.rotation.y, pointer.x * 0.28, 0.12);
      maga.head.rotation.x = THREE.MathUtils.lerp(
        maga.head.rotation.x,
        m === "think" ? 0.12 : m === "listen" ? -0.08 : pointer.y * 0.12,
        0.1,
      );

      for (const pupil of maga.pupils) {
        pupil.position.x = pointer.x * 0.025;
        pupil.position.y = pointer.y * 0.02;
      }

      const blinkWindow = 0.12;
      const cycle = 3.2;
      const blinking = t % cycle < blinkWindow || (t + 0.22) % cycle < blinkWindow * 0.6;
      for (const lid of maga.lids) {
        lid.scale.y = blinking ? 0.15 : 1;
      }

      const talking = m === "talk" || m === "listen";
      maga.mouth.scale.y = talking ? 1 + Math.abs(Math.sin(t * 12)) * 0.9 : m === "happy" ? 1.25 : 1;
      maga.mouth.scale.x = m === "warn" ? 0.55 : 1;

      const bulb = maga.antennaBulb.material as THREE.MeshPhysicalMaterial;
      if (m === "warn") {
        bulb.color.set("#ffb020");
        bulb.emissive.set("#ff8a00");
        maga.antennaLight.color.set("#ffb020");
      } else if (m === "listen") {
        bulb.color.set("#ff5b5b");
        bulb.emissive.set("#ff5b5b");
        maga.antennaLight.color.set("#ff5b5b");
      } else {
        bulb.color.set("#2ee59d");
        bulb.emissive.set("#148a6a");
        maga.antennaLight.color.set("#2ee59d");
      }
      maga.antennaLight.intensity = m === "think" || m === "listen" ? 1.4 + Math.sin(t * 10) * 0.5 : 0.75;

      const wave = m === "talk" || m === "happy" ? -0.35 + Math.sin(t * 7) * 0.5 : -0.35;
      maga.armR.rotation.z = wave;
      maga.armL.rotation.z = m === "think" ? 0.35 + Math.sin(t * 4) * 0.12 : 0.35;

      const blush = maga.cheeks[0].material as THREE.MeshPhysicalMaterial;
      const blush2 = maga.cheeks[1].material as THREE.MeshPhysicalMaterial;
      blush.opacity = m === "happy" ? 0.7 : 0;
      blush2.opacity = m === "happy" ? 0.7 : 0;

      if (m === "warn") maga.root.position.x = Math.sin(t * 18) * 0.03;
      else maga.root.position.x = THREE.MathUtils.lerp(maga.root.position.x, 0, 0.2);

      renderer.render(scene, camera);
    };
    loop();

    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
      host.removeEventListener("pointermove", onMove);
      renderer.dispose();
      scene.traverse((obj: THREE.Object3D) => {
        if (obj instanceof THREE.Mesh) {
          obj.geometry.dispose();
          const mat = obj.material;
          if (Array.isArray(mat)) mat.forEach((x) => x.dispose());
          else mat.dispose();
        }
      });
      renderer.domElement.remove();
    };
  }, []);

  return (
    <div
      ref={hostRef}
      className={className}
      aria-hidden="true"
      style={{
        width: "100%",
        height: "100%",
        cursor: "pointer",
        background:
          "radial-gradient(ellipse at 50% 70%, rgba(11,143,104,0.16) 0%, transparent 68%)",
      }}
    />
  );
}
