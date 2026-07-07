import { Link } from 'react-router-dom';

const NotFound = () => {
   return (
      <main className="notFound flex min-h-[70vh] items-center justify-center py-16 text-center">
         <section className="bounty-panel max-w-2xl rounded-arcade px-6 py-10 sm:px-10">
         <p className="bounty-kicker">Missing issue</p>
         <h1 className="arcade-title mt-4 text-5xl leading-[0.88] text-arcade-ink sm:text-7xl">
            Lost Cartridge
         </h1>
         <p className="bounty-copy mx-auto mb-8 mt-4 max-w-xl text-base sm:text-lg">
            This page slipped behind the arcade cabinet or moved to another shelf.
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
