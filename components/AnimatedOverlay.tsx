"use client";

import { useState, useEffect, useRef } from "react";

interface AnimatedOverlayProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
}

export default function AnimatedOverlay({
  isOpen,
  onClose,
  children,
}: AnimatedOverlayProps) {
  const [phase, setPhase] = useState<
    "unmounted" | "mounted" | "entering" | "exiting"
  >("unmounted");
  const childrenRef = useRef<React.ReactNode>(children);
  const rafRef = useRef<number | null>(null);
  const isOpenRef = useRef(isOpen);
  isOpenRef.current = isOpen;

  if (isOpen) {
    childrenRef.current = children;
  }

  // Cancel pending RAFs on unmount only
  useEffect(() => {
    return () => {
      if (rafRef.current !== null) {
        cancelAnimationFrame(rafRef.current);
      }
    };
  }, []);

  useEffect(() => {
    if (isOpen) {
      if (phase === "unmounted" || phase === "exiting") {
        setPhase("mounted");
        rafRef.current = requestAnimationFrame(() => {
          rafRef.current = requestAnimationFrame(() => {
            if (isOpenRef.current) {
              setPhase("entering");
            }
          });
        });
      }
    } else {
      if (rafRef.current !== null) {
        cancelAnimationFrame(rafRef.current);
        rafRef.current = null;
      }
      if (phase === "entering") {
        setPhase("exiting");
      } else if (phase === "mounted") {
        setPhase("unmounted");
      }
    }
  }, [isOpen, phase]);

  const handleAnimationEnd = (e: React.AnimationEvent) => {
    if (e.target !== e.currentTarget) return;
    if (phase === "exiting") {
      setPhase("unmounted");
    }
  };

  if (phase === "unmounted") return null;

  const overlayClass =
    phase === "entering"
      ? "overlay-enter"
      : phase === "exiting"
        ? "overlay-exit"
        : "overlay-before-enter";

  return (
    <div
      className={`fixed inset-0 bg-black/70 flex items-center justify-center z-50 ${overlayClass}`}
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
      onAnimationEnd={handleAnimationEnd}
    >
      {childrenRef.current}
    </div>
  );
}
