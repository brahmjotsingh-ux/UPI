export enum AppStage {
  CARD = 'CARD',
  TIMER = 'TIMER',
  DECORATE = 'DECORATE',
  BIG_COUNTDOWN = 'BIG_COUNTDOWN',
  CAKE_SELECTION = 'CAKE_SELECTION',
  CAKE_STAGE = 'CAKE_STAGE',
  FINAL_MESSAGE = 'FINAL_MESSAGE',
}

export interface CakeFlavor {
  id: string;
  name: string;
  image: string;
}

export type DecorType = 'balloons' | 'lights' | 'confetti' | 'bubbles' | 'flowers';
