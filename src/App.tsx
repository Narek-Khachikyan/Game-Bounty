import axios from 'axios';
import { useEffect, useState } from 'react';
import { Route, Routes } from 'react-router-dom';
import MainLayout from './layouts/MainLayout';
import Games from './page/Games';

function App() {
   const api = '1bc8a2cdaf9b4ba49e0e798f5113a1dc';
   const [data, setData] = useState();
   useEffect(() => {
      axios.get(`https://api.rawg.io/api/games?key=${api}`).then((response) => {
         setData(response.data);
      });
   }, []);

   console.log(data);

   return (
      <>
         <Routes>
            <Route path="/" element={<MainLayout />}>
               <Route path="/" element={<Games />} />
            </Route>
         </Routes>
      </>
   );
}

export default App;
