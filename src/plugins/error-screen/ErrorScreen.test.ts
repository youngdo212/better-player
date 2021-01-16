import { mocked } from 'ts-jest/utils';
import Events from '../../base/events';
import UIObject from '../../base/ui-object';
import Video from '../../base/video';
import Core from '../../components/core';
import config from '../../config/defaults';
import { Config } from '../../types';
import ErrorScreen from './ErrorScreen';
jest.mock('../../components/core');

beforeAll(() => {
  mocked(Core).mockImplementation((config: Config) => {
    class MockVideo extends Events {}
    class MockCore extends UIObject<'div'> {
      public video: Video;
      public config: Config;
      constructor(config: Config) {
        super('div');
        this.video = new MockVideo() as Video;
        this.config = config;
      }
      public reload(): void {
        // do nothing
      }
    }
    const mockCore = new MockCore(config);
    return mockCore as Core;
  });
});

beforeEach(() => {
  mocked(Core).mockClear();
});

it('올바른 클래스 속성을 가진다', () => {
  const core = new Core(config);
  const errorScreen = new ErrorScreen(core);
  errorScreen.render();

  expect(errorScreen.el.classList.contains('better-player__error-screen')).toBe(
    true,
  );
});

it('렌더링을 올바르게 수행한다', () => {
  const core = new Core(config);
  const errorScreen = new ErrorScreen(core);

  errorScreen.render();

  expect(core.el.children).toContain(errorScreen.el);
  expect(
    errorScreen.el.querySelector('.better-player__error-screen-message'),
  ).toBeDefined();
});

it('플러그인의 초기 상태는 안보이는 상태다', () => {
  const core = new Core(config);
  const errorScreen = new ErrorScreen(core);
  errorScreen.render();

  expect(
    errorScreen.el.classList.contains('better-player__error-screen--hide'),
  ).toBe(true);
});

it('에러 스크린을 드러낸다', () => {
  const core = new Core(config);
  const errorScreen = new ErrorScreen(core);
  const error = { message: 'test' };

  errorScreen.render();
  core.video.emit(Events.VIDEO_ERROR, error);

  expect(errorScreen.el.classList).not.toContain(
    'better-player__error-screen--hide',
  );
  expect(errorScreen.childElements?.errorMessage.textContent).toBe(
    error.message,
  );
});

it('에러 스크린을 숨긴다', () => {
  const core = new Core(config);
  const errorScreen = new ErrorScreen(core);
  const error = { message: 'test' };
  errorScreen.render();
  const reloadButtonEl = errorScreen.el.querySelector(
    '.better-player__reload-button',
  );

  core.video.emit(Events.VIDEO_ERROR, error);
  reloadButtonEl?.dispatchEvent(new Event('click', { bubbles: true }));

  expect(errorScreen.el.classList).toContain(
    'better-player__error-screen--hide',
  );
});

it('리로드 버튼을 클릭하면 모습을 감추고 core의 reload 함수를 호출한다', () => {
  const core = new Core(config);
  const reloadSpy = jest.spyOn(core, 'reload');
  const errorScreen = new ErrorScreen(core);
  const error = { message: 'test' };
  errorScreen.render();
  const reloadButtonEl = errorScreen.el.querySelector(
    '.better-player__reload-button',
  );

  core.video.emit(Events.VIDEO_ERROR, error);
  reloadButtonEl?.dispatchEvent(new Event('click', { bubbles: true }));

  expect(errorScreen.el.classList).toContain(
    'better-player__error-screen--hide',
  );
  expect(reloadSpy).toHaveBeenCalledTimes(1);

  reloadSpy.mockRestore();
});
