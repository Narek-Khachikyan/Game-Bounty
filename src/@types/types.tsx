type PlatformEntry = {
   platform: {
      id: number;
      name: string;
   };
};

export type GameData = {
   id: number;
   name: string;
   released: string;
   background_image: string;
   metacritic: number | null;
   platforms: PlatformEntry[];
};

export type Games = {
   results: GameData[];
};

export type GenresData = {
   id: number;
   name: string;
   image_background: string;
};

export type Genres = {
   results: GenresData[];
};

export type PlatformsData = {
   results: Array<{
      id: number;
      name: string;
      slug: string;
   }>;
};

export type GamesInfoPlatform = {
   platform: {
      id: number;
      slug: string;
      name: string;
   };
   released_at: string;
   requirements: {
      minimum?: string;
      recommended?: string;
   };
};

export type GamesInfo = {
   id: number;
   slug: string;
   name: string;
   description: string;
   metacritic: number | null;
   released: string;
   background_image: string;
   achievements_count: number;
   platforms: GamesInfoPlatform[];
};

export type ScreenShots = {
   results: Array<{
      image: string;
   }>;
};

export type GameDlc = {
   results: Array<{
      id: number;
      name: string;
      released: string;
      background_image: string;
      rating: number;
   }>;
};

export type SameSeriesGame = {
   results: Array<{
      id: number;
      name: string;
      released: string;
      background_image: string;
      metacritic: number | null;
   }>;
};
