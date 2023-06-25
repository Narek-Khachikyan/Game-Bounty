type Platforms = {
   platform: {
      id: number;
      slug: string;
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
