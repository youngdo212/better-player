import { isObject, isString } from './type';

describe('isObject', () => {
  it('객체 타입인지 확인한다', () => {
    expect(isObject({})).toBe(true);
    expect(isObject({ name: 'hello' })).toBe(true);
    expect(isObject([])).toBe(false);
    expect(isObject(() => {})).toBe(false);
    expect(isObject(1)).toBe(false);
    expect(isObject('')).toBe(false);
    expect(isObject(null)).toBe(false);
    expect(isObject(undefined)).toBe(false);
    expect(isObject(false)).toBe(false);
    expect(isObject(Symbol('object'))).toBe(false);
  });
});

describe('isString', () => {
  it('String 타입인지 확인한다', () => {
    expect(isString('')).toBe(true);
    expect(isString(new String(''))).toBe(true);
    expect(isString({})).toBe(false);
    expect(isString([])).toBe(false);
    expect(isString(() => {})).toBe(false);
    expect(isString(1)).toBe(false);
    expect(isString(null)).toBe(false);
    expect(isString(undefined)).toBe(false);
    expect(isString(false)).toBe(false);
    expect(isString(Symbol('string'))).toBe(false);
  });
});
