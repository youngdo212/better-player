import Events from '../../base/events';
import Core from '../../components/core';
import HTMLVideo from '../../components/html-video';
import NoVideo from '../../components/no-video';
import config from '../../config/defaults';
import ErrorScreen from './ErrorScreen';

it('올바른 클래스 속성을 가진다', () => {
  const core = new Core(config);
  const errorScreen = new ErrorScreen(core);

  expect(errorScreen.el.classList.contains('better-player__error-screen')).toBe(
    true
  );
});

it('렌더링을 올바르게 수행한다', () => {
  const core = new Core(config);
  core.video = new HTMLVideo(config);
  const errorScreen = new ErrorScreen(core);

  errorScreen.render();

  expect(core.el.children).toContain(errorScreen.el);
  expect(
    errorScreen.el.querySelector('.better-player__error-screen-message')
  ).toBeDefined();
});

it('비디오가 플레이 가능하지 않을 경우 자신을 렌더링하지 않는다', () => {
  const core = new Core(config);
  core.video = new NoVideo(config);
  const errorScreen = new ErrorScreen(core);

  errorScreen.render();

  expect(core.el.children).not.toContain(errorScreen.el);
});

it('플러그인의 초기 상태는 안보이는 상태다', () => {
  const core = new Core(config);
  const errorScreen = new ErrorScreen(core);

  expect(
    errorScreen.el.classList.contains('better-player__error-screen--hide')
  ).toBe(true);
});

it('에러 스크린을 드러낸다', () => {
  const core = new Core(config);
  const errorScreen = new ErrorScreen(core);

  errorScreen.show();

  expect(errorScreen.el.classList).not.toContain(
    'better-player__error-screen--hide'
  );
});

it('에러 스크린을 숨긴다', () => {
  const core = new Core(config);
  const errorScreen = new ErrorScreen(core);

  errorScreen.show();
  errorScreen.hide();

  expect(errorScreen.el.classList).toContain(
    'better-player__error-screen--hide'
  );
});

it('비디오에 에러 이벤트가 발생할 경우 에러 스크린을 드러낸다', () => {
  HTMLMediaElement.prototype.canPlayType = () => 'maybe';
  const core = new Core(config);
  const errorScreen = core.plugins.find(
    plugin => plugin instanceof ErrorScreen
  );

  core.video.emit(Events.VIDEO_ERROR);

  expect(errorScreen.el.classList).not.toContain(
    'better-player__error-screen--hide'
  );
});
