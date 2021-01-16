import { mocked } from 'ts-jest/utils';
import Events from '../../base/events';
import UIObject from '../../base/ui-object';
import Video from '../../base/video';
import Core from '../../components/core';
import HTMLVideo from '../../components/html-video';
import config from '../../config/defaults';
import { Config } from '../../types';
import Keyboard from './Keyboard';
jest.mock('../../components/core');

beforeAll(() => {
  mocked(Core).mockImplementation((config: Config) => {
    class MockCore extends UIObject<'div'> {
      public video: Video;
      public config: Config;
      constructor(config: Config) {
        super('div');
        this.video = new HTMLVideo(config);
        this.config = config;
      }
    }

    const core = new MockCore(config);

    return core as Core;
  });
});

beforeEach(() => {
  mocked(Core).mockClear();
});

// it('코어에 CORE_KEYDOWN 이벤트가 발생하면 onKeydown 메소드가 호출된다', () => {
//   const onKeydownSpy = jest
//     .spyOn(Keyboard.prototype, 'onKeydown')
//     .mockImplementation(() => {
//       // do nothing
//     });
//   const core = new Core(config);

//   core.emit(Events.CORE_KEYDOWN, new KeyboardEvent('keydown'));

//   expect(onKeydownSpy).toHaveBeenCalledTimes(1);

//   onKeydownSpy.mockRestore();
// });

it('왼쪽 방향키 버튼 이벤트가 발생하면 비디오를 되감는다', () => {
  const core = new Core(config);
  const video = core.video;
  const seekSpy = jest.spyOn(video, 'seek');
  new Keyboard(core);
  const answer = video.getCurrentTime() - config.seekTime;

  core.emit(
    Events.CORE_KEYDOWN,
    new KeyboardEvent('keydown', { key: 'ArrowLeft' }),
  );

  expect(seekSpy).toHaveBeenCalledWith(answer);

  seekSpy.mockRestore();
});

it('오른쪽 방향키 버튼 이벤트가 발생하면 비디오를 앞으로 감는다', () => {
  const core = new Core(config);
  const video = core.video;
  const seekSpy = jest.spyOn(video, 'seek');
  new Keyboard(core);
  const answer = video.getCurrentTime() + config.seekTime;

  core.emit(
    Events.CORE_KEYDOWN,
    new KeyboardEvent('keydown', { key: 'ArrowRight' }),
  );

  expect(seekSpy).toHaveBeenCalledWith(answer);

  seekSpy.mockRestore();
});

it('위쪽 방향키 버튼 이벤트가 발생하면 비디오의 볼륨을 키운다', () => {
  const core = new Core(config);
  const video = core.video;
  video.getVolume = () => 1;
  const setVolumeSpy = jest.spyOn(video, 'setVolume');
  new Keyboard(core);
  const answer = video.getVolume() + config.volumeStep;

  core.emit(
    Events.CORE_KEYDOWN,
    new KeyboardEvent('keydown', { key: 'ArrowUp' }),
  );

  expect(setVolumeSpy).toHaveBeenCalledWith(answer);

  setVolumeSpy.mockRestore();
});

it('아래쪽 방향키 버튼 이벤트가 발생하면 비디오의 볼륨을 낮춘다', () => {
  const core = new Core(config);
  const video = core.video;
  video.getVolume = () => 1;
  const setVolumeSpy = jest.spyOn(video, 'setVolume');
  new Keyboard(core);
  const answer = video.getVolume() - config.volumeStep;

  core.emit(
    Events.CORE_KEYDOWN,
    new KeyboardEvent('keydown', { key: 'ArrowDown' }),
  );

  expect(setVolumeSpy).toHaveBeenCalledWith(answer);

  setVolumeSpy.mockRestore();
});

it('일시 정지 중 스페이스바 버튼 이벤트가 발생하면 비디오를 재생 시킨다', () => {
  const core = new Core(config);
  const video = core.video;
  const playSpy = jest.spyOn(video, 'play').mockImplementation(() => {
    // do nothing
  });
  new Keyboard(core);

  core.emit(Events.CORE_KEYDOWN, new KeyboardEvent('keydown', { key: ' ' }));

  expect(playSpy).toHaveBeenCalledTimes(1);

  playSpy.mockRestore();
});

it('재생 중 스페이스바 버튼 이벤트가 발생하면 비디오를 일시 정지 시킨다', () => {
  const core = new Core(config);
  const video = core.video;
  video.isPaused = () => false;
  const pauseSpy = jest.spyOn(video, 'pause').mockImplementation(() => {
    // do nothing
  });
  new Keyboard(core);

  core.emit(Events.CORE_KEYDOWN, new KeyboardEvent('keydown', { key: ' ' }));

  expect(pauseSpy).toHaveBeenCalledTimes(1);

  pauseSpy.mockRestore();
});

it('등록되지 않은 키보드 이벤트가 발생하는 경우 에러가 발생하지 않는다', () => {
  const core = new Core(config);
  new Keyboard(core);

  core.emit(
    Events.CORE_KEYDOWN,
    new KeyboardEvent('keydown', { key: 'Shift' }),
  );
});

it('비디오에서 에러 이벤트가 발생하면 disable이 호출된다', () => {
  const disableSpy = jest
    .spyOn(Keyboard.prototype, 'disable')
    .mockImplementation(() => {
      // do nothing
    });
  const core = new Core(config);
  const video = core.video;
  new Keyboard(core);

  video.emit(Events.VIDEO_ERROR, { message: 'test' });

  expect(disableSpy).toHaveBeenCalledTimes(1);

  disableSpy.mockRestore();
});

it('config에 keyboard값이 false이면 disable이 호출된다', () => {
  const disableSpy = jest
    .spyOn(Keyboard.prototype, 'disable')
    .mockImplementation(() => {
      // do nothing
    });
  const core = new Core({
    ...config,
    keyboard: false,
  });
  new Keyboard(core);

  expect(disableSpy).toHaveBeenCalledTimes(1);

  disableSpy.mockRestore();
});

it('config에 keyboard값이 false이면 enable이 동작하지 않는다', () => {
  const core = new Core({
    ...config,
    keyboard: false,
  });
  const keyboardPlugin = new Keyboard(core);

  expect(keyboardPlugin.enabled).toBe(false);

  keyboardPlugin.enable();

  expect(keyboardPlugin.enabled).toBe(false);
});
