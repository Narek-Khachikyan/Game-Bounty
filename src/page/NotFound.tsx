import { Link } from 'react-router-dom';

const NotFound = () => {
   return (
      <main className="notFound flex min-h-[70vh] items-center justify-center py-16 text-center">
         <section className="bounty-panel max-w-2xl rounded-dossier px-6 py-10 sm:px-10">
         <p className="bounty-kicker">Missing contract</p>
         <h1 className="mt-3 text-3xl font-black tracking-[-0.05em] text-bounty-ink sm:text-5xl">
            Page not found
         </h1>
         <p className="bounty-copy mx-auto mb-8 mt-4 max-w-xl text-base sm:text-lg">
            This bounty does not exist or has moved out of range.
         </p>
         <Link
            to="/"
            className="bounty-button px-5 py-3 text-sm">
            Back to catalog
         </Link>
         </section>
      </main>
   );
};

export default NotFound;
