"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FcGoogle } from "react-icons/fc";
import { HiXMark, HiEye, HiEyeSlash } from "react-icons/hi2";

type Vista = "login" | "registro" | "recuperar";

export default function AuthModal() {
  const [abierto, setAbierto] = useState(true);
  const [vista, setVista] = useState<Vista>("login");
  const [verPassword, setVerPassword] = useState(false);

  const cerrar = () => setAbierto(false);

  /* ─── Backdrop ─── */
  return (
    <AnimatePresence>
      {abierto && (
        <motion.div
          className="fixed inset-0 z-[100] flex items-center justify-center p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.25 }}
        >
          {/* Blur backdrop */}
          <motion.div
            className="absolute inset-0 bg-black/40 backdrop-blur-md"
            onClick={cerrar}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          />

          {/* Modal */}
          <motion.div
            className="relative w-full max-w-sm rounded-3xl bg-white p-8 shadow-2xl"
            initial={{ scale: 0.9, y: 30, opacity: 0 }}
            animate={{ scale: 1, y: 0, opacity: 1 }}
            exit={{ scale: 0.9, y: 30, opacity: 0 }}
            transition={{ type: "spring", stiffness: 300, damping: 25 }}
          >
            {/* Cerrar */}
            <button
              onClick={cerrar}
              className="absolute top-4 right-4 flex h-8 w-8 items-center justify-center rounded-full text-neutral-400 transition-colors hover:bg-neutral-100 hover:text-neutral-600"
            >
              <HiXMark className="text-lg" />
            </button>

            {/* ─── Contenido según vista ─── */}
            <AnimatePresence mode="wait">
              {vista === "login" && <VistaLogin key="login" irA={setVista} cerrar={cerrar} verPassword={verPassword} togglePassword={() => setVerPassword(!verPassword)} />}
              {vista === "registro" && <VistaRegistro key="registro" irA={setVista} verPassword={verPassword} togglePassword={() => setVerPassword(!verPassword)} />}
              {vista === "recuperar" && <VistaRecuperar key="recuperar" irA={setVista} />}
            </AnimatePresence>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

/* ═══════════════════════════════════════
   VISTA: LOGIN
   ═══════════════════════════════════════ */
function VistaLogin({
  irA,
  cerrar,
  verPassword,
  togglePassword,
}: {
  irA: (v: Vista) => void;
  cerrar: () => void;
  verPassword: boolean;
  togglePassword: () => void;
}) {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Aquí irá Supabase signIn
    cerrar();
  };

  return (
    <motion.div
      initial={{ x: -20, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      exit={{ x: 20, opacity: 0 }}
      transition={{ duration: 0.2 }}
    >
      <h2 className="text-neutral-800 text-xl font-bold text-center">
        Inicia sesión
      </h2>
      <p className="mt-2 text-neutral-400 text-sm text-center">
        Para una mejor experiencia, regístrate con nosotros
      </p>

      {/* Google */}
      <button
        type="button"
        className="mt-6 flex w-full items-center justify-center gap-3 rounded-xl border border-neutral-200 px-4 py-3 text-sm font-medium text-neutral-600 transition-colors hover:bg-neutral-50"
      >
        <FcGoogle className="text-lg" />
        Continuar con Google
      </button>

      {/* Separador */}
      <div className="my-6 flex items-center gap-3">
        <div className="h-px flex-1 bg-neutral-200" />
        <span className="text-neutral-400 text-xs">o con email</span>
        <div className="h-px flex-1 bg-neutral-200" />
      </div>

      {/* Formulario */}
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="email"
          placeholder="Correo electrónico"
          required
          className="w-full rounded-xl border border-neutral-200 bg-neutral-50 px-4 py-3 text-sm text-neutral-800 placeholder:text-neutral-400 outline-none transition-colors focus:border-pastel-red/50 focus:ring-2 focus:ring-pastel-red/10"
        />
        <div className="relative">
          <input
            type={verPassword ? "text" : "password"}
            placeholder="Contraseña"
            required
            className="w-full rounded-xl border border-neutral-200 bg-neutral-50 px-4 py-3 pr-11 text-sm text-neutral-800 placeholder:text-neutral-400 outline-none transition-colors focus:border-pastel-red/50 focus:ring-2 focus:ring-pastel-red/10"
          />
          <button
            type="button"
            onClick={togglePassword}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-neutral-600"
          >
            {verPassword ? <HiEyeSlash className="text-lg" /> : <HiEye className="text-lg" />}
          </button>
        </div>

        <button
          type="submit"
          className="w-full rounded-xl bg-pastel-red py-3 text-sm font-semibold text-white transition-all hover:bg-pastel-red-hover hover:shadow-lg hover:shadow-pastel-red/20"
        >
          Entrar
        </button>
        <button
          onClick={cerrar}
          className="w-full rounded-xl bg-gray-200 py-3 text-sm font-semibold text-white transition-all hover:bg-gray-400 hover:shadow-lg hover:shadow-gray/20"
        >
          Continuar Sin intenficarse
        </button>
      </form>

      {/* Links */}
      <div className="mt-5 flex flex-col items-center gap-2">
        <button
          onClick={() => irA("recuperar")}
          className="text-pastel-red/70 text-xs hover:text-pastel-red transition-colors"
        >
          ¿Olvidaste tu contraseña?
        </button>
        <p className="text-neutral-400 text-xs">
          ¿No tienes cuenta?{" "}
          <button
            onClick={() => irA("registro")}
            className="text-pastel-red font-medium hover:text-pastel-red-hover transition-colors"
          >
            Crear cuenta
          </button>
        </p>
      </div>
    </motion.div>
  );
}

/* ═══════════════════════════════════════
   VISTA: REGISTRO
   ═══════════════════════════════════════ */
function VistaRegistro({
  irA,
  verPassword,
  togglePassword,
}: {
  irA: (v: Vista) => void;
  verPassword: boolean;
  togglePassword: () => void;
}) {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Aquí irá Supabase signUp
  };

  return (
    <motion.div
      initial={{ x: 20, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      exit={{ x: -20, opacity: 0 }}
      transition={{ duration: 0.2 }}
    >
      <h2 className="text-neutral-800 text-xl font-bold text-center">
        Crea tu cuenta
      </h2>
      <p className="mt-2 text-neutral-400 text-sm text-center">
        Regístrate para ordenar y seguir tus pedidos
      </p>

      {/* Google */}
      <button
        type="button"
        className="mt-6 flex w-full items-center justify-center gap-3 rounded-xl border border-neutral-200 px-4 py-3 text-sm font-medium text-neutral-600 transition-colors hover:bg-neutral-50"
      >
        <FcGoogle className="text-lg" />
        Registrarse con Google
      </button>

      {/* Separador */}
      <div className="my-6 flex items-center gap-3">
        <div className="h-px flex-1 bg-neutral-200" />
        <span className="text-neutral-400 text-xs">o con email</span>
        <div className="h-px flex-1 bg-neutral-200" />
      </div>

      {/* Formulario */}
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          placeholder="Nombre completo"
          required
          className="w-full rounded-xl border border-neutral-200 bg-neutral-50 px-4 py-3 text-sm text-neutral-800 placeholder:text-neutral-400 outline-none transition-colors focus:border-pastel-red/50 focus:ring-2 focus:ring-pastel-red/10"
        />
        <input
          type="email"
          placeholder="Correo electrónico"
          required
          className="w-full rounded-xl border border-neutral-200 bg-neutral-50 px-4 py-3 text-sm text-neutral-800 placeholder:text-neutral-400 outline-none transition-colors focus:border-pastel-red/50 focus:ring-2 focus:ring-pastel-red/10"
        />
        <div className="relative">
          <input
            type={verPassword ? "text" : "password"}
            placeholder="Contraseña"
            required
            minLength={6}
            className="w-full rounded-xl border border-neutral-200 bg-neutral-50 px-4 py-3 pr-11 text-sm text-neutral-800 placeholder:text-neutral-400 outline-none transition-colors focus:border-pastel-red/50 focus:ring-2 focus:ring-pastel-red/10"
          />
          <button
            type="button"
            onClick={togglePassword}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-neutral-600"
          >
            {verPassword ? <HiEyeSlash className="text-lg" /> : <HiEye className="text-lg" />}
          </button>
        </div>

        <button
          type="submit"
          className="w-full rounded-xl bg-pastel-red py-3 text-sm font-semibold text-white transition-all hover:bg-pastel-red-hover hover:shadow-lg hover:shadow-pastel-red/20"
        >
          Crear cuenta
        </button>
      </form>

      {/* Link volver */}
      <div className="mt-5 text-center">
        <p className="text-neutral-400 text-xs">
          ¿Ya tienes cuenta?{" "}
          <button
            onClick={() => irA("login")}
            className="text-pastel-red font-medium hover:text-pastel-red-hover transition-colors"
          >
            Iniciar sesión
          </button>
        </p>
      </div>
    </motion.div>
  );
}

/* ═══════════════════════════════════════
   VISTA: RECUPERAR CONTRASEÑA
   ═══════════════════════════════════════ */
function VistaRecuperar({ irA }: { irA: (v: Vista) => void }) {
  const [enviado, setEnviado] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Aquí irá Supabase resetPassword
    setEnviado(true);
  };

  return (
    <motion.div
      initial={{ x: 20, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      exit={{ x: -20, opacity: 0 }}
      transition={{ duration: 0.2 }}
    >
      <h2 className="text-neutral-800 text-xl font-bold text-center">
        Recuperar contraseña
      </h2>

      {enviado ? (
        <div className="mt-6 text-center">
          <p className="text-neutral-500 text-sm leading-relaxed">
            Te enviamos un enlace a tu correo para restablecer tu contraseña.
            Revisa también la carpeta de spam.
          </p>
          <button
            onClick={() => irA("login")}
            className="mt-6 text-pastel-red text-sm font-medium hover:text-pastel-red-hover transition-colors"
          >
            Volver al inicio de sesión
          </button>
        </div>
      ) : (
        <>
          <p className="mt-2 text-neutral-400 text-sm text-center">
            Ingresa tu correo y te enviaremos un enlace de recuperación
          </p>

          <form onSubmit={handleSubmit} className="mt-6 space-y-4">
            <input
              type="email"
              placeholder="Correo electrónico"
              required
              className="w-full rounded-xl border border-neutral-200 bg-neutral-50 px-4 py-3 text-sm text-neutral-800 placeholder:text-neutral-400 outline-none transition-colors focus:border-pastel-red/50 focus:ring-2 focus:ring-pastel-red/10"
            />
            <button
              type="submit"
              className="w-full rounded-xl bg-pastel-red py-3 text-sm font-semibold text-white transition-all hover:bg-pastel-red-hover hover:shadow-lg hover:shadow-pastel-red/20"
            >
              Enviar enlace
            </button>
          </form>

          <div className="mt-5 text-center">
            <button
              onClick={() => irA("login")}
              className="text-pastel-red/70 text-xs hover:text-pastel-red transition-colors"
            >
              ← Volver al inicio de sesión
            </button>
          </div>
        </>
      )}
    </motion.div>
  );
}