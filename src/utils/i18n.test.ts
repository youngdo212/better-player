import i18n from './i18n';
import defaultConfig from '../config/defaults';

it('key값에 대응되는 값이 있을 경우 그 값을 반환한다', () => {
  const config = {
    ...defaultConfig,
    i18n: { notSupportVideoFormat: 'hello' },
  };
  expect(i18n.get('notSupportVideoFormat', config)).toBe('hello');
});

it('key값에 대응되는 값이 없을 경우 기본 값을 반환한다', () => {
  const config = {
    ...defaultConfig,
    i18n: { notSupportVideoFormat: 'hello' },
  };
  expect(i18n.get('notFoundVideo', config)).toBe(
    defaultConfig.i18n.notFoundVideo,
  );
});
