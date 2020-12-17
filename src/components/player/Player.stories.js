import Player from './Player';

export default {
  title: 'Player',
};

const Template = ({ source, width, height, clickToPlay = true }) => {
  const parent = document.createElement('div');

  new Player({
    source,
    parent,
    width,
    height,
    clickToPlay,
  });

  return parent;
};

export const WithSource = Template.bind({});
WithSource.args = {
  source:
    'http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
};

export const WithoutSource = Template.bind({});
WithoutSource.args = {};

export const NotSupportVideoFormat = Template.bind({});
NotSupportVideoFormat.args = {
  source: 'http:/not-support.video/format.jpg',
};

export const WithSize = Template.bind({});
WithSize.args = {
  source:
    'http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
  width: 640,
  height: 360,
};

export const MutiplePlayer = ({ sourceA, sourceB, width, height }) => {
  const wrapper = document.createElement('div');
  const parentA = document.createElement('div');
  const parentB = document.createElement('div');
  wrapper.appendChild(parentA);
  wrapper.appendChild(parentB);

  // eslint-disable-next-line no-unused-vars
  const playerA = new Player({
    source: sourceA,
    parent: parentA,
    width,
    height,
  });

  // eslint-disable-next-line no-unused-vars
  const playerB = new Player({
    source: sourceB,
    parent: parentB,
    width,
    height,
  });

  return wrapper;
};
MutiplePlayer.args = {
  sourceA:
    'http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/Sintel.mp4',
  sourceB:
    'http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/TearsOfSteel.mp4',
  width: 830,
  height: 360,
};

/**
 * 서버로 부터 비디오를 찾을 수 없는 경우 비디오 플레이어는 Error Screen을 띄운다
 */
export const NotFoundVideo = Template.bind({});
NotFoundVideo.args = {
  source: 'http://localhost/not-found/video.mp4',
  width: 640,
  height: 360,
  clickToPlay: true,
};

/**
 * i18의 일부 속성만 제공했을 경우
 */
export const InternationalizationException = ({
  source,
  width,
  height,
  notFoundVideo,
}) => {
  const parent = document.createElement('div');

  new Player({
    source,
    parent,
    width,
    height,
    i18n: {
      notFoundVideo,
    },
  });

  return parent;
};
InternationalizationException.args = {
  source: 'http://localhost/not-found/video.mp4',
  width: 640,
  height: 360,
  notFoundVideo: 'video is not found',
};

/**
 * 비디오 클릭으로 재생하는 기능을 끈다.
 *
 * @param {object} args
 * @param {boolean} args.clickToPlay
 */
export const DisableClickToPlay = ({ clickToPlay }) => {
  const parent = document.createElement('div');

  new Player({
    source:
      'http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
    width: 640,
    height: 360,
    parent,
    clickToPlay,
  });

  return parent;
};
DisableClickToPlay.args = {
  clickToPlay: false,
};

/**
 * 키보드와 관련된 옵션 변경을 위한 스토리
 */
export const KeyboardShortcut = ({ seekTime, volumeStep }) => {
  const parent = document.createElement('div');

  new Player({
    source:
      'https://cdn.plyr.io/static/demo/View_From_A_Blue_Moon_Trailer-576p.mp4',
    width: 640,
    height: 360,
    parent,
    seekTime,
    volumeStep,
  });

  return parent;
};
KeyboardShortcut.args = {
  seekTime: 5,
  volumeStep: 0.1,
};
