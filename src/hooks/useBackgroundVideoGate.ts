import { useCallback, useState } from 'react';

export const BG_VIDEO_TOGGLE_STORAGE_KEY = 'game-bounty:bg-video:enabled:v1';

const LEGACY_FORCE_ENABLE_VALUE = 'enabled';
const FORCE_DISABLE_VALUE = 'disabled';

export type BackgroundVideoToggleState = 'auto' | 'force-disabled';

type NetworkConnectionLike = {
   saveData?: boolean;
   effectiveType?: string;
};

type NavigatorWithConnection = Navigator & {
   connection?: NetworkConnectionLike;
};

const getNavigatorConnection = (): NetworkConnectionLike | undefined => {
   if (typeof navigator === 'undefined') {
      return undefined;
   }

   return (navigator as NavigatorWithConnection).connection;
};

export const getBackgroundVideoToggleState = (): BackgroundVideoToggleState => {
   if (typeof window === 'undefined') {
      return 'auto';
   }

   try {
      const storedValue = window.localStorage.getItem(BG_VIDEO_TOGGLE_STORAGE_KEY);

      if (storedValue === LEGACY_FORCE_ENABLE_VALUE) {
         return 'auto';
      }

      if (storedValue === FORCE_DISABLE_VALUE) {
         return 'force-disabled';
      }
   } catch {
      return 'auto';
   }

   return 'auto';
};

export const setBackgroundVideoToggleState = (value: BackgroundVideoToggleState) => {
   if (typeof window === 'undefined') {
      return;
   }

   try {
      if (value === 'auto') {
         window.localStorage.removeItem(BG_VIDEO_TOGGLE_STORAGE_KEY);
         return;
      }

      window.localStorage.setItem(BG_VIDEO_TOGGLE_STORAGE_KEY, FORCE_DISABLE_VALUE);
   } catch {
      // Ignore storage errors to avoid breaking app behavior.
   }
};

export const isBackgroundVideoBlockedByReducedMotion = (): boolean => {
   if (typeof window === 'undefined') {
      return false;
   }

   if (
      typeof window.matchMedia === 'function' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches
   ) {
      return true;
   }

   return false;
};

export const isBackgroundVideoBlockedByNetworkHeuristics = (): boolean => {
   if (typeof window === 'undefined') {
      return false;
   }

   const connection = getNavigatorConnection();

   if (connection?.saveData === true) {
      return true;
   }

   if (connection?.effectiveType === '2g' || connection?.effectiveType === 'slow-2g') {
      return true;
   }

   return false;
};

export const isBackgroundVideoBlockedByHeuristics = (): boolean =>
   isBackgroundVideoBlockedByReducedMotion() || isBackgroundVideoBlockedByNetworkHeuristics();

export const isBackgroundVideoAllowed = (toggleState = getBackgroundVideoToggleState()): boolean => {
   // Accessibility signal has highest priority.
   if (isBackgroundVideoBlockedByReducedMotion()) {
      return false;
   }

   // User force-disable always blocks video.
   if (toggleState === 'force-disabled') {
      return false;
   }

   // Network heuristics are always respected (cannot be overridden by toggle).
   return !isBackgroundVideoBlockedByNetworkHeuristics();
};

const useBackgroundVideoGate = () => {
   const [toggleState, setToggleState] = useState<BackgroundVideoToggleState>(() =>
      getBackgroundVideoToggleState(),
   );

   const updateToggleState = useCallback((nextState: BackgroundVideoToggleState) => {
      setToggleState(nextState);
      setBackgroundVideoToggleState(nextState);
   }, []);

   const isBlockedByReducedMotion = isBackgroundVideoBlockedByReducedMotion();
   const isBlockedByNetworkHeuristics = isBackgroundVideoBlockedByNetworkHeuristics();
   const isVideoAllowed = !isBlockedByReducedMotion && !isBlockedByNetworkHeuristics && toggleState !== 'force-disabled';

   return {
      isVideoAllowed,
      isBlockedByReducedMotion,
      isBlockedByNetworkHeuristics,
      toggleState,
      updateToggleState,
   };
};

export default useBackgroundVideoGate;
