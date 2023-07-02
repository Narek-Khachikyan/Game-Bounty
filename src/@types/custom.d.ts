declare module '*.scss' {
  const content: Record<string, string>;
  export default content;
}
declare module '*.css' {
  const content: Record<string, string>;
  export default content;
}
declare module "*.svg"{
  const content:any;
  export default content;
}
declare module "*.png"{
  const content:any;
  export default content;
}



declare module 'swiper' {
  import { SwiperOptions } from 'swiper/types';
  import { SwiperModule } from 'swiper/types';

  export class Scrollbar {
    constructor(swiper: Swiper);
    updateSize(): void;
  }

  export default class Swiper {
    constructor(container: string | HTMLElement, options?: SwiperOptions);
    static use(modules: SwiperModule[]): void;
  }
}




