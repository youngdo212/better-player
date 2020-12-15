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
  };
  const clickToPlay = new ClickToPlay(mockCore); // eslint-disable-line no-unused-vars

  mockCore.video.emit(Events.VIDEO_CLICK);

  expect(onClickSpy).toHaveBeenCalledTimes(1);

  onClickSpy.mockRestore();
});

it('정지 상태에서 onClick메소드가 호출될 경우 비디오 엘리먼트가 재생된다', () => {
  HTMLMediaElement.prototype.pause = () => {};
  const mockCore = {
    video: new HTMLVideo(config),
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
  HTMLMediaElement.prototype.pause = () => {};
  const mockCore = {
    video: new HTMLVideo(config),
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
