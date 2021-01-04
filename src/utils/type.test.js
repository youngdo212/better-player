import { isObject } from './type';

describe('isObject', () => {
  it('객체 타입인지 확인한다', () => {
    expect(isObject({})).toBe(true);
    expect(isObject({ name: 'hello' })).toBe(true);
    expect(isObject([])).toBe(false);
    expect(isObject(1)).toBe(false);
    expect(isObject('')).toBe(false);
    expect(isObject(null)).toBe(false);
    expect(isObject(undefined)).toBe(false);
    expect(isObject(false)).toBe(false);
    expect(isObject(Symbol('object'))).toBe(false);
  });
});
