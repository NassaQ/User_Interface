import { useEffect, useRef, useState } from "react";

/**
 * Lightweight IntersectionObserver hook.
 * Returns a ref to attach to an element, and a boolean `inView`.
 * `once` — if true, only triggers the first time the element enters viewport.
 */
export function useInView<T extends HTMLElement = HTMLDivElement>(
  options?: IntersectionObserverInit & { once?: boolean }
) {
  const ref = useRef<T>(null);
  const [inView, setInView] = useState(false);
  const once = options?.once ?? true;

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
          if (once) {
            observer.unobserve(el);
          }
        } else if (!once) {
          setInView(false);
        }
      },
      { threshold: options?.threshold ?? 0.1, ...options }
    );

    observer.observe(el);
    return () => observer.disconnect();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return { ref, inView };
}
