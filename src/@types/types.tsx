type Platforms = {
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
   metacritic: number;
   platforms: Platforms[];

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
   results: [
      {
         id: number;
         name: string;
         slug: string;
      },
   ];
};
export type GamesInfo = {
   id: number;
   name: string;
   description: string;
   metacritic: number;
   released: string;
   background_image: string;
   achievements_count: number;
   platforms: [
      {
         platform: {
            id: number;
            slug: string;
            name: string;
         };
         released_at: 'string';
         requirements: {
            minimum: string;
            recommended: string;
         };
      },
   ];
};
