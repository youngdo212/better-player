/** @module utils/time */

const TIME_UNIT = 60;

/**
 * 정수 형태의 초를 반환한다. 반환되는 초는 60 미만이다.
 *
 * @param {number} time
 * @returns {number}
 */
export function getSeconds(time: number): number {
  return Math.floor(time % TIME_UNIT);
}

/**
 * 정수 형태의 분을 반환한다. 반환되는 분은 60 미만이다.
 *
 * @param {number} time
 * @returns {number}
 */
export function getMinutes(time: number): number {
  return Math.floor((time / TIME_UNIT) % TIME_UNIT);
}

/**
 * 정수 형태의 시간을 반환한다.
 *
 * @param {number} time
 * @returns {number}
 */
export function getHours(time: number): number {
  return Math.floor(time / TIME_UNIT / TIME_UNIT);
}

/**
 * 최소 두 자리의 문자열이 되도록 0을 붙인다
 *
 * @example
 * padZero(1)
 * // '01'
 *
 * padZero(12)
 * // '12'
 *
 * padZero(123)
 * // '123'
 *
 * @param {number} number
 * @returns {string}
 */
function padZero(number: number): string {
  return number.toString().padStart(2, '0');
}

/**
 * 시간을 포맷팅하여 문자열로 반환한다.
 *
 * @example
 * formatTime(59)
 * // 00:59
 *
 * formatTime(3599)
 * // 59:59
 *
 * formatTime(3600)
 * // 01:00:00
 *
 * formatTime(360000)
 * // 100:00:00
 *
 * @param {number} time
 * @returns {string}
 */
export default function formatTime(time: number): string {
  const hours = getHours(time);
  const minutes = getMinutes(time);
  const seconds = getSeconds(time);
  const hourString = hours ? `${padZero(hours)}:` : '';

  return `${hourString}${padZero(minutes)}:${padZero(seconds)}`;
}
