"use client";

import { Canvas, useFrame, extend } from "@react-three/fiber";
import { Suspense, useEffect, useMemo, useRef, useState } from "react";
import * as THREE from "three";

extend({ Line_: THREE.Line });

/**
 * Radar / GPS backdrop — quieter persistent scene used on /federal and
 * /about. Concentric rings + sweep arc + blip clusters + a slow contour
 * grid. Cobalt + flare brand palette.
 */

const COBALT = new THREE.Color("#0046E6");
const FLARE = new THREE.Color("#FF6B1A");
const BONE = new THREE.Color("#F4F1EA");

const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

function buildRingGeometry(radius: number, segments = 128) {
  const positions = new Float32Array((segments + 1) * 3);
  for (let i = 0; i <= segments; i++) {
    const a = (i / segments) * Math.PI * 2;
    positions[i * 3 + 0] = Math.cos(a) * radius;
    positions[i * 3 + 1] = Math.sin(a) * radius;
    positions[i * 3 + 2] = 0;
  }
  const g = new THREE.BufferGeometry();
  g.setAttribute("position", new THREE.BufferAttribute(positions, 3));
  return g;
}

function buildSweepGeometry(radius: number, arc: number, segments = 48) {
  const positions = new Float32Array((segments + 2) * 3);
  positions[0] = 0;
  positions[1] = 0;
  positions[2] = 0;
  for (let i = 0; i <= segments; i++) {
    const a = (i / segments) * arc;
    positions[(i + 1) * 3 + 0] = Math.cos(a) * radius;
    positions[(i + 1) * 3 + 1] = Math.sin(a) * radius;
    positions[(i + 1) * 3 + 2] = 0;
  }
  const indices: number[] = [];
  for (let i = 1; i <= segments; i++) indices.push(0, i, i + 1);
  const g = new THREE.BufferGeometry();
  g.setAttribute("position", new THREE.BufferAttribute(positions, 3));
  g.setIndex(indices);
  g.computeVertexNormals();
  return g;
}

function buildCrosshairGeometry(extent: number) {
  const arr = new Float32Array([
    -extent, 0, 0,
    extent, 0, 0,
    0, -extent, 0,
    0, extent, 0,
  ]);
  const g = new THREE.BufferGeometry();
  g.setAttribute("position", new THREE.BufferAttribute(arr, 3));
  return g;
}

function RadarScene() {
  const sweepGroupRef = useRef<THREE.Group>(null);
  const ringsRef = useRef<THREE.Group>(null);
  const blipsRef = useRef<THREE.Points>(null);
  const blipsMatRef = useRef<THREE.PointsMaterial>(null);
  const gridRef = useRef<THREE.Mesh>(null);
  const sweepLineGeo = useMemo(() => {
    const arr = new Float32Array([0, 0, 0, 4.1, 0, 0]);
    const g = new THREE.BufferGeometry();
    g.setAttribute("position", new THREE.BufferAttribute(arr, 3));
    return g;
  }, []);
  const mouse = useRef({ x: 0, y: 0 });
  const mouseLerped = useRef({ x: 0, y: 0 });

  const ringRadii = useMemo(() => [0.9, 1.7, 2.5, 3.3, 4.1], []);
  const ringGeoms = useMemo(() => ringRadii.map((r) => buildRingGeometry(r)), [ringRadii]);
  const sweepGeo = useMemo(() => buildSweepGeometry(4.1, Math.PI / 4), []);
  const crosshairGeo = useMemo(() => buildCrosshairGeometry(4.2), []);

  const blipGeo = useMemo(() => {
    const N = 36;
    const arr = new Float32Array(N * 3);
    for (let i = 0; i < N; i++) {
      const a = Math.random() * Math.PI * 2;
      const r = 0.6 + Math.pow(Math.random(), 0.7) * 3.6;
      arr[i * 3 + 0] = Math.cos(a) * r;
      arr[i * 3 + 1] = Math.sin(a) * r;
      arr[i * 3 + 2] = 0.02;
    }
    const g = new THREE.BufferGeometry();
    g.setAttribute("position", new THREE.BufferAttribute(arr, 3));
    return g;
  }, []);

  const gridGeo = useMemo(() => {
    const seg = 28;
    const g = new THREE.PlaneGeometry(14, 14, seg, seg);
    const pos = g.attributes.position;
    for (let i = 0; i < pos.count; i++) {
      const x = pos.getX(i);
      const y = pos.getY(i);
      const z = Math.sin(x * 0.8) * 0.12 + Math.cos(y * 0.7) * 0.12;
      pos.setZ(i, z);
    }
    pos.needsUpdate = true;
    g.computeVertexNormals();
    return g;
  }, []);

  // Pre-built Line objects for rings + crosshairs (avoids the JSX `<line>`
  // / SVG-line type collision)
  const ringLines = useMemo(
    () =>
      ringGeoms.map(
        (g, i) =>
          new THREE.Line(
            g,
            new THREE.LineBasicMaterial({
              color: i === 2 ? FLARE : COBALT,
              transparent: true,
              opacity: i === 2 ? 0.55 : 0.35 - i * 0.03,
              depthWrite: false,
            })
          )
      ),
    [ringGeoms]
  );

  const crosshairLines = useMemo(
    () =>
      new THREE.LineSegments(
        crosshairGeo,
        new THREE.LineBasicMaterial({
          color: COBALT,
          transparent: true,
          opacity: 0.18,
        })
      ),
    [crosshairGeo]
  );

  const sweepLine = useMemo(
    () =>
      new THREE.Line(
        sweepLineGeo,
        new THREE.LineBasicMaterial({ color: FLARE, transparent: true, opacity: 0.85 })
      ),
    [sweepLineGeo]
  );

  useEffect(() => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce) return;
    const onMove = (e: MouseEvent) => {
      mouse.current.x = (e.clientX / window.innerWidth) * 2 - 1;
      mouse.current.y = (e.clientY / window.innerHeight) * 2 - 1;
    };
    window.addEventListener("mousemove", onMove, { passive: true });
    return () => window.removeEventListener("mousemove", onMove);
  }, []);

  useFrame((state) => {
    const t = state.clock.elapsedTime;
    mouseLerped.current.x = lerp(mouseLerped.current.x, mouse.current.x, 0.04);
    mouseLerped.current.y = lerp(mouseLerped.current.y, mouse.current.y, 0.04);

    if (sweepGroupRef.current) sweepGroupRef.current.rotation.z = t * 0.55;
    if (ringsRef.current) ringsRef.current.rotation.z = -t * 0.02;

    if (gridRef.current) {
      gridRef.current.rotation.z = t * 0.015;
    }

    if (blipsRef.current && blipsMatRef.current) {
      blipsMatRef.current.opacity = 0.65 + 0.25 * Math.sin(t * 1.4);
    }

    state.camera.position.x = lerp(
      state.camera.position.x,
      Math.sin(t * 0.08) * 0.3 + mouseLerped.current.x * 0.4,
      0.06
    );
    state.camera.position.y = lerp(
      state.camera.position.y,
      Math.cos(t * 0.06) * 0.2 - mouseLerped.current.y * 0.25,
      0.06
    );
    state.camera.lookAt(0, 0, 0);
  });

  return (
    <group>
      {/* Topographic grid (deep) */}
      <mesh ref={gridRef} geometry={gridGeo} rotation={[-Math.PI / 2.3, 0, 0]} position={[0, -3, -2]}>
        <meshBasicMaterial color={COBALT} wireframe transparent opacity={0.18} />
      </mesh>

      {/* Concentric rings + crosshairs */}
      <group ref={ringsRef}>
        {ringLines.map((l, i) => (
          <primitive key={`ring-${i}`} object={l} />
        ))}
        <primitive object={crosshairLines} />
      </group>

      {/* Sweep group — both the arc and its leading edge rotate together */}
      <group ref={sweepGroupRef}>
        <mesh geometry={sweepGeo}>
          <meshBasicMaterial color={COBALT} transparent opacity={0.18} side={THREE.DoubleSide} depthWrite={false} />
        </mesh>
        <primitive object={sweepLine} />
      </group>

      {/* Blips */}
      <points ref={blipsRef} geometry={blipGeo}>
        <pointsMaterial
          ref={blipsMatRef}
          color={BONE}
          size={0.07}
          sizeAttenuation
          transparent
          opacity={0.8}
          depthWrite={false}
          blending={THREE.AdditiveBlending}
        />
      </points>

      {/* Center pip */}
      <mesh>
        <circleGeometry args={[0.06, 16]} />
        <meshBasicMaterial color={FLARE} />
      </mesh>

      <ambientLight intensity={0.4} />
    </group>
  );
}

export function RadarBackdrop() {
  const [mounted, setMounted] = useState(false);
  const [reduce, setReduce] = useState(false);

  useEffect(() => {
    setMounted(true);
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReduce(mq.matches);
    const on = () => setReduce(mq.matches);
    mq.addEventListener("change", on);
    return () => mq.removeEventListener("change", on);
  }, []);

  if (!mounted || reduce) {
    return (
      <div
        className="fixed inset-0 pointer-events-none"
        aria-hidden="true"
        style={{
          zIndex: 0,
          background:
            "radial-gradient(ellipse at 50% 50%, rgba(0,70,230,0.22), transparent 50%), radial-gradient(ellipse at 50% 70%, rgba(255,107,26,0.12), transparent 55%), #0A0A0A",
        }}
      >
        <div className="absolute inset-0 grid-noise opacity-30" />
      </div>
    );
  }

  return (
    <div
      className="fixed inset-0 pointer-events-none"
      aria-hidden="true"
      style={{ zIndex: 0 }}
    >
      <Canvas
        gl={{ antialias: true, alpha: false, powerPreference: "high-performance" }}
        dpr={[1, 2]}
        camera={{ position: [0, 0, 6.5], fov: 50 }}
        style={{ background: "#0A0A0A" }}
      >
        <Suspense fallback={null}>
          <RadarScene />
        </Suspense>
      </Canvas>
    </div>
  );
}
