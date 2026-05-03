"use client";

import { useFrame, useThree } from "@react-three/fiber";
import { useEffect, useMemo, useRef } from "react";
import * as THREE from "three";

const COLOR_SIGNAL = new THREE.Color("#00E5C7");
const COLOR_FLAG_BLUE = new THREE.Color("#0A2540");
const COLOR_BONE = new THREE.Color("#E8ECF1");

/**
 * Single persistent scene. A particle field that morphs through five target
 * shapes driven by global scroll progress. Each Act in the home page DOM has
 * a normalized window of the global progress (0–1).
 *
 * Targets, in order:
 *   0 — globe              (Act 1: Ingress)
 *   1 — constellation      (Act 2: Doctrine)
 *   2 — vertical stack     (Act 3: Soteria stack)
 *   3 — factory silhouette (Act 4: In the field)
 *   4 — hex grid           (Act 5: Federal — cool palette shift)
 *   5 — tunnel             (Act 6: Trajectory)
 *   6 — dispersed (out)    (Act 7: Contact)
 */

const N = 2400;

function makeGlobe(out: Float32Array) {
  const r = 2.4;
  for (let i = 0; i < N; i++) {
    const phi = Math.acos(1 - (2 * (i + 0.5)) / N);
    const theta = Math.PI * (1 + Math.sqrt(5)) * i;
    out[i * 3 + 0] = r * Math.sin(phi) * Math.cos(theta);
    out[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
    out[i * 3 + 2] = r * Math.cos(phi);
  }
}

function makeConstellation(out: Float32Array) {
  const anchors = [
    [-3.2, 1.1, 0],
    [-1.4, -1.6, 0.3],
    [0.4, 1.7, -0.4],
    [2.2, -0.6, 0.2],
    [3.6, 1.4, -0.3],
  ];
  for (let i = 0; i < N; i++) {
    const a = anchors[i % anchors.length];
    const r = Math.pow(Math.random(), 1.4) * 0.85;
    const t = Math.random() * Math.PI * 2;
    const p = Math.acos(2 * Math.random() - 1);
    out[i * 3 + 0] = a[0] + r * Math.sin(p) * Math.cos(t);
    out[i * 3 + 1] = a[1] + r * Math.sin(p) * Math.sin(t);
    out[i * 3 + 2] = a[2] + r * Math.cos(p);
  }
}

function makeStack(out: Float32Array) {
  // Four glass slabs stacked vertically
  const slabs = [
    { y: 1.8, w: 3.6, d: 0.4, h: 0.5 },
    { y: 0.6, w: 3.6, d: 0.4, h: 0.5 },
    { y: -0.6, w: 3.6, d: 0.4, h: 0.5 },
    { y: -1.8, w: 3.6, d: 0.4, h: 0.5 },
  ];
  for (let i = 0; i < N; i++) {
    const s = slabs[i % slabs.length];
    out[i * 3 + 0] = (Math.random() - 0.5) * s.w;
    out[i * 3 + 1] = s.y + (Math.random() - 0.5) * s.h;
    out[i * 3 + 2] = (Math.random() - 0.5) * s.d;
  }
}

function makeFactory(out: Float32Array) {
  // Low-poly silhouette — sawtooth roofline
  for (let i = 0; i < N; i++) {
    const x = (Math.random() - 0.5) * 9;
    const sawtooth = Math.abs(((x + 4.5) % 1.4) - 0.7);
    const groundY = -2.1;
    const roofY = -0.4 - sawtooth * 0.9;
    const y = groundY + Math.random() * (roofY - groundY);
    out[i * 3 + 0] = x;
    out[i * 3 + 1] = y;
    out[i * 3 + 2] = (Math.random() - 0.5) * 0.6;
  }
}

function makeHexGrid(out: Float32Array) {
  const cols = 30;
  const rows = Math.ceil(N / cols);
  const sx = 0.4;
  const sy = 0.34;
  for (let i = 0; i < N; i++) {
    const c = i % cols;
    const r = Math.floor(i / cols);
    const offset = r % 2 === 0 ? 0 : sx / 2;
    out[i * 3 + 0] = (c - cols / 2) * sx + offset;
    out[i * 3 + 1] = -1.6 + r * sy * 0.6 - rows * sy * 0.3;
    out[i * 3 + 2] = -1.5 - (r / rows) * 4;
  }
}

function makeTunnel(out: Float32Array) {
  for (let i = 0; i < N; i++) {
    const ring = Math.floor(i / 60);
    const a = ((i % 60) / 60) * Math.PI * 2;
    const r = 2.0 + Math.sin(ring * 0.3) * 0.15;
    const z = -ring * 0.4 + 4;
    out[i * 3 + 0] = Math.cos(a) * r;
    out[i * 3 + 1] = Math.sin(a) * r;
    out[i * 3 + 2] = z;
  }
}

function makeDispersed(out: Float32Array) {
  for (let i = 0; i < N; i++) {
    out[i * 3 + 0] = (Math.random() - 0.5) * 24;
    out[i * 3 + 1] = (Math.random() - 0.5) * 14;
    out[i * 3 + 2] = (Math.random() - 0.5) * 18 - 4;
  }
}

const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
const clamp01 = (x: number) => Math.max(0, Math.min(1, x));

export function ScrollScene({ mobile }: { mobile?: boolean }) {
  const pointsRef = useRef<THREE.Points>(null);
  const matRef = useRef<THREE.PointsMaterial>(null);
  const { gl } = useThree();
  const progress = useRef(0);
  const renderProgress = useRef(0);
  const cameraTargetZ = useRef(8);

  // Pre-generated target arrays
  const targets = useMemo(() => {
    const arr: Float32Array[] = [];
    [makeGlobe, makeConstellation, makeStack, makeFactory, makeHexGrid, makeTunnel, makeDispersed].forEach(
      (fn) => {
        const t = new Float32Array(N * 3);
        fn(t);
        arr.push(t);
      }
    );
    return arr;
  }, []);

  const positions = useMemo(() => {
    const p = new Float32Array(N * 3);
    targets[0].forEach((v, i) => (p[i] = v));
    return p;
  }, [targets]);

  const geometry = useMemo(() => {
    const g = new THREE.BufferGeometry();
    g.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    return g;
  }, [positions]);

  // subscribe to global scroll
  useEffect(() => {
    const update = () => {
      const h = document.documentElement;
      const max = h.scrollHeight - h.clientHeight;
      progress.current = max > 0 ? (window.scrollY || h.scrollTop) / max : 0;
    };
    update();
    let raf = 0;
    const onScroll = () => {
      if (raf) return;
      raf = requestAnimationFrame(() => {
        update();
        raf = 0;
      });
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);

  useFrame((state, delta) => {
    // Smooth render-side scroll lerp for buttery transitions
    renderProgress.current = lerp(renderProgress.current, progress.current, 0.06);
    const p = renderProgress.current;

    // Map global progress 0..1 → segment index 0..6 (7 targets)
    const segCount = targets.length - 1; // 6 transitions
    const seg = p * segCount;
    const i0 = Math.min(segCount - 1, Math.floor(seg));
    const i1 = i0 + 1;
    const localT = clamp01(seg - i0);

    const a = targets[i0];
    const b = targets[i1];
    const arr = geometry.attributes.position.array as Float32Array;
    const t = state.clock.elapsedTime;
    for (let i = 0; i < N; i++) {
      const ix = i * 3;
      const drift = Math.sin(t * 0.4 + i * 0.13) * 0.015;
      arr[ix + 0] = lerp(a[ix + 0], b[ix + 0], localT) + drift;
      arr[ix + 1] = lerp(a[ix + 1], b[ix + 1], localT) + Math.cos(t * 0.5 + i * 0.07) * 0.012;
      arr[ix + 2] = lerp(a[ix + 2], b[ix + 2], localT) + drift * 0.7;
    }
    geometry.attributes.position.needsUpdate = true;

    if (pointsRef.current) {
      // Subtle global rotation that varies by act
      const rotY = lerp(0, Math.PI * 0.6, p) + t * 0.03;
      pointsRef.current.rotation.y = rotY * (1 - clamp01(p * 1.6 - 0.5));
      pointsRef.current.rotation.x = Math.sin(t * 0.15) * 0.05;
    }

    // Color: shift toward flag-blue during Act 5 (federal — ~0.65–0.80)
    if (matRef.current) {
      const fed = clamp01((p - 0.6) * 5) * (1 - clamp01((p - 0.85) * 6));
      const c = COLOR_SIGNAL.clone().lerp(COLOR_FLAG_BLUE, fed * 0.55);
      // brighten near final tunnel
      const trj = clamp01((p - 0.78) * 5);
      c.lerp(COLOR_BONE, trj * 0.25);
      matRef.current.color.copy(c);
      matRef.current.opacity = lerp(0.8, 0.15, clamp01((p - 0.92) * 12));
    }

    // Camera: slow dolly in through stack, pull back at federal, tunnel rush
    cameraTargetZ.current = (() => {
      if (p < 0.25) return 7.4;
      if (p < 0.5) return 6.4;
      if (p < 0.65) return 7.8;
      if (p < 0.8) return 7.0;
      if (p < 0.92) return 5.4;
      return 8.5;
    })();
    state.camera.position.z = lerp(state.camera.position.z, cameraTargetZ.current, 0.04);
    state.camera.position.x = Math.sin(t * 0.1) * 0.15;
    state.camera.lookAt(0, 0, 0);

    gl.setClearColor("#05070A", 1);
  });

  return (
    <>
      <points ref={pointsRef} geometry={geometry}>
        <pointsMaterial
          ref={matRef}
          size={mobile ? 0.025 : 0.022}
          color={COLOR_SIGNAL}
          transparent
          opacity={0.85}
          sizeAttenuation
          depthWrite={false}
          blending={THREE.AdditiveBlending}
        />
      </points>
      <ambientLight intensity={0.4} />
    </>
  );
}
