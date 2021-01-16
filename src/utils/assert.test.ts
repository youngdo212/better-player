import { assertIsDefined } from './assert';

describe('assertIsDefined', () => {
  it('값이 undefined일 경우 에러를 발생한다', () => {
    expect(() => {
      assertIsDefined(undefined, 'undefined');
    }).toThrow();
  });

  it('값이 null일 경우 에러를 발생한다', () => {
    expect(() => {
      assertIsDefined(null, 'null');
    }).toThrow();
  });

  it('값이 undefined나 null이 아닐 일 경우 에러를 발생하지 않는다', () => {
    expect(() => {
      assertIsDefined(false, 'undefined');
    }).not.toThrow();
  });
});
