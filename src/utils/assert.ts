/**
 * 값이 null이나 undefined가 아님을 단언한다
 *
 * @param value 확인할 값
 * @param name value의 이름
 */
export function assertIsDefined<T>(
  value: T,
  name: string,
): asserts value is NonNullable<T> {
  if (value === null || value === undefined) {
    throw new Error(
      `expected ${name} to be defined, but received null or undefined`,
    );
  }
}
