import { FC } from 'react';
import { Link } from 'react-router-dom';
import type { GameDlc, GamesInfoPlatform, SameSeriesGame } from '../../@types/types';
import DlcCard from '../DlcCard/DlcCard';
import SameSeriesCard from '../SameSeriesCard/SameSeriesCard';
import './gameContentPlan.scss';

type GameContentPlanProps = {
   dlcItems: GameDlc['results'];
   platforms: GamesInfoPlatform[];
   sameSeriesItems: SameSeriesGame['results'];
   selectedPlatformId: number | null;
};

const REQUIREMENTS_FALLBACK = 'Data not specified';
const RELEASE_FALLBACK = 'Release date not specified';
type PlatformRequirements = NonNullable<GamesInfoPlatform['requirements_en']>;

const getDisplayValue = (value?: string) => {
   if (!value?.trim()) {
      return REQUIREMENTS_FALLBACK;
   }

   return value;
};

const hasRequirementPair = (requirements?: PlatformRequirements) =>
   Boolean(requirements?.minimum?.trim() && requirements.recommended?.trim());

const getPlatformRequirements = (platform: GamesInfoPlatform) => {
   const requirementBlocks = [
      platform.requirements_en,
      platform.requirements_ru,
      platform.requirements,
   ];

   return (
      requirementBlocks.find((requirements) => hasRequirementPair(requirements)) ??
      requirementBlocks.find((requirements) => Boolean(requirements))
   );
};

const hasCompleteRequirements = (platform: GamesInfoPlatform) => {
   const requirements = getPlatformRequirements(platform);

   return hasRequirementPair(requirements);
};

const GameContentPlan: FC<GameContentPlanProps> = ({
   dlcItems,
   platforms,
   sameSeriesItems,
   selectedPlatformId,
}) => {
   const hasSameSeries = sameSeriesItems.length > 0;
   const hasDlc = dlcItems.length > 0;
   const hasRelatedContent = hasSameSeries || hasDlc;
   const relatedGameUrlSuffix = selectedPlatformId ? `?platform=${selectedPlatformId}` : '';
   const filteredPlatforms = platforms.filter(hasCompleteRequirements);
   const sortedPlatforms = [...filteredPlatforms].sort((leftPlatform, rightPlatform) => {
      const leftSelected = leftPlatform.platform.id === selectedPlatformId;
      const rightSelected = rightPlatform.platform.id === selectedPlatformId;

      if (leftSelected === rightSelected) {
         return 0;
      }

      return leftSelected ? -1 : 1;
   });

   return (
      <section className="gameContentPlan mt-8">
         <div className="gameContentPlan__header mb-6">
            <p className="bounty-kicker">Compatibility guide</p>
            <h2 className="arcade-title mt-3 text-3xl text-arcade-ink sm:text-4xl">
               Spec Sheets &amp; Bonus Levels
            </h2>
            <p className="bounty-copy mt-2 text-base">
               Read the platform specs, then jump to DLC or another entry from the same series.
            </p>
         </div>
         <div
            className={`grid gap-6 ${
               hasRelatedContent ? 'xl:grid-cols-[minmax(0,1.2fr)_minmax(320px,0.8fr)]' : ''
            }`}>
            <div className="rounded-arcade border-[3px] border-arcade-ink bg-arcade-panel p-4 shadow-arcade sm:p-6">
               <div className="mb-4 flex items-center justify-between gap-3">
                  <h3 className="arcade-title text-2xl text-arcade-ink sm:text-3xl">Platforms</h3>
                  <p className="text-sm font-black uppercase tracking-[0.12em] text-arcade-muted">Specs and release dates</p>
               </div>
               {sortedPlatforms.length > 0 ? (
                  <div className="grid gap-4">
                     {sortedPlatforms.map((item) => {
                        const isSelected = item.platform.id === selectedPlatformId;
                        const requirements = getPlatformRequirements(item);

                        return (
                           <article
                              key={item.platform.id}
                              className={`gameContentPlan__platform rounded-3xl border p-4 ${
                                 isSelected
                                    ? 'gameContentPlan__platform--selected border-arcade-ink bg-arcade-yellow shadow-arcade'
                                    : 'border-arcade-ink bg-arcade-paper'
                              }`}>
                              <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
                                 <div>
                                    <p className="text-lg font-black text-arcade-ink">
                                       {item.platform.name}
                                    </p>
                                    <p className="text-sm font-semibold text-arcade-muted">
                                       Released:{' '}
                                       {item.released_at?.trim()
                                          ? item.released_at
                                          : RELEASE_FALLBACK}
                                    </p>
                                 </div>
                                 {isSelected ? (
                                    <span className="rounded-full border-2 border-arcade-ink bg-arcade-red px-3 py-1 text-xs font-black uppercase tracking-[0.2em] text-white">
                                       Active lane
                                    </span>
                                 ) : null}
                              </div>
                              <div className="grid gap-3 md:grid-cols-2">
                                 <div className="rounded-arcade border-[3px] border-arcade-ink bg-arcade-panel p-4">
                                    <p className="mb-2 text-sm font-black uppercase tracking-[0.2em] text-red-200">
                                       Minimum
                                    </p>
                                    <p className="whitespace-pre-line text-sm font-semibold text-arcade-muted">
                                       {getDisplayValue(requirements?.minimum)}
                                    </p>
                                 </div>
                                 <div className="rounded-arcade border-[3px] border-arcade-ink bg-arcade-panel p-4">
                                    <p className="mb-2 text-sm font-black uppercase tracking-[0.2em] text-arcade-blue">
                                       Recommended
                                    </p>
                                    <p className="whitespace-pre-line text-sm font-semibold text-arcade-muted">
                                       {getDisplayValue(requirements?.recommended)}
                                    </p>
                                 </div>
                              </div>
                           </article>
                        );
                     })}
                  </div>
               ) : (
                  <p className="rounded-arcade border-[3px] border-arcade-ink bg-arcade-paper px-4 py-5 font-bold text-arcade-muted">
                     No platforms with complete minimum and recommended requirements were
                     specified for this game.
                  </p>
               )}
            </div>

            {hasRelatedContent ? (
               <div className="grid gap-6">
                  {hasSameSeries ? (
                     <section className="rounded-arcade border-[3px] border-arcade-ink bg-arcade-paper p-4 shadow-arcade sm:p-6">
                        <div className="mb-4">
                           <h3 className="arcade-title text-2xl text-arcade-ink sm:text-3xl">
                              Next In The Series
                           </h3>
                           <p className="mt-2 text-sm font-semibold text-arcade-muted">
                              Jump to another entry without losing your platform context.
                           </p>
                        </div>
                        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-1">
                           {sameSeriesItems.map((item) => (
                              <Link
                                 key={item.id}
                                 className="block h-full"
                                 onClick={() => window.scrollTo(0, 0)}
                                 to={`/game/${item.id}${relatedGameUrlSuffix}`}>
                                 <SameSeriesCard {...item} />
                              </Link>
                           ))}
                        </div>
                     </section>
                  ) : null}

                  {hasDlc ? (
                     <section className="rounded-arcade border-[3px] border-arcade-ink bg-arcade-paper p-4 shadow-arcade sm:p-6">
                        <div className="mb-4">
                           <h3 className="arcade-title text-2xl text-arcade-ink sm:text-3xl">DLC Bonus Cart</h3>
                           <p className="mt-2 text-sm font-semibold text-arcade-muted">
                              Explore related add-ons and expansions from the same release page.
                           </p>
                        </div>
                        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-1">
                           {dlcItems.map((item) => (
                              <DlcCard key={item.id} {...item} />
                           ))}
                        </div>
                     </section>
                  ) : null}
               </div>
            ) : null}
         </div>
      </section>
   );
};

export default GameContentPlan;
