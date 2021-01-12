/**
 * 엘리먼트의 attribute을 나타내는 딕셔너리 구조의 객체
 */
export interface Attributes {
  [key: string]: string;
}

export interface Config {
  parentElement: HTMLElement | null;
  source: string;
  clickToPlay: boolean;
  keyboard: boolean;
  seekTime: number;
  volumeStep: number;
  i18n: I18N;
  iconUrl: string;
  width?: number;
  height?: number;
  parentId?: string;
  parent?: HTMLElement;
}

export interface I18N {
  notSupportVideoFormat: string;
  notFoundVideo: string;
}

// TODO: value에 해당되는 메소드의 이름의 타입을 string보다 더 strict하게 만들기
/**
 * key(이벤트 이름과 셀렉터의 조합): value(메소드의 이름) 형태의 객체
 *
 * @example
 * {'click': 'onClick'}
 * {'click .some-class': 'someMethodName'}
 */
export interface EventHandlerNameMap {
  [eventNameWithSelector: string]: string;
}

/**
 * key(이벤트 이름과 셀렉터의 조합): value(함수) 형태의 객체
 */
export interface EventHandlerMap {
  [eventNameWithSelector: string]: (e: Event) => void;
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
