/**
 * enum의 value 여부를 확인한다.
 */
export function isValidEnumValue(
  enumObject: Record<string | number, number | string>,
  value: number | string,
): boolean {
  return Object.keys(enumObject)
    .filter(key => isNaN(Number(key)))
    .some(key => enumObject[key] === value);
}
