/** @module utils/type */

/**
 * 생성자함수를 반환한다. null 또는 undefined의 경우 null을 반환한다.
 *
 * @param {any} value
 * @returns {any}
 */
function getConstructor(value) {
  if (value === undefined) return null;
  if (value === null) return null;
  return value.constructor;
}

/**
 * 객체 타입인지 확인한다.
 *
 * @param {any} value
 * @returns {boolean}
 */
export function isObject(value) {
  return getConstructor(value) === Object;
}

/**
 * String 타입인지 확인한다.
 *
 * @param {any} value
 * @returns {boolean}
 */
export function isString(value) {
  return getConstructor(value) === String;
}

/**
 * Number 타입인지 확인한다.
 * NaN의 경우 false를 반환한다.
 *
 * @param {any} value
 * @returns {boolean}
 */
export function isNumber(value) {
  return getConstructor(value) === Number && !Number.isNaN(value);
}
