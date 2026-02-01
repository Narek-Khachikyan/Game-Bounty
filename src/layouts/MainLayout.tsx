import Header from '../components/Header/Header';
import '../App.css';
import { Outlet } from 'react-router-dom';
import bgVideo from '../assets/bgVideo.mp4';
import { useEffect } from 'react';
import AOS from 'aos';
import 'aos/dist/aos.css';

const MainLayout = () => {
   useEffect(() => {
      AOS.init({ once: true });
   }, []);

   return (
      <div className="mainWrapper bg-blue-950">
         <video className="bgVideo" autoPlay muted loop>
            <source src={bgVideo} type="video/mp4" />
         </video>
         <Header />
         <div className="container">
            <Outlet />
         </div>
      </div>
   );
};

export default MainLayout;
