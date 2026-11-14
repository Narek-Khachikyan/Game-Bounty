import { useEffect, useRef } from 'react';

/** Mount the unmodified taste-skill layer only after React has committed its markup. */
export const useDiscoveryMotion = () => {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const root = ref.current as (HTMLDivElement & { __moment?: { destroy?: () => void }; __momentP?: unknown }) | null;
    if (!root) return;
    let cancelled = false;
    let unmount: (() => void) | undefined;
    const motionPath = new URL('/assets/motion/motion.js', window.location.origin).href;
    const momentPath = new URL('/assets/moments/moments.js', window.location.origin).href;
    void Promise.all([import(/* @vite-ignore */ motionPath), import(/* @vite-ignore */ momentPath)])
      .then(async ([motion, moments]) => {
        if (cancelled) return;
        motion.init();
        await moments.mount(root);
        const cleanup = () => {
          root.__moment?.destroy?.();
          delete root.__momentP;
          delete root.__moment;
          root.removeAttribute('data-moment-mounted');
        };
        if (cancelled) cleanup();
        else unmount = cleanup;
      }).catch(() => { /* Content and hover CSS remain usable without the optional layer. */ });
    return () => { cancelled = true; unmount?.(); };
  }, []);
  return ref;
};
