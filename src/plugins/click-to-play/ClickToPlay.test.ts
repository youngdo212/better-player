import type { Config } from '../../types';
import { mocked } from 'ts-jest/utils';
import Events from '../../base/events';
import HTMLVideo from '../../components/html-video';
import config from '../../config/defaults';
import ClickToPlay from './ClickToPlay';
import Core from '../../components/core';
jest.mock('../../components/core');

beforeAll(() => {
  mocked(Core).mockImplementation((config: Config) => {
    const mockCore = {
      video: new HTMLVideo(config),
      config,
    };
    return (mockCore as unknown) as Core;
  });
});

beforeEach(() => {
  mocked(Core).mockClear();
});

it('정지 상태에서 video 엘리먼트에 클릭이 발생할 경우 비디오 엘리먼트가 재생된다', () => {
  const core = new Core(config);
  const playSpy = jest.spyOn(core.video, 'play').mockImplementation(() => {
    // do nothing
  });
  new ClickToPlay(core);

  core.video.emit(Events.VIDEO_CLICK);

  expect(playSpy).toHaveBeenCalledTimes(1);

  playSpy.mockRestore();
});

it('재생 상태에서 video 엘리먼트에 클릭이 발생할 경우 비디오 엘리먼트가 일시 정지된다', () => {
  const core = new Core(config);
  core.video.isPaused = () => false;
  const pauseSpy = jest.spyOn(core.video, 'pause').mockImplementation(() => {
    // do nothing
  });
  new ClickToPlay(core);

  core.video.emit(Events.VIDEO_CLICK);

  expect(pauseSpy).toHaveBeenCalledTimes(1);

  pauseSpy.mockRestore();
});

it('비디오에 에러가 발생할 경우 플러그인을 끈다', () => {
  const core = new Core(config);
  const disableSpy = jest
    .spyOn(ClickToPlay.prototype, 'disable')
    .mockImplementation(() => {
      // do nothing
    });
  new ClickToPlay(core);

  core.video.emit(Events.VIDEO_ERROR);

  expect(disableSpy).toHaveBeenCalledTimes(1);

  disableSpy.mockRestore();
});

it('disable을 시킨 후 enable할 경우 다시 정상적으로 동작한다', () => {
  const core = new Core(config);
  const playSpy = jest.spyOn(core.video, 'play').mockImplementation(() => {
    // do nothing
  });
  const clickToPlay = new ClickToPlay(core);

  // enable 전 테스트
  clickToPlay.disable();
  core.video.emit(Events.VIDEO_CLICK);

  expect(playSpy).toHaveBeenCalledTimes(0);

  // enable 후 테스트
  clickToPlay.enable();
  core.video.emit(Events.VIDEO_CLICK);

  expect(playSpy).toHaveBeenCalledTimes(1);

  playSpy.mockRestore();
});

it('환경 설정의 clickToPlay가 false인 경우 비활성화한다', () => {
  const core = new Core({
    ...config,
    clickToPlay: false,
  });
  const disableSpy = jest
    .spyOn(ClickToPlay.prototype, 'disable')
    .mockImplementation(() => {
      // do nothing
    });
  new ClickToPlay(core);

  expect(disableSpy).toHaveBeenCalledTimes(1);

  disableSpy.mockRestore();
});

it('환경 설정의 clickToPlay가 false인 경우 enable 메소드 호출이 무시된다', () => {
  const core = new Core({
    ...config,
    clickToPlay: false,
  });
  const playSpy = jest.spyOn(core.video, 'play').mockImplementation(() => {
    // do nothing
  });
  const clickToPlay = new ClickToPlay(core);

  // enable 전 테스트
  core.video.emit(Events.VIDEO_CLICK);

  expect(playSpy).toHaveBeenCalledTimes(0);

  // enable 후 테스트
  clickToPlay.enable();
  core.video.emit(Events.VIDEO_CLICK);

  expect(playSpy).toHaveBeenCalledTimes(0);

  playSpy.mockRestore();
});
