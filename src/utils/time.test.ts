import formatTime, { getHours, getMinutes, getSeconds } from './time';

describe('getSeconds', () => {
  it('초를 반환한다', () => {
    expect(getSeconds(0)).toBe(0);
    expect(getSeconds(0.123)).toBe(0);
    expect(getSeconds(1)).toBe(1);
    expect(getSeconds(3.141592)).toBe(3);
    expect(getSeconds(59)).toBe(59);
    expect(getSeconds(60)).toBe(0);
    expect(getSeconds(77.29912)).toBe(17);
    expect(getSeconds(360)).toBe(0);
    expect(getSeconds(3600)).toBe(0);
  });
});

describe('getMinutes', () => {
  it('분을 반환한다', () => {
    expect(getMinutes(0)).toBe(0);
    expect(getMinutes(1)).toBe(0);
    expect(getMinutes(3.141592)).toBe(0);
    expect(getMinutes(59)).toBe(0);
    expect(getMinutes(60)).toBe(1);
    expect(getMinutes(128)).toBe(2);
    expect(getMinutes(360)).toBe(6);
    expect(getMinutes(400.93991)).toBe(6);
    expect(getMinutes(3600)).toBe(0);
    expect(getMinutes(3660)).toBe(1);
  });
});

describe('getHours', () => {
  it('분을 반환한다', () => {
    expect(getHours(0)).toBe(0);
    expect(getHours(1)).toBe(0);
    expect(getHours(60.2393)).toBe(0);
    expect(getHours(360)).toBe(0);
    expect(getHours(3599.9999)).toBe(0);
    expect(getHours(3600)).toBe(1);
    expect(getHours(3660)).toBe(1);
    expect(getHours(362944)).toBe(100);
  });
});

describe('formatTime', () => {
  it('시간을 포매팅한다', () => {
    expect(formatTime(0)).toBe('00:00');
    expect(formatTime(59)).toBe('00:59');
    expect(formatTime(60)).toBe('01:00');
    expect(formatTime(3599)).toBe('59:59');
    expect(formatTime(3600)).toBe('01:00:00');
    expect(formatTime(360000)).toBe('100:00:00');
  });
});
