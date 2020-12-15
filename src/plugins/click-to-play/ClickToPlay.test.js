import Events from '../../base/events';
import HTMLVideo from '../../components/html-video';
import config from '../../config/defaults';
import ClickToPlay from './ClickToPlay';

it('video 엘리먼트에 클릭이 발생할 경우 onClick 메소드가 호출된다', () => {
  const onClickSpy = jest
    .spyOn(ClickToPlay.prototype, 'onClick')
    .mockImplementation(() => {});
  const mockCore = {
    video: new HTMLVideo(config),
    config,
  };
  const clickToPlay = new ClickToPlay(mockCore); // eslint-disable-line no-unused-vars

  mockCore.video.emit(Events.VIDEO_CLICK);

  expect(onClickSpy).toHaveBeenCalledTimes(1);

  onClickSpy.mockRestore();
});

it('정지 상태에서 onClick메소드가 호출될 경우 비디오 엘리먼트가 재생된다', () => {
  const mockCore = {
    video: new HTMLVideo(config),
    config,
  };
  const playSpy = jest
    .spyOn(mockCore.video, 'play')
    .mockImplementation(() => {});
  const clickToPlay = new ClickToPlay(mockCore);

  clickToPlay.onClick();

  expect(playSpy).toHaveBeenCalledTimes(1);

  playSpy.mockRestore();
});

it('재생 상태에서 onClick메소드가 호출될 경우 비디오 엘리먼트가 일시 정지된다', () => {
  const mockCore = {
    video: new HTMLVideo(config),
    config,
  };
  mockCore.video.isPaused = () => false;
  const pauseSpy = jest
    .spyOn(mockCore.video, 'pause')
    .mockImplementation(() => {});
  const clickToPlay = new ClickToPlay(mockCore);

  clickToPlay.onClick();

  expect(pauseSpy).toHaveBeenCalledTimes(1);

  pauseSpy.mockRestore();
});

it('비디오에 에러가 발생할 경우 플러그인을 끈다', () => {
  const onClickSpy = jest
    .spyOn(ClickToPlay.prototype, 'onClick')
    .mockImplementation(() => {});
  const mockCore = {
    video: new HTMLVideo(config),
    config,
  };
  const clickToPlay = new ClickToPlay(mockCore); // eslint-disable-line no-unused-vars

  // 에러 발생 전 잘 작동하는지 확인
  mockCore.video.emit(Events.VIDEO_CLICK);

  expect(onClickSpy).toHaveBeenCalledTimes(1);

  // 비디오 에러 이벤트 발생 후 다시 이벤트 발생
  mockCore.video.emit(Events.VIDEO_ERROR);
  mockCore.video.emit(Events.VIDEO_CLICK);

  expect(onClickSpy).toHaveBeenCalledTimes(1);

  onClickSpy.mockRestore();
});

it('환경 설정의 clickToPlay가 false인 경우 비활성화한다', () => {
  const onClickSpy = jest
    .spyOn(ClickToPlay.prototype, 'onClick')
    .mockImplementation(() => {});
  const mockCore = {
    video: new HTMLVideo(config),
    config: { ...config, clickToPlay: false },
  };
  const clickToPlay = new ClickToPlay(mockCore); // eslint-disable-line no-unused-vars

  mockCore.video.emit(Events.VIDEO_CLICK);

  expect(onClickSpy).toHaveBeenCalledTimes(0);

  onClickSpy.mockRestore();
});

it('환경 설정의 clickToPlay가 false인 경우 enable 메소드 호출이 무시된다', () => {
  const onClickSpy = jest
    .spyOn(ClickToPlay.prototype, 'onClick')
    .mockImplementation(() => {});
  const mockCore = {
    video: new HTMLVideo(config),
    config: { ...config, clickToPlay: false },
  };
  const clickToPlay = new ClickToPlay(mockCore);

  // enable 전 테스트
  mockCore.video.emit(Events.VIDEO_CLICK);

  expect(onClickSpy).toHaveBeenCalledTimes(0);

  // enable 후 테스트
  clickToPlay.enable();

  mockCore.video.emit(Events.VIDEO_CLICK);

  expect(onClickSpy).toHaveBeenCalledTimes(0);

  onClickSpy.mockRestore();
});
