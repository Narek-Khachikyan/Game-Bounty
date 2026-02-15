import Header from '../components/Header/Header';
import '../App.css';
import { Outlet } from 'react-router-dom';
import bgVideo from '../assets/bgVideo.mp4';
import { useEffect } from 'react';
import AOS from 'aos';
import 'aos/dist/aos.css';
import useBackgroundVideoGate from '../hooks/useBackgroundVideoGate';

const MainLayout = () => {
   const {
      isVideoAllowed,
      isBlockedByReducedMotion,
      isBlockedByNetworkHeuristics,
      toggleState,
      updateToggleState,
   } = useBackgroundVideoGate();
   const isAnimatedBackgroundEnabled = toggleState === 'auto';
   const animatedBackgroundBlockedReason =
      isAnimatedBackgroundEnabled && !isVideoAllowed
         ? isBlockedByReducedMotion
            ? 'Blocked by reduced motion'
            : isBlockedByNetworkHeuristics
               ? 'Blocked by network settings'
               : null
         : null;

   useEffect(() => {
      AOS.init({ once: true });
   }, []);

   return (
      <div className="mainWrapper bg-blue-950">
         {isVideoAllowed ? (
            <video className="bgVideo" autoPlay muted loop playsInline aria-hidden="true">
               <source src={bgVideo} type="video/mp4" />
            </video>
         ) : null}
         <Header
            isAnimatedBackgroundEnabled={isAnimatedBackgroundEnabled}
            animatedBackgroundBlockedReason={animatedBackgroundBlockedReason}
            onAnimatedBackgroundToggle={(enabled) =>
               updateToggleState(enabled ? 'auto' : 'force-disabled')
            }
         />
         <div className="container">
            <Outlet />
         </div>
      </div>
   );
};

export default MainLayout;
