import Core from './Core';
import config from '../../config/defaults';
import Events from '../../base/events';

beforeEach(() => {
  document.body.innerHTML = '';
});

it('부모 엘리먼트가 주어지지 않을 경우 DOM에 추가되지 않는다', () => {
  const body = document.body;
  const core = new Core(config);

  core.render();

  expect(body.querySelector('.better-player')).toBe(null);
});

it('엘리먼트를 DOM에 추가한다', () => {
  const body = document.body;
  const core = new Core({
    ...config,
    parentElement: body,
  });

  core.render();

  expect(body.querySelector('.better-player')).toBe(core.el);
});

it('하위 엘리먼트를 렌더링한다', () => {
  const core = new Core(config);

  core.render();

  expect(core.el.children.length).not.toBe(0);
});

it('자신 및 하위 엘리먼트를 DOM에서 제거한다', () => {
  const body = document.body;
  const core = new Core({
    ...config,
    parentElement: body,
  });

  core.render();
  expect(body.querySelector('.better-player')).toBeTruthy();
  expect(core.el.children.length).not.toBe(0);

  core.destroy();
  expect(body.querySelector('.better-player')).toBeFalsy();
  expect(core.el.children.length).toBe(0);
});

it('자신 및 하위 엘리먼트의 이벤트 리스너를 전부 제거한다', () => {
  HTMLMediaElement.prototype.canPlayType = () => 'maybe';
  HTMLMediaElement.prototype.load = () => {};

  const core = new Core(config);
  const coreListener = jest.fn();
  const videoListener = jest.fn();
  const videoElListener = jest.fn();

  // setup
  core.render();
  core.on('some-core-event', coreListener);
  core.video.on('some-video-event', videoListener);
  core.video.on(Events.VIDEO_PLAY, videoElListener);
  core.emit('some-core-event');
  core.video.emit('some-video-event');
  core.video.el.dispatchEvent(new Event('play'));

  // 이벤트 리스너가 등록 됐는 지 테스트
  expect(coreListener).toHaveBeenCalledTimes(1);
  expect(videoListener).toHaveBeenCalledTimes(1);
  expect(videoElListener).toHaveBeenCalledTimes(1);

  // 이벤트 리스너 제거 및 이벤트 다시 발생
  core.destroy();
  core.emit('some-core-event');
  core.video.emit('some-video-event');
  core.video.el.dispatchEvent(new Event('play'));

  // 이벤트 리스너 제거 테스트
  expect(coreListener).toHaveBeenCalledTimes(1);
  expect(videoListener).toHaveBeenCalledTimes(1);
  expect(videoElListener).toHaveBeenCalledTimes(1);
});

it('width와 height가 주어지는 경우 엘리먼트에 적용한다', () => {
  const core = new Core({
    ...config,
    width: 200,
    height: 100,
  });

  core.render();

  expect(core.el.style.width).toBe('200px');
  expect(core.el.style.height).toBe('100px');
});

it('width 또는 height가 주어지지 않는 경우 엘리먼트에 기본 크기를 적용한다', () => {
  const core = new Core({
    ...config,
    width: 200, // width만 설정
  });

  core.render();

  expect(core.el.style.width).toBe('200px');
  expect(core.el.style.height).toBe('');
});

it('svg sprite가 추가된다', () => {
  const core = new Core(config);

  core.render();

  expect(document.body.firstElementChild.firstElementChild.tagName).toBe('svg');
});
