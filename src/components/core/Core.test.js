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

// jest에서 fullscreen api를 사용하는 것이 매우 제한적이기 때문에 테스트 케이스도 제한된다
describe('fullscreen 관련', () => {
  // TODO: fscreen을 의존하지 않고 fullscreen api를 직접 만들어서 다시 테스트
  // it('엘리먼트에 fullscreenchange 이벤트가 발생하면 CORE_FULLSCREENCHANGE 이벤트를 발생한다', () => {
  //   const core = new Core(config);
  //   const callback = jest.fn();
  //   core.on(Events.CORE_FULLSCREENCHANGE, callback);

  //   core.el.dispatchEvent(new Event('fullscreenchange', { bubbles: true }));

  //   expect(callback).toHaveBeenCalled();
  // });

  // it('전체화면된 엘리먼트가 없을 경우 false를 반환한다', () => {
  //   const core = new Core(config);

  //   expect(core.isFullscreen()).toBe(false);
  // });

  // it('전체화면된 엘리먼트가 core가 아닐 경우 false를 반환한다', () => {
  //   const core = new Core(config);
  //   const another = document.createElement('div');
  //   another.requestFullscreen();

  //   expect(core.isFullscreen()).toBe(false);
  // });

  // it('core가 전체화면일 경우 true를 반환한다', () => {
  //   const core = new Core(config);
  //   core.el.requestFullscreen();

  //   expect(core.isFullscreen()).toBe(true);
  // });

  it('전체화면을 요청할 경우 this.fullscreen.request를 호출한다', () => {
    const core = new Core(config);
    core.fullscreen.request = jest.fn();

    core.requestFullscreen();

    expect(core.fullscreen.request).toHaveBeenCalledWith(core.el);
  });

  it('전체화면을 해제할 경우 this.fullscreen.exit를 호출한다', () => {
    const core = new Core(config);
    core.fullscreen.exit = jest.fn();

    core.exitFullscreen();

    expect(core.fullscreen.exit).toHaveBeenCalled();
  });

  // TODO: fscreen을 의존하지 않고 fullscreen api를 직접 만들어서 다시 테스트
  // it('전체 화면으로 전환한다', () => {
  //   const core = new Core(config);
  //   const callback = jest.fn();
  //   core.on(Events.CORE_FULLSCREENCHANGE, callback);

  //   core.requestFullscreen();

  //   expect(document.fullscreenElement).toBe(core.el);
  //   expect(callback).toHaveBeenCalled();
  // });

  // TODO: fscreen을 의존하지 않고 fullscreen api를 직접 만들어서 다시 테스트
  // it('전체 화면에서 탈출한다', () => {
  //   const core = new Core(config);
  //   const callback = jest.fn();
  //   core.on(Events.CORE_FULLSCREENCHANGE, callback);

  //   core.requestFullscreen();

  //   expect(document.fullscreenElement).toBe(core.el);
  //   expect(callback).toHaveBeenCalledTimes(1);

  //   core.exitFullscreen();

  //   expect(document.fullscreenElement).toBe(null);
  //   expect(callback).toHaveBeenCalledTimes(2);
  // });

  // TODO: fscreen을 의존하지 않고 fullscreen api를 직접 만들어서 다시 테스트
  // it('core가 파괴되면 엘리먼트의 fullscreenchange 이벤트가 발생해도 무시된다', () => {
  //   const core = new Core(config);
  //   const callback = jest.fn();

  //   core.destroy();
  //   core.on(Events.CORE_FULLSCREENCHANGE, callback);
  //   core.el.dispatchEvent(new Event('fullscreenchange', { bubbles: true }));

  //   expect(callback).not.toHaveBeenCalled();
  // });

  // TODO: fscreen을 의존하지 않고 fullscreen api를 직접 만들어서 다시 테스트
  // describe('두 개 이상의 비디오 플레이어가 존재할 경우', () => {
  //   it('비디오 플레이어의 전체 화면 요청 시 해당 비디오 플레이어만 전체화면이 된다', () => {
  //     const core1 = new Core(config);
  //     const core2 = new Core(config);

  //     core1.requestFullscreen();

  //     expect(core1.isFullscreen()).toBe(true);
  //     expect(core2.isFullscreen()).toBe(false);
  //   })

  //   it('비디오 플레이어의 전체 화면 요청 시 다른 비디오 플레이어의 이벤트는 발생하지 않는다', () => {
  //     const core1 = new Core(config);
  //     const callback1 = jest.fn();
  //     core1.on(Events.CORE_FULLSCREENCHANGE, callback1);
  //     const core2 = new Core(config);
  //     const callback2 = jest.fn();
  //     core2.on(Events.CORE_FULLSCREENCHANGE, callback2);

  //     core1.requestFullscreen();

  //     expect(callback1).toHaveBeenCalled();
  //     expect(callback2).not.toHaveBeenCalled();
  //   })

  //   it('비디오 플레이어의 전체 화면 해제 시 두 플레이어 모두 전체화면이 상태가 아니다', () => {
  //     const core1 = new Core(config);
  //     const core2 = new Core(config);

  //     core1.requestFullscreen();
  //     core1.exitFullscreen();

  //     expect(core1.isFullscreen()).toBe(false);
  //     expect(core2.isFullscreen()).toBe(false);
  //   })

  //   it('비디오 플레이어의 전체 화면 해제 시 다른 비디오 플레이어의 이벤트는 발생하지 않는다', () => {
  //     const core1 = new Core(config);
  //     const callback1 = jest.fn();
  //     core1.on(Events.CORE_FULLSCREENCHANGE, callback1);
  //     const core2 = new Core(config);
  //     const callback2 = jest.fn();
  //     core2.on(Events.CORE_FULLSCREENCHANGE, callback2);

  //     core1.requestFullscreen();
  //     core1.exitFullscreen();

  //     expect(callback1).toHaveBeenCalledTimes(2);
  //     expect(callback2).not.toHaveBeenCalled();
  //   })
  // })
});
