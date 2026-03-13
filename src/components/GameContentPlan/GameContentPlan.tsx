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
            <p className="text-2xl text-violet-950 sm:text-3xl">
               Platform Compatibility &amp; Content Plan
            </p>
            <p className="mt-2 text-base text-violet-900">
               Review system requirements by platform, then jump into DLC or continue the series.
            </p>
         </div>
         <div
            className={`grid gap-6 ${
               hasRelatedContent ? 'xl:grid-cols-[minmax(0,1.2fr)_minmax(320px,0.8fr)]' : ''
            }`}>
            <div className="rounded-3xl border border-violet-200 bg-violet-50/70 p-4 sm:p-6">
               <div className="mb-4 flex items-center justify-between gap-3">
                  <p className="text-xl text-violet-950 sm:text-2xl">Platforms</p>
                  <p className="text-sm text-violet-700">Release and system requirements</p>
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
                                    ? 'gameContentPlan__platform--selected border-violet-900 bg-white shadow-lg'
                                    : 'border-violet-200 bg-white/80'
                              }`}>
                              <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
                                 <div>
                                    <p className="text-lg font-semibold text-violet-950">
                                       {item.platform.name}
                                    </p>
                                    <p className="text-sm text-violet-700">
                                       Released:{' '}
                                       {item.released_at?.trim()
                                          ? item.released_at
                                          : RELEASE_FALLBACK}
                                    </p>
                                 </div>
                                 {isSelected ? (
                                    <span className="rounded-full bg-violet-900 px-3 py-1 text-xs uppercase tracking-[0.2em] text-white">
                                       Catalog focus
                                    </span>
                                 ) : null}
                              </div>
                              <div className="grid gap-3 md:grid-cols-2">
                                 <div className="rounded-2xl bg-violet-100/70 p-4">
                                    <p className="mb-2 text-sm uppercase tracking-[0.2em] text-violet-700">
                                       Minimum
                                    </p>
                                    <p className="whitespace-pre-line text-sm text-violet-950">
                                       {getDisplayValue(requirements?.minimum)}
                                    </p>
                                 </div>
                                 <div className="rounded-2xl bg-violet-100/70 p-4">
                                    <p className="mb-2 text-sm uppercase tracking-[0.2em] text-violet-700">
                                       Recommended
                                    </p>
                                    <p className="whitespace-pre-line text-sm text-violet-950">
                                       {getDisplayValue(requirements?.recommended)}
                                    </p>
                                 </div>
                              </div>
                           </article>
                        );
                     })}
                  </div>
               ) : (
                  <p className="rounded-2xl bg-white px-4 py-5 text-violet-950">
                     No platforms with complete minimum and recommended requirements were
                     specified for this game.
                  </p>
               )}
            </div>

            {hasRelatedContent ? (
               <div className="grid gap-6">
                  {hasSameSeries ? (
                     <section className="rounded-3xl border border-violet-200 bg-white p-4 sm:p-6">
                        <div className="mb-4">
                           <p className="text-xl text-violet-950 sm:text-2xl">
                              What to play next in this series
                           </p>
                           <p className="mt-2 text-sm text-violet-700">
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
                     <section className="rounded-3xl border border-violet-200 bg-white p-4 sm:p-6">
                        <div className="mb-4">
                           <p className="text-xl text-violet-950 sm:text-2xl">DLC for this game</p>
                           <p className="mt-2 text-sm text-violet-700">
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
