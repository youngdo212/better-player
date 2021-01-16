import { isValidEnumValue } from './enum';

describe('isValidEnumValue', () => {
  it('value가 숫자 타입인 enum을 올바르게 체크한다', () => {
    enum Fruit {
      Apple,
      Banana,
      Watermelon,
    }

    expect(isValidEnumValue(Fruit, 0)).toBe(true);
    expect(isValidEnumValue(Fruit, 1)).toBe(true);
    expect(isValidEnumValue(Fruit, 2)).toBe(true);
    expect(isValidEnumValue(Fruit, 3)).toBe(false);
    expect(isValidEnumValue(Fruit, 4)).toBe(false);
    expect(isValidEnumValue(Fruit, '0')).toBe(false);
    expect(isValidEnumValue(Fruit, '1')).toBe(false);
    expect(isValidEnumValue(Fruit, '2')).toBe(false);
    expect(isValidEnumValue(Fruit, 'Apple')).toBe(false);
    expect(isValidEnumValue(Fruit, 'Banana')).toBe(false);
    expect(isValidEnumValue(Fruit, 'Watermelon')).toBe(false);
  });

  it('value가 지정된 숫자 타입인 enum을 올바르게 체크한다', () => {
    enum Fruit {
      Apple,
      Banana = 4,
      Watermelon,
    }

    expect(isValidEnumValue(Fruit, 0)).toBe(true);
    expect(isValidEnumValue(Fruit, 1)).toBe(false);
    expect(isValidEnumValue(Fruit, 2)).toBe(false);
    expect(isValidEnumValue(Fruit, 4)).toBe(true);
    expect(isValidEnumValue(Fruit, 5)).toBe(true);
    expect(isValidEnumValue(Fruit, '0')).toBe(false);
    expect(isValidEnumValue(Fruit, '4')).toBe(false);
    expect(isValidEnumValue(Fruit, '5')).toBe(false);
    expect(isValidEnumValue(Fruit, 'Apple')).toBe(false);
    expect(isValidEnumValue(Fruit, 'Banana')).toBe(false);
    expect(isValidEnumValue(Fruit, 'Watermelon')).toBe(false);
  });

  it('value가 문자열인 enum을 올바르게 체크한다', () => {
    enum Language {
      Korean = 'ko',
      Japanese = 'jp',
      Chinese = 'cn',
    }

    expect(isValidEnumValue(Language, 'ko')).toBe(true);
    expect(isValidEnumValue(Language, 'jp')).toBe(true);
    expect(isValidEnumValue(Language, 'cn')).toBe(true);
    expect(isValidEnumValue(Language, 'en')).toBe(false);
    expect(isValidEnumValue(Language, 0)).toBe(false);
    expect(isValidEnumValue(Language, 1)).toBe(false);
    expect(isValidEnumValue(Language, 2)).toBe(false);
    expect(isValidEnumValue(Language, 'Korean')).toBe(false);
    expect(isValidEnumValue(Language, 'Japanese')).toBe(false);
    expect(isValidEnumValue(Language, 'Chinese')).toBe(false);
  });
});
