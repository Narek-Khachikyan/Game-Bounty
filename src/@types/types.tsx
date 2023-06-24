type Platform = {
   id: 0;
   slug: string;
   name: string;
};

export type GameData = {
   id: number;
   name: string;
   released: string;
   background_image: string;
   rating: number;
   rating_top: number;
   metacritic: number;
   platforms: Platform[];
};

export type Games = {
   results: GameData[];
};
