"use client";

import { useFrame, useThree } from "@react-three/fiber";
import { useEffect, useMemo, useRef } from "react";
import * as THREE from "three";

/**
 * Trainovate brand-driven scroll scene.
 *
 * Single persistent system with two layers:
 *   1) Bone-coloured particle field that morphs through 7 target shapes
 *      driven by global scroll progress (Globe → Constellation → Stack →
 *      Factory → Hex grid → Tunnel → Dispersed).
 *   2) A cobalt nucleus + flare halo at center — the same brand mark that
 *      ships in the original Intro, persistent through the experience and
 *      modulating intensity per act.
 */

const COBALT = new THREE.Color("#0046E6");
const FLARE = new THREE.Color("#FF6B1A");
const BONE = new THREE.Color("#F4F1EA");

const N = 1800;

function makeGlobe(out: Float32Array) {
  const r = 2.6;
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
    [-3.4, 1.2, 0],
    [-1.4, -1.7, 0.3],
    [0.4, 1.8, -0.4],
    [2.2, -0.6, 0.2],
    [3.6, 1.4, -0.3],
  ];
  for (let i = 0; i < N; i++) {
    const a = anchors[i % anchors.length];
    const r = Math.pow(Math.random(), 1.4) * 0.9;
    const t = Math.random() * Math.PI * 2;
    const p = Math.acos(2 * Math.random() - 1);
    out[i * 3 + 0] = a[0] + r * Math.sin(p) * Math.cos(t);
    out[i * 3 + 1] = a[1] + r * Math.sin(p) * Math.sin(t);
    out[i * 3 + 2] = a[2] + r * Math.cos(p);
  }
}

function makeStack(out: Float32Array) {
  const slabs = [
    { y: 1.9, w: 4.0, d: 0.5, h: 0.55 },
    { y: 0.65, w: 4.0, d: 0.5, h: 0.55 },
    { y: -0.65, w: 4.0, d: 0.5, h: 0.55 },
    { y: -1.9, w: 4.0, d: 0.5, h: 0.55 },
  ];
  for (let i = 0; i < N; i++) {
    const s = slabs[i % slabs.length];
    out[i * 3 + 0] = (Math.random() - 0.5) * s.w;
    out[i * 3 + 1] = s.y + (Math.random() - 0.5) * s.h;
    out[i * 3 + 2] = (Math.random() - 0.5) * s.d;
  }
}

function makeFactory(out: Float32Array) {
  for (let i = 0; i < N; i++) {
    const x = (Math.random() - 0.5) * 10;
    const sawtooth = Math.abs(((x + 5) % 1.5) - 0.75);
    const groundY = -2.2;
    const roofY = -0.4 - sawtooth * 1.0;
    const y = groundY + Math.random() * (roofY - groundY);
    out[i * 3 + 0] = x;
    out[i * 3 + 1] = y;
    out[i * 3 + 2] = (Math.random() - 0.5) * 0.7;
  }
}

function makeHexGrid(out: Float32Array) {
  const cols = 36;
  const rows = Math.ceil(N / cols);
  const sx = 0.36;
  const sy = 0.32;
  for (let i = 0; i < N; i++) {
    const c = i % cols;
    const r = Math.floor(i / cols);
    const offset = r % 2 === 0 ? 0 : sx / 2;
    out[i * 3 + 0] = (c - cols / 2) * sx + offset;
    out[i * 3 + 1] = -1.7 + r * sy * 0.55 - rows * sy * 0.28;
    out[i * 3 + 2] = -1.5 - (r / rows) * 4.5;
  }
}

function makeTunnel(out: Float32Array) {
  const ringSize = 50;
  for (let i = 0; i < N; i++) {
    const ring = Math.floor(i / ringSize);
    const a = ((i % ringSize) / ringSize) * Math.PI * 2;
    const r = 2.2 + Math.sin(ring * 0.3) * 0.18;
    const z = -ring * 0.5 + 5;
    out[i * 3 + 0] = Math.cos(a) * r;
    out[i * 3 + 1] = Math.sin(a) * r;
    out[i * 3 + 2] = z;
  }
}

function makeDispersed(out: Float32Array) {
  for (let i = 0; i < N; i++) {
    out[i * 3 + 0] = (Math.random() - 0.5) * 28;
    out[i * 3 + 1] = (Math.random() - 0.5) * 16;
    out[i * 3 + 2] = (Math.random() - 0.5) * 20 - 4;
  }
}

const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
const clamp01 = (x: number) => Math.max(0, Math.min(1, x));

export function ScrollScene({ mobile }: { mobile?: boolean }) {
  const pointsRef = useRef<THREE.Points>(null);
  const matRef = useRef<THREE.PointsMaterial>(null);
  const nucleusRef = useRef<THREE.Mesh>(null);
  const nucleusMatRef = useRef<THREE.MeshBasicMaterial>(null);
  const haloRef = useRef<THREE.Sprite>(null);
  const haloMatRef = useRef<THREE.SpriteMaterial>(null);
  const { gl } = useThree();
  const progress = useRef(0);
  const renderProgress = useRef(0);

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

  // Halo sprite — soft flare-orange radial gradient on a CanvasTexture
  const haloTex = useMemo(() => {
    const c = document.createElement("canvas");
    c.width = c.height = 256;
    const ctx = c.getContext("2d")!;
    const grd = ctx.createRadialGradient(128, 128, 0, 128, 128, 128);
    grd.addColorStop(0.0, "rgba(255, 138, 69, 0.95)");
    grd.addColorStop(0.35, "rgba(255, 107, 26, 0.55)");
    grd.addColorStop(1.0, "rgba(255, 107, 26, 0)");
    ctx.fillStyle = grd;
    ctx.fillRect(0, 0, 256, 256);
    return new THREE.CanvasTexture(c);
  }, []);

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

  useFrame((state) => {
    renderProgress.current = lerp(renderProgress.current, progress.current, 0.06);
    const p = renderProgress.current;
    const t = state.clock.elapsedTime;

    // Morph particles between targets
    const segCount = targets.length - 1;
    const seg = p * segCount;
    const i0 = Math.min(segCount - 1, Math.floor(seg));
    const i1 = i0 + 1;
    const localT = clamp01(seg - i0);

    const a = targets[i0];
    const b = targets[i1];
    const arr = geometry.attributes.position.array as Float32Array;
    for (let i = 0; i < N; i++) {
      const ix = i * 3;
      const drift = Math.sin(t * 0.4 + i * 0.13) * 0.018;
      arr[ix + 0] = lerp(a[ix + 0], b[ix + 0], localT) + drift;
      arr[ix + 1] = lerp(a[ix + 1], b[ix + 1], localT) + Math.cos(t * 0.5 + i * 0.07) * 0.014;
      arr[ix + 2] = lerp(a[ix + 2], b[ix + 2], localT) + drift * 0.7;
    }
    geometry.attributes.position.needsUpdate = true;

    if (pointsRef.current) {
      pointsRef.current.rotation.y = t * 0.04 + p * 0.5;
      pointsRef.current.rotation.x = Math.sin(t * 0.15) * 0.05;
    }

    // Particle color: bone in hero, drift toward cobalt by federal act,
    // brighten near tunnel, fade out at contact
    if (matRef.current) {
      const fed = clamp01((p - 0.55) * 4);
      const col = BONE.clone().lerp(COBALT, fed * 0.55);
      const trj = clamp01((p - 0.78) * 5);
      col.lerp(BONE, trj * 0.4);
      matRef.current.color.copy(col);
      matRef.current.opacity = 0.85 * (1 - clamp01((p - 0.93) * 14));
    }

    // Nucleus: cobalt sphere — strongest in hero, subtle through middle, accent near tunnel
    if (nucleusRef.current && nucleusMatRef.current) {
      const heroIntensity = 1 - clamp01(p * 5);          // strong 0–0.2
      const tunnelIntensity = clamp01((p - 0.78) * 6) * (1 - clamp01((p - 0.93) * 14));
      const intensity = Math.max(heroIntensity, tunnelIntensity * 0.85, 0.08);
      nucleusMatRef.current.opacity = intensity * 0.9;
      const scale = lerp(0.4, 1.2, intensity);
      nucleusRef.current.scale.setScalar(scale);
      nucleusRef.current.position.x = Math.sin(t * 0.3) * 0.08;
    }

    // Halo: flare orange — pulses through whole experience, peaks in hero
    if (haloRef.current && haloMatRef.current) {
      const heroBoost = 1 - clamp01(p * 3.5);
      const pulse = 0.12 * Math.sin(t * 1.2);
      const baseline = 0.35 + heroBoost * 0.55;
      haloMatRef.current.opacity = clamp01(baseline + pulse) * (1 - clamp01((p - 0.93) * 14));
      const haloScale = lerp(7, 11, heroBoost) + Math.sin(t * 0.6) * 0.3;
      haloRef.current.scale.set(haloScale, haloScale, 1);
    }

    // Camera per act
    const camZ = (() => {
      if (p < 0.18) return 7.6;
      if (p < 0.4) return 6.8;
      if (p < 0.6) return 6.4;
      if (p < 0.78) return 7.2;
      if (p < 0.92) return 5.0;
      return 9.0;
    })();
    state.camera.position.z = lerp(state.camera.position.z, camZ, 0.04);
    state.camera.position.x = Math.sin(t * 0.1) * 0.12;
    state.camera.lookAt(0, 0, 0);

    gl.setClearColor("#0A0A0A", 1);
  });

  return (
    <>
      {/* Halo — flare orange behind everything */}
      <sprite ref={haloRef} scale={[10, 10, 1]}>
        <spriteMaterial
          ref={haloMatRef}
          map={haloTex}
          transparent
          opacity={0.9}
          depthWrite={false}
          blending={THREE.AdditiveBlending}
        />
      </sprite>

      {/* Cobalt nucleus */}
      <mesh ref={nucleusRef}>
        <sphereGeometry args={[1.2, 32, 32]} />
        <meshBasicMaterial
          ref={nucleusMatRef}
          color={COBALT}
          transparent
          opacity={0.9}
          depthWrite={false}
        />
      </mesh>

      {/* Particle field */}
      <points ref={pointsRef} geometry={geometry}>
        <pointsMaterial
          ref={matRef}
          size={mobile ? 0.028 : 0.024}
          color={BONE}
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
