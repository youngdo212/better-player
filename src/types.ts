/**
 * 엘리먼트의 attribute을 나타내는 딕셔너리 구조의 객체
 */
export interface Attributes {
  [key: string]: string;
}

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

/*****************
 * Utitliy Types
 *****************/

/**
 * 타입 T의 K 속성의 타입을 Partial 타입으로 변경한다.
 */
export type PartialProperty<T, K extends keyof T> = {
  [P in keyof T]: P extends K ? Partial<T[P]> : T[P];
};

/**
 * 타입 T에서 메소드의 이름 집합을 추출한다.
 * 추출되는 메소드의 이름은 string 타입으로 한정한다.
 */
export type MethodNames<T> = {
  [K in keyof T]: K extends number | symbol
    ? never
    : T[K] extends (...args: any[]) => any
    ? K
    : never;
}[keyof T];
