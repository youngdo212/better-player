import cloneDeep from 'lodash/cloneDeep';

const defaults = {
  source: { src: '' },
  i18n: {
    notSupportVideoFormat:
      '현재 브라우저에서 지원하지 않는 비디오 형식입니다. 다른 브라우저에서 시도하세요.',
  },
  iconUrl:
    process.env.NODE_ENV === 'production'
      ? 'https://unpkg.com/@mando212/better-player/dist/better-player.svg'
      : 'better-player.svg',
};

export default cloneDeep(defaults);
