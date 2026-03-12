import { Route, Routes } from 'react-router-dom';
import MainLayout from './layouts/MainLayout';
import Games from './page/Games';
import GameCardInfo from './components/GameCardInfo/GameCardInfo';
import Favorites from './page/Favorites';
import NotFound from './page/NotFound';
import Auth from './page/Auth';

function App() {
   return (
      <>
         <Routes>
            <Route path="/" element={<MainLayout />}>
            <Route index element={<Games />} />
            <Route path="/game/:id" element={<GameCardInfo />} />
            <Route path="/favorites" element={<Favorites />} />
            <Route path="/auth" element={<Auth />} />
            <Route path="*" element={<NotFound />} />
         </Route>
      </Routes>
      </>
   );
}

export default App;
