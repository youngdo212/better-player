import Controller from './Controller';
import HTMLVideo from '../../components/html-video';
import Core from '../../components/core';
import config from '../../config/defaults';
import Events from '../../base/events';
import { mocked } from 'ts-jest/utils';
import type { Config } from '../../types';
import type Video from '../../base/video';
import UIObject from '../../base/ui-object';
jest.mock('../../components/core');

beforeAll(() => {
  mocked(Core).mockImplementation((config: Config) => {
    class MockCore extends UIObject<'div'> {
      public video: Video = new HTMLVideo(config);
      public config: Config = config;
    }

    return (new MockCore('div') as unknown) as Core;
  });
});

beforeEach(() => {
  mocked(Core).mockClear();
});

it('렌더링을 정상적으로 수행한다', () => {
  const core = new Core(config);
  const controller = new Controller(core);
  controller.render();

  expect(core.el.children).toContain(controller.el);
});

it('하위 엘리먼트를 렌더링한다', () => {
  const core = new Core(config);
  const controller = new Controller(core);
  controller.render();

  expect(controller.el.children.length).not.toBe(0);
});

it('비디오를 재생시킨다', () => {
  const core = new Core(config);
  core.video.play = jest.fn();
  const controller = new Controller(core);
  controller.render();
  const playToggleButtonEl = controller.childElements?.playToggleButton;

  playToggleButtonEl?.dispatchEvent(new Event('click', { bubbles: true }));

  expect(core.video.play).toHaveBeenCalled();
});

it('비디오를 일시 정지시킨다', () => {
  const core = new Core(config);
  core.video.isPaused = () => false;
  core.video.pause = jest.fn();
  const controller = new Controller(core);
  controller.render();
  const playToggleButtonEl = controller.childElements?.playToggleButton;

  playToggleButtonEl?.dispatchEvent(new Event('click', { bubbles: true }));

  expect(core.video.pause).toHaveBeenCalled();
});

it('비디오가 재생되면 playToggleButton의 클래스를 추가한다', () => {
  const core = new Core(config);
  core.video.isPaused = () => false;
  const controller = new Controller(core);
  controller.render();
  const playToggleButtonEl = controller.childElements?.playToggleButton;

  core.video.emit(Events.VIDEO_PLAY);

  expect(
    playToggleButtonEl?.classList.contains(
      'better-player__toggle-button--pressed',
    ),
  ).toBe(true);
});

it('비디오가 일시 정지되면 playToggleButton의 클래스를 삭제한다', () => {
  const core = new Core(config);
  core.video.isPaused = () => false;
  const controller = new Controller(core);
  controller.render();

  // 비디오 플레이어를 재생하여 클래스를 추가
  core.video.emit(Events.VIDEO_PLAY);

  // 비디오 플레이어를 일시 정지하여 테스트
  core.video.isPaused = () => true;
  core.video.emit(Events.VIDEO_PAUSE);

  expect(
    controller.childElements?.playToggleButton.classList.contains(
      'better-player__toggle-button--pressed',
    ),
  ).toBe(false);
});

it('비디오의 시간이 변경되면 seek bar의 value가 변경된다', () => {
  const core = new Core(config);
  const controller = new Controller(core);
  controller.render();
  const seekBarEl = controller.childElements?.seekBar;

  core.video.emit(Events.VIDEO_TIMEUPDATE);

  expect(seekBarEl?.value).toBe('0');

  core.video.getCurrentTime = () => 5;
  core.video.getDuration = () => 10;
  core.video.emit(Events.VIDEO_TIMEUPDATE);

  expect(seekBarEl?.value).toBe('0.5');
});

it('seek bar를 드래그를 시작할 경우 timeupdate로 인한 seek bar의 value는 변경되지 않는다', () => {
  const core = new Core(config);
  const controller = new Controller(core);
  controller.render();
  const seekBarEl = controller.childElements?.seekBar;

  seekBarEl?.dispatchEvent(new Event('mousedown', { bubbles: true }));
  core.video.getCurrentTime = () => 5;
  core.video.getDuration = () => 10;
  core.video.emit(Events.VIDEO_TIMEUPDATE);

  expect(seekBarEl?.value).toBe('0');
});

it('seek bar의 드래그를 시작했을 때 영상이 재생중인 경우 영상의 재생을 일시 정지한다.', () => {
  const core = new Core(config);
  core.video.pause = jest.fn();
  core.video.isPaused = () => false;
  const controller = new Controller(core);
  controller.render();
  const seekBarEl = controller.childElements?.seekBar;

  seekBarEl?.dispatchEvent(new Event('mousedown', { bubbles: true }));

  expect(core.video.pause).toHaveBeenCalled();
});

it('seek bar의 드래그를 시작했을 때 영상이 일시 정지인 경우 영상은 여전히 일시 정지 중이다.', () => {
  const core = new Core(config);
  core.video.play = jest.fn();
  const controller = new Controller(core);
  controller.render();
  const seekBarEl = controller.childElements?.seekBar;

  seekBarEl?.dispatchEvent(new Event('mousedown', { bubbles: true }));

  expect(core.video.play).not.toHaveBeenCalled();
});

it('seek bar 드래그가 끝나면 비디오의 시간을 탐색한다', () => {
  const core = new Core(config);
  core.video.seek = jest.fn();
  core.video.getDuration = () => 10;
  const controller = new Controller(core);
  controller.render();
  const seekBarEl = controller.childElements?.seekBar;
  if (seekBarEl) {
    seekBarEl.value = '0.5';
  }

  seekBarEl?.dispatchEvent(new Event('mousedown', { bubbles: true }));
  seekBarEl?.dispatchEvent(new Event('click', { bubbles: true }));

  expect(core.video.seek).toHaveBeenCalledWith(5);
});

it('seek bar 드래그가 끝나면 timeupdate로 인한 seek bar의 value가 변경이 된다', () => {
  const core = new Core(config);
  core.video.getCurrentTime = () => 5;
  core.video.getDuration = () => 10;
  const controller = new Controller(core);
  controller.render();
  const seekBarEl = controller.childElements?.seekBar;

  // 드래그 시작 및 timeupdate 이벤트 발생
  seekBarEl?.dispatchEvent(new Event('mousedown', { bubbles: true }));
  core.video.emit(Events.VIDEO_TIMEUPDATE);

  // 드래그를 시작하면 timeupdate 이벤트를 핸들링하지 않는다
  expect(seekBarEl?.value).toBe('0');

  // 드래그 종료
  seekBarEl?.dispatchEvent(new Event('click', { bubbles: true }));
  core.video.emit(Events.VIDEO_TIMEUPDATE);

  expect(seekBarEl?.value).toBe('0.5');
});

it('seek bar 드래그가 끝나면 재생 중이었던 경우 다시 재생한다', () => {
  const core = new Core(config);
  core.video.pause = jest.fn();
  core.video.play = jest.fn();
  core.video.seek = jest.fn();
  core.video.isPaused = () => false;
  const controller = new Controller(core);
  controller.render();
  const seekBarEl = controller.childElements?.seekBar;

  seekBarEl?.dispatchEvent(new Event('mousedown', { bubbles: true }));

  expect(core.video.pause).toHaveBeenCalledTimes(1);
  expect(core.video.play).toHaveBeenCalledTimes(0);

  seekBarEl?.dispatchEvent(new Event('click', { bubbles: true }));

  expect(core.video.pause).toHaveBeenCalledTimes(1);
  expect(core.video.play).toHaveBeenCalledTimes(1);
});

it('영상의 길이가 변경된다', () => {
  const core = new Core(config);
  core.video.getDuration = () => 3599.9999;
  const controller = new Controller(core);
  controller.render();
  const durationEl = controller.childElements?.duration;

  core.video.emit(Events.VIDEO_DURATIONCHANGE);

  expect(durationEl?.textContent).toBe('59:59');
});

it('비디오의 시간이 변경되면 현재 시간이 변경된다', () => {
  const core = new Core(config);
  core.video.getDuration = () => 70;
  core.video.getCurrentTime = () => 35;
  const controller = new Controller(core);
  controller.render();
  const currentTimeEl = controller.childElements?.currentTime;

  core.video.emit(Events.VIDEO_TIMEUPDATE);

  expect(currentTimeEl?.textContent).toBe('00:35');
});

it('비디오에 에러가 발생하면 엘리먼트를 숨기고 등록한 이벤트 리스너를 제거한다', () => {
  const core = new Core(config);
  const controller = new Controller(core);
  controller.render();
  const playToggleButtonEl = controller.childElements?.playToggleButton;

  core.video.emit(Events.VIDEO_ERROR);
  core.video.emit(Events.VIDEO_PLAY);

  expect(controller.el.style.display).toBe('none');
  expect(
    playToggleButtonEl?.classList.contains(
      'better-player__toggle-button--pressed',
    ),
  ).toBe(false);
});

it('seek bar를 드래그하면 위치에 따라 current time이 변경된다', () => {
  const core = new Core(config);
  core.video.getDuration = () => 100;
  const controller = new Controller(core);
  controller.render();
  const currentTimeEl = controller.childElements?.currentTime;
  const seekBarEl = controller.childElements?.seekBar;

  if (seekBarEl) {
    seekBarEl.value = '0.5';
    seekBarEl.dispatchEvent(new Event('input', { bubbles: true }));
  }

  expect(currentTimeEl?.textContent).toBe('00:50');
});

it('volume bar에 input 이벤트가 발생하면 비디오의 볼륨이 변경된다', () => {
  const core = new Core(config);
  const controller = new Controller(core);
  controller.render();
  const volumeBarEl = controller.childElements?.volumeBar;

  if (volumeBarEl) {
    volumeBarEl.value = '0.4';
    volumeBarEl.dispatchEvent(new Event('input', { bubbles: true }));
  }

  expect(core.video.getVolume()).toBe(0.4);
});

it('volumechange 이벤트가 비디오에서 발생하면 컨트롤러의 volume bar가 업데이트 된다', () => {
  const core = new Core(config);
  core.video.getVolume = () => 0.212;
  const controller = new Controller(core);
  controller.render();
  const volumeBarEl = controller.childElements?.volumeBar;

  core.video.el.dispatchEvent(new Event('volumechange', { bubbles: true }));

  expect(volumeBarEl?.value).toBe('0.212');
});

it('비디오의 볼륨이 0이 되면 음소거 토글 버튼이 업데이트 된다', () => {
  const core = new Core(config);
  core.video.getVolume = () => 0;
  const controller = new Controller(core);
  controller.render();
  const muteToggleButtonEl = controller.childElements?.muteToggleButton;

  core.video.el.dispatchEvent(new Event('volumechange', { bubbles: true }));

  expect(
    muteToggleButtonEl?.classList.contains(
      'better-player__toggle-button--pressed',
    ),
  ).toBe(true);
});

it('비디오의 볼륨이 0이 아니게 되면 음소거 토글 버튼이 업데이트 된다', () => {
  const core = new Core(config);
  core.video.getVolume = () => 0;
  const controller = new Controller(core);
  controller.render();
  const muteToggleButtonEl = controller.childElements?.muteToggleButton;

  core.video.el.dispatchEvent(new Event('volumechange', { bubbles: true }));

  expect(
    muteToggleButtonEl?.classList.contains(
      'better-player__toggle-button--pressed',
    ),
  ).toBe(true);

  core.video.getVolume = () => 1;
  core.video.el.dispatchEvent(new Event('volumechange', { bubbles: true }));

  expect(
    muteToggleButtonEl?.classList.contains(
      'better-player__toggle-button--pressed',
    ),
  ).toBe(false);
});

it('음소거 토글 버튼을 눌러 음소거를 한다', () => {
  const core = new Core(config);
  const controller = new Controller(core);
  controller.render();
  const muteToggleButtonEl = controller.childElements?.muteToggleButton;

  muteToggleButtonEl?.dispatchEvent(new Event('click', { bubbles: true }));

  expect(core.video.getVolume()).toBe(0);
});

it('음소거 토글 버튼을 눌러 음소거를 해제한다', () => {
  const core = new Core(config);
  const controller = new Controller(core);
  controller.render();
  const muteToggleButtonEl = controller.childElements?.muteToggleButton;

  // 음소거
  muteToggleButtonEl?.dispatchEvent(new Event('click', { bubbles: true }));

  expect(core.video.getVolume()).toBe(0);

  // 음소거 해제
  muteToggleButtonEl?.dispatchEvent(new Event('click', { bubbles: true }));

  expect(core.video.getVolume()).toBe(1);
});

it('음소거 토글 버튼을 눌러 음소거를 해제할 경우 이전 볼륨값을 복원한다', () => {
  const core = new Core(config);
  const controller = new Controller(core);
  controller.render();
  const muteToggleButtonEl = controller.childElements?.muteToggleButton;
  const volumeBarEl = controller.childElements?.volumeBar;
  if (volumeBarEl) {
    volumeBarEl.value = '0.7';
  }

  volumeBarEl?.dispatchEvent(new InputEvent('input', { bubbles: true }));

  // 음소거
  muteToggleButtonEl?.dispatchEvent(new Event('click', { bubbles: true }));

  expect(core.video.getVolume()).toBe(0);

  // 음소거 해제
  muteToggleButtonEl?.dispatchEvent(new Event('click', { bubbles: true }));

  expect(core.video.getVolume()).toBe(0.7);
});

it('비디오 플레이어를 전체 화면으로 전환한다', () => {
  const core = new Core(config);
  core.isFullscreen = () => false;
  core.requestFullscreen = jest.fn();
  const controller = new Controller(core);
  controller.render();
  const fullscreenToggleButtonEl =
    controller.childElements?.fullscreenToggleButton;

  fullscreenToggleButtonEl?.dispatchEvent(
    new Event('click', { bubbles: true }),
  );

  expect(core.requestFullscreen).toHaveBeenCalled();
});

it('비디오 플레이어의 전체 화면을 해제한다', () => {
  const core = new Core(config);
  core.isFullscreen = () => true;
  core.exitFullscreen = jest.fn();
  const controller = new Controller(core);
  controller.render();
  const fullscreenToggleButtonEl =
    controller.childElements?.fullscreenToggleButton;

  fullscreenToggleButtonEl?.dispatchEvent(
    new Event('click', { bubbles: true }),
  );

  expect(core.exitFullscreen).toHaveBeenCalled();
});

describe('core에서 CORE_FULLSCREENCHANGE 이벤트가 발생했을 때', () => {
  it('전체 화면이면 fullscreenToggleButton에 클래스를 추가한다', () => {
    const core = new Core(config);
    core.isFullscreen = () => true;
    const controller = new Controller(core);
    controller.render();
    const fullscreenToggleButtonEl =
      controller.childElements?.fullscreenToggleButton;

    core.emit(Events.CORE_FULLSCREENCHANGE);

    expect(
      fullscreenToggleButtonEl?.classList.contains(
        'better-player__toggle-button--pressed',
      ),
    ).toBe(true);
  });

  it('전체 화면이 아니면 fullscreenToggleButton에 클래스를 삭제한다', () => {
    const core = new Core(config);
    core.isFullscreen = () => false;
    const controller = new Controller(core);
    controller.render();
    const fullscreenToggleButtonEl =
      controller.childElements?.fullscreenToggleButton;

    core.emit(Events.CORE_FULLSCREENCHANGE);

    expect(
      fullscreenToggleButtonEl?.classList.contains(
        'better-player__toggle-button--pressed',
      ),
    ).toBe(false);
  });
});
