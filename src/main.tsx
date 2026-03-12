import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';
import { BrowserRouter } from 'react-router-dom';
import { Provider } from 'react-redux';
import store from './app/store';
import FavoritesSync from './components/FavoritesSync/FavoritesSync';
import { AuthProvider } from './context/AuthProvider';

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
   <React.StrictMode>
      <BrowserRouter>
         <AuthProvider>
            <Provider store={store}>
               <FavoritesSync />
               <App />
            </Provider>
         </AuthProvider>
      </BrowserRouter>
   </React.StrictMode>,
);
