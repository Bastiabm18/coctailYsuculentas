"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { GiCookingPot, GiCactus, GiPieSlice } from "react-icons/gi";
import Image from "next/image";

export default function HeroSection() {
  return (
    <div className="h-dvh overflow-hidden">
      <main className="grid h-full grid-cols-1 md:grid-cols-2">
        {/* ─── COCTELERÍA ─── */}
        <Link
          href="/cocteleria"
          className="group relative block overflow-hidden"
        >
          <motion.div
            className="flex h-[50dvh] md:h-dvh flex-col items-center justify-center gap-6 bg-pastel-peach px-8"
            whileHover="hover"
            initial="idle"
          >
            <motion.div
              className="pointer-events-none absolute -right-20 -top-20 h-72 w-72 rounded-full border-[40px] border-pastel-red/10"
              variants={{
                idle: { scale: 1, rotate: 0 },
                hover: { scale: 1.15, rotate: 15 },
              }}
              transition={{ type: "spring", stiffness: 120 }}
            />

            <motion.div
              className="pointer-events-none absolute -bottom-16 -left-16 h-56 w-56 rounded-full border-[30px] border-pastel-pink/15"
              variants={{
                idle: { scale: 1, rotate: 0 },
                hover: { scale: 1.1, rotate: -20 },
              }}
              transition={{ type: "spring", stiffness: 100 }}
            />

            <motion.div
              variants={{
                idle: { y: 0, rotate: 0 },
                hover: { y: -6, rotate: [-4, 4, -4, 0] },
              }}
              transition={{ duration: 0.5 }}
            >
              {/** 
               * 
              <GiPieSlice className="text-pastel-red text-7xl md:text-8xl drop-shadow-sm" />
              */}
              <Image alt='coctail' src='/coctail1.PNG' height={200} width={200}/>
            </motion.div>

            <div className="relative z-10 text-center">
              <h1 className="text-pastel-brown text-4xl font-bold tracking-tight md:text-6xl lg:text-7xl">
                Coctelería
              </h1>
              <p className="mt-3 text-pastel-brown/60 text-sm font-medium tracking-widest uppercase md:text-base">
                Bocados artesanales
              </p>
            </div>

            <motion.div
              className="mt-2 flex items-center gap-2 text-pastel-brown/40 text-xs tracking-wider uppercase"
              variants={{
                idle: { opacity: 0.5, x: 0 },
                hover: { opacity: 1, x: 4 },
              }}
              transition={{ duration: 0.3 }}
            >
              <span>Entrar</span>
              <svg
                width="16"
                height="16"
                viewBox="0 0 16 16"
                fill="none"
                className="inline-block"
              >
                <path
                  d="M3 8h10M9 4l4 4-4 4"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </motion.div>
          </motion.div>
        </Link>

        {/* ─── SUCULENTAS (sin cambios) ─── */}
        <Link
          href="/suculentas"
          className="group relative block overflow-hidden"
        >
          <motion.div
            className="flex h-[50dvh] md:h-dvh flex-col items-center justify-center gap-6 bg-terra px-8"
            whileHover="hover"
            initial="idle"
          >
            <motion.div
              className="pointer-events-none absolute -left-20 -bottom-20 h-72 w-72 rounded-full border-[40px] border-neutral-100/10"
              variants={{
                idle: { scale: 1, rotate: 0 },
                hover: { scale: 1.15, rotate: -15 },
              }}
              transition={{ type: "spring", stiffness: 120 }}
            />

            <motion.div
              className="pointer-events-none absolute -top-16 -right-16 h-56 w-56 rounded-full border-[30px] border-neutral-100/8"
              variants={{
                idle: { scale: 1, rotate: 0 },
                hover: { scale: 1.1, rotate: 20 },
              }}
              transition={{ type: "spring", stiffness: 100 }}
            />

            <motion.div
              variants={{
                idle: { y: 0, rotate: 0 },
                hover: { y: -6, rotate: [4, -4, 4, 0] },
              }}
              transition={{ duration: 0.5 }}
            >
              <GiCactus className="text-neutral-100 text-7xl md:text-8xl drop-shadow-sm" />
            </motion.div>

            <div className="relative z-10 text-center">
              <h1 className="text-neutral-100 text-4xl font-bold tracking-tight md:text-6xl lg:text-7xl">
                Suculentas
              </h1>
              <p className="mt-3 text-neutral-100/70 text-sm font-medium tracking-widest uppercase md:text-base">
                Naturaleza viva
              </p>
            </div>

            <motion.div
              className="mt-2 flex items-center gap-2 text-neutral-100/50 text-xs tracking-wider uppercase"
              variants={{
                idle: { opacity: 0.5, x: 0 },
                hover: { opacity: 1, x: 4 },
              }}
              transition={{ duration: 0.3 }}
            >
              <span>Entrar</span>
              <svg
                width="16"
                height="16"
                viewBox="0 0 16 16"
                fill="none"
                className="inline-block"
              >
                <path
                  d="M3 8h10M9 4l4 4-4 4"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </motion.div>
          </motion.div>
        </Link>
      </main>
    </div>
  );
}