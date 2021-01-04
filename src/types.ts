export interface Config {
  source: string;
  clickToPlay: boolean;
  keyboard: boolean;
  seekTime: number;
  volumeStep: number;
  i18n: I18N;
  iconUrl: string;
}

export interface I18N {
  notSupportVideoFormat: string;
  notFoundVideo: string;
}

/**
 * 타입 T의 K 속성의 타입을 Partial 타입으로 변경한다.
 */
export type PartialProperty<T, K extends keyof T> = {
  [P in keyof T]: P extends K ? Partial<T[P]> : T[P];
};
