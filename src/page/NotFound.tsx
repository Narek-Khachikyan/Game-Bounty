import { Link } from 'react-router-dom';

const NotFound = () => {
   return (
      <div className="notFound py-16 text-center">
         <p className="text-white text-3xl sm:text-4xl mb-4">Page not found</p>
         <p className="text-white text-base sm:text-lg mb-6">
            The page you are looking for does not exist.
         </p>
         <Link
            to="/"
            className="inline-block bg-white text-violet-950 px-4 py-2 rounded-2xl">
            Back to home
         </Link>
      </div>
   );
};

export default NotFound;
