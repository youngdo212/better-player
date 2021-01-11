/**
 * 콜 스택이 전부 비워진 후 함수가 호출되도록 만든다
 * @param callback
 */
export function defer(callback: (...args: any[]) => any): void {
  setTimeout(callback, 1);
}
