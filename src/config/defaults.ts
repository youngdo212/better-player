import type { Config } from '../types';
import cloneDeep from 'lodash/cloneDeep';

const defaults: Config = {
  parentElement: null,
  source: '',
  clickToPlay: true, // 비디오를 클릭해서 재생 가능하게 하는 기능
  keyboard: true,
  seekTime: 5, // 앞으로 가기나 뒤로 가기 시 이동할 초 단위
  volumeStep: 0.1, // 키보드 단축키로 이동할 볼륨 단계
  i18n: {
    notSupportVideoFormat:
      '현재 브라우저에서 지원하지 않는 비디오 형식입니다. 다른 브라우저에서 시도하세요.',
    notFoundVideo:
      '비디오를 찾을 수 없습니다. 아래 버튼을 눌러 비디오를 다시 로드하세요.',
  },
  iconUrl:
    process.env.NODE_ENV === 'production'
      ? 'https://unpkg.com/@mando212/better-player/dist/better-player.svg'
      : 'better-player.svg',
};

export default cloneDeep(defaults);
