import Core from './Core';
import config from '../../config/defaults';

beforeEach(() => {
  document.body.innerHTML = '';
});

it('부모 엘리먼트가 주어지지 않을 경우 DOM에 추가되지 않는다', () => {
  const body = document.body;
  const core = new Core({
    ...config,
    source: { src: 'test.mp4' },
  });

  core.render();

  expect(body.children.length).toBe(0);
});

it('엘리먼트를 DOM에 추가한다', () => {
  const body = document.body;
  const core = new Core({
    ...config,
    parentElement: body,
    source: { src: 'test.mp4' },
  });

  core.render();

  expect(body.children.length).toBe(1);
});

it('하위 엘리먼트를 렌더링한다', () => {
  const core = new Core({
    ...config,
    source: { src: 'test.mp4' },
  });

  core.render();

  expect(core.el.children.length).toBe(1);
});

it('자신 및 하위 엘리먼트를 DOM에서 제거한다', () => {
  const body = document.body;
  const core = new Core({
    ...config,
    parentElement: body,
    source: { src: 'test.mp4' },
  });

  core.render();
  expect(body.children.length).toBe(1);
  expect(core.el.children.length).toBe(1);

  core.destroy();
  expect(body.children.length).toBe(0);
  expect(core.el.children.length).toBe(0);
});

it('자신 및 하위 엘리먼트의 이벤트 리스너를 전부 제거한다', () => {
  const core = new Core({
    ...config,
    source: { src: 'test.mp4' },
  });
  const coreListener = jest.fn();
  const videoListener = jest.fn();
  // jest에서 VideoFactory를 통해 Video를 생성하면 항상 NoVideo가 생성되기 때문에
  // HTMLVideo 테스트를 진행할 수 없다.
  // const videoElListener = jest.fn();

  // setup
  core.render();
  core.on('some-core-event', coreListener);
  core.video.on('some-video-event', videoListener);
  // core.video.on(Events.VIDEO_PLAY, videoElListener);
  core.emit('some-core-event');
  core.video.emit('some-video-event');
  core.video.el.dispatchEvent(new Event('play'));

  // 이벤트 리스너가 등록 됐는 지 테스트
  expect(coreListener).toHaveBeenCalledTimes(1);
  expect(videoListener).toHaveBeenCalledTimes(1);
  // expect(videoElListener).toHaveBeenCalledTimes(1);

  // 이벤트 리스너 제거 및 이벤트 다시 발생
  core.destroy();
  core.emit('some-core-event');
  core.video.emit('some-video-event');
  core.video.el.dispatchEvent(new Event('play'));

  // 이벤트 리스너 제거 테스트
  expect(coreListener).toHaveBeenCalledTimes(1);
  expect(videoListener).toHaveBeenCalledTimes(1);
  // expect(videoElListener).toHaveBeenCalledTimes(1);
});
