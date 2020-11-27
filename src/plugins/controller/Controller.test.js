import Controller from './Controller';
import HTMLVideo from '../../components/html-video';
import NoVideo from '../../components/no-video';
import Core from '../../components/core';
import config from '../../config/defaults';
import Events from '../../base/events';

it('비디오가 재생 불가능할 경우 렌더링되지 않는다', () => {
  const core = new Core(config);
  core.video = new NoVideo(config);
  const controller = new Controller(core);
  controller.render();

  expect(core.el.firstElementChild).toBe(null);
});

it('비디오가 재생 가능할 경우 렌더링된다', () => {
  const core = new Core(config);
  core.video = new HTMLVideo(config);
  const controller = new Controller(core);
  controller.render();

  expect(core.el.firstElementChild).toBe(controller.el);
});

it('하위 엘리먼트를 렌더링한다', () => {
  const core = new Core(config);
  core.video = new HTMLVideo(config);
  const controller = new Controller(core);
  controller.render();

  expect(controller.el.children.length).not.toBe(0);
});

it('비디오를 재생시킨다', () => {
  const core = new Core(config);
  core.video = new HTMLVideo(config);
  core.video.play = jest.fn();
  const controller = new Controller(core);
  controller.render();
  const playToggleButtonEl = controller.el.querySelector(
    '.better-player__play-toggle-button'
  );

  playToggleButtonEl.dispatchEvent(new Event('click', { bubbles: true }));

  expect(core.video.play).toHaveBeenCalled();
});

it('비디오를 일시 정지시킨다', () => {
  const core = new Core(config);
  core.video = new HTMLVideo(config);
  core.video.isPaused = () => false;
  core.video.pause = jest.fn();
  const controller = new Controller(core);
  controller.render();
  const playToggleButtonEl = controller.el.querySelector(
    '.better-player__play-toggle-button'
  );

  playToggleButtonEl.dispatchEvent(new Event('click', { bubbles: true }));

  expect(core.video.pause).toHaveBeenCalled();
});

it('비디오가 재생되면 playToggleButton의 클래스를 추가한다', () => {
  const core = new Core(config);
  core.video = new HTMLVideo(config);
  core.video.isPaused = () => false;
  const controller = new Controller(core);
  controller.render();

  core.video.emit(Events.VIDEO_PLAY);

  expect(
    controller.$playToggleButton.classList.contains(
      'better-player__toggle-button--pressed'
    )
  ).toBe(true);
});

it('비디오가 일시 정지되면 playToggleButton의 클래스를 삭제한다', () => {
  const core = new Core(config);
  core.video = new HTMLVideo(config);
  core.video.isPaused = () => false;
  const controller = new Controller(core);
  controller.render();

  // 비디오 플레이어를 재생하여 클래스를 추가
  core.video.emit(Events.VIDEO_PLAY);

  // 클래스가 추가됐는지 확인
  expect(
    controller.$playToggleButton.classList.contains(
      'better-player__toggle-button--pressed'
    )
  ).toBe(true);

  // 비디오 플레이어를 일시 정지하여 테스트
  core.video.isPaused = () => true;
  core.video.emit(Events.VIDEO_PAUSE);

  expect(
    controller.$playToggleButton.classList.contains(
      'better-player__toggle-button--pressed'
    )
  ).toBe(false);
});
