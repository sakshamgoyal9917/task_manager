import { useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";

const Modal = ({
  isOpen,
  onClose,
  title,
  children,
}) => {
  // ─────────────────────────────────────────────
  // Close on ESC
  // ─────────────────────────────────────────────
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape") {
        onClose?.();
      }
    };

    if (isOpen) {
      document.addEventListener(
        "keydown",
        handleKeyDown
      );
    }

    return () => {
      document.removeEventListener(
        "keydown",
        handleKeyDown
      );
    };
  }, [isOpen, onClose]);

  // ─────────────────────────────────────────────
  // Prevent body scroll
  // ─────────────────────────────────────────────
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }

    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{
            opacity: 0,
          }}
          animate={{
            opacity: 1,
          }}
          exit={{
            opacity: 0,
          }}
          transition={{
            duration: 0.2,
          }}
          className="
            fixed
            inset-0
            z-50
            flex
            items-center
            justify-center
            p-4
          "
        >
          {/* ─────────────────────────────────────────────
              Backdrop
          ───────────────────────────────────────────── */}
          <div
            className="
              absolute
              inset-0
              bg-black/70
              backdrop-blur-md
            "
            onClick={() => onClose?.()}
          />

          {/* ─────────────────────────────────────────────
              Modal
          ───────────────────────────────────────────── */}
          <motion.div
            initial={{
              opacity: 0,
              y: 30,
              scale: 0.95,
            }}
            animate={{
              opacity: 1,
              y: 0,
              scale: 1,
            }}
            exit={{
              opacity: 0,
              y: 20,
              scale: 0.96,
            }}
            transition={{
              type: "spring",
              stiffness: 260,
              damping: 22,
            }}
            onClick={(e) =>
              e.stopPropagation()
            }
            className="
              relative
              w-full
              max-w-lg
              overflow-hidden
              rounded-3xl
              border
              border-white/10
              bg-[rgba(15,23,42,0.88)]
              shadow-2xl
              backdrop-blur-2xl
            "
          >
            {/* Glow Effects */}
            <div
              className="
                absolute
                -top-24
                -right-24
                h-48
                w-48
                rounded-full
                bg-indigo-500/20
                blur-3xl
                pointer-events-none
              "
            />

            <div
              className="
                absolute
                -bottom-20
                -left-20
                h-40
                w-40
                rounded-full
                bg-violet-500/10
                blur-3xl
                pointer-events-none
              "
            />

            {/* ─────────────────────────────────────────────
                Header
            ───────────────────────────────────────────── */}
            <div
              className="
                relative
                flex
                items-center
                justify-between
                border-b
                border-white/10
                px-6
                py-5
              "
            >
              <div>
                <h3
                  className="
                    text-xl
                    font-bold
                    tracking-tight
                    text-white
                  "
                >
                  {title}
                </h3>

                <p
                  className="
                    mt-1
                    text-sm
                    text-slate-400
                  "
                >
                  Manage your workspace details
                </p>
              </div>

              {/* Close Button */}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onClose?.();
                }}
                className="
                  flex
                  h-10
                  w-10
                  items-center
                  justify-center
                  rounded-2xl
                  border
                  border-white/10
                  bg-white/5
                  text-slate-400
                  transition-all
                  duration-200
                  hover:bg-white/10
                  hover:text-white
                "
              >
                <X size={18} />
              </button>
            </div>

            {/* ─────────────────────────────────────────────
                Content
            ───────────────────────────────────────────── */}
            <div className="relative px-6 py-6">
              {children}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default Modal;