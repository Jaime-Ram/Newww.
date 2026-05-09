"use client";

import { useEffect, useRef, useState } from "react";

/** Alleen op muis/trackpad-met-hover; niet op telefoons / touch-primary. */
const CURSOR_MEDIA = "(pointer: fine) and (hover: hover)";

export default function CustomCursor() {
  const cursorRef = useRef<HTMLDivElement>(null);
  const [useCustomCursor, setUseCustomCursor] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia(CURSOR_MEDIA);
    const sync = () => setUseCustomCursor(mq.matches);
    sync();
    mq.addEventListener("change", sync);
    return () => mq.removeEventListener("change", sync);
  }, []);

  useEffect(() => {
    if (!useCustomCursor) return;

    const cursor = cursorRef.current;
    if (!cursor) return;

    const onMove = (e: MouseEvent) => {
      cursor.style.left = e.clientX + "px";
      cursor.style.top = e.clientY + "px";
    };

    const onEnter = () => cursor.classList.add("grow");
    const onLeave = () => cursor.classList.remove("grow");

    document.addEventListener("mousemove", onMove);

    const targets = document.querySelectorAll("a, button, .studio-cursor-expand");
    targets.forEach((el) => {
      el.addEventListener("mouseenter", onEnter);
      el.addEventListener("mouseleave", onLeave);
    });

    return () => {
      document.removeEventListener("mousemove", onMove);
      targets.forEach((el) => {
        el.removeEventListener("mouseenter", onEnter);
        el.removeEventListener("mouseleave", onLeave);
      });
      cursor.classList.remove("grow");
    };
  }, [useCustomCursor]);

  if (!useCustomCursor) return null;

  return <div ref={cursorRef} id="custom-cursor" />;
}
