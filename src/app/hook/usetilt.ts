"use client";

import { useRef, type PointerEvent } from "react";
import {
  useMotionValue,
  useMotionTemplate,
  useSpring,
  useTransform,
} from "framer-motion";

/** Inclinación 3D + holo + brillo que siguen al mouse. Compartido por todas las cartas. */
export function useTilt(max = 14) {
  const ref = useRef<HTMLElement>(null);

  const mx = useMotionValue(0.5);
  const my = useMotionValue(0.5);
  const hover = useMotionValue(0);

  const sx = useSpring(mx, { stiffness: 160, damping: 20 });
  const sy = useSpring(my, { stiffness: 160, damping: 20 });
  const sh = useSpring(hover, { stiffness: 120, damping: 20 });

  const rotateY = useTransform(sx, [0, 1], [-max, max]);
  const rotateX = useTransform(sy, [0, 1], [max, -max]);

  const px = useTransform(sx, [0, 1], [0, 100]);
  const py = useTransform(sy, [0, 1], [0, 100]);

  const holoPos = useMotionTemplate`${px}% ${py}%`;
  const holoOpacity = useTransform(sh, [0, 1], [0.35, 0.9]);

  const glare = useMotionTemplate`radial-gradient(circle at ${px}% ${py}%, rgba(255,255,255,.6), rgba(255,255,255,0) 55%)`;
  const glareOpacity = useTransform(sh, [0, 1], [0, 0.75]);

  // El rect se mide en el elemento estático (el que NO rota) para evitar saltos
  const handlers = {
    onPointerMove: (e: PointerEvent) => {
      const r = ref.current?.getBoundingClientRect();
      if (!r) return;
      mx.set((e.clientX - r.left) / r.width);
      my.set((e.clientY - r.top) / r.height);
    },
    onPointerEnter: () => hover.set(1),
    onPointerLeave: () => {
      mx.set(0.5);
      my.set(0.5);
      hover.set(0);
    },
  };

  return {
    ref,
    handlers,
    rotateX,
    rotateY,
    holoPos,
    holoOpacity,
    glare,
    glareOpacity,
  };
}