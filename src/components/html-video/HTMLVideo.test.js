import Events from '../../base/events';
import HTMLVideo from './HTMLVideo';
import config from '../../config/defaults';

beforeEach(() => {
  document.body.innerHTML = '';
});

it('비디오 엘리먼트를 생성한다', () => {
  const video = new HTMLVideo({
    source: { src: 'http://localhost/test.mp4', type: 'video/mp4' },
  });

  expect(video.el.tagName).toBe('VIDEO');
  expect(video.el.src).toBe('http://localhost/test.mp4');
  expect(video.el.type).toBe('video/mp4');
});

it('비디오 엘리먼트의 play 이벤트가 발생하면 VIDEO_PLAY 이벤트가 발생한다', () => {
  const video = new HTMLVideo({
    source: { src: '', type: '' },
  });
  const callback = jest.fn();

  video.on(Events.VIDEO_PLAY, callback);
  video.el.dispatchEvent(new Event('play'));

  expect(callback).toHaveBeenCalled();
});

it('비디오 엘리먼트의 pause 이벤트가 발생하면 VIDEO_PAUSE 이벤트가 발생한다', () => {
  const video = new HTMLVideo({
    source: { src: '', type: '' },
  });
  const callback = jest.fn();

  video.on(Events.VIDEO_PAUSE, callback);
  video.el.dispatchEvent(new Event('pause'));

  expect(callback).toHaveBeenCalled();
});

it('비디오 엘리먼트를 DOM에서 제거하고 src attribute를 초기화한다', () => {
  HTMLMediaElement.prototype.load = () => {
    /** do nothing */
  };

  const wrapper = document.createElement('div');
  const video = new HTMLVideo({
    source: { src: 'http://localhost/test.mp4' },
  });

  wrapper.appendChild(video.render().el);
  expect(wrapper.firstElementChild).toBe(video.el);
  expect(video.el.src).toBe('http://localhost/test.mp4');

  video.destroy();

  expect(wrapper.children.length).toBe(0);
  expect(video.el.getAttribute('src')).toBe(null);
});

it('비디오 엘리먼트의 pause 이벤트가 발생하면 VIDEO_PAUSE 이벤트가 발생한다', () => {
  const video = new HTMLVideo(config);
  const callback = jest.fn();

  video.on(Events.VIDEO_TIMEUPDATE, callback);
  video.el.dispatchEvent(new Event('timeupdate'));

  expect(callback).toHaveBeenCalled();
});

it('비디오의 총 길이를 반환한다', () => {
  const video = new HTMLVideo(config);

  expect(video.getDuration()).toBe(NaN);
});

it('비디오의 현재 시간을 반환한다', () => {
  const video = new HTMLVideo(config);

  expect(video.getCurrentTime()).toBe(0);
});

it('비디오의 현재 시간을 변경한다', () => {
  const video = new HTMLVideo(config);

  video.seek(100);

  expect(video.getCurrentTime()).toBe(100);
});

it('비디오의 현재 시간을 음수로 변경하면 영상의 처음으로 돌아간다', () => {
  const video = new HTMLVideo(config);

  video.seek(-100);

  expect(video.getCurrentTime()).toBe(0);
});

it('비디오 엘리먼트의 durationchange 이벤트가 발생하면 VIDEO_DURATIONCHANGE 이벤트가 발생한다', () => {
  const video = new HTMLVideo(config);
  const callback = jest.fn();

  video.on(Events.VIDEO_DURATIONCHANGE, callback);
  video.el.dispatchEvent(new Event('durationchange'));

  expect(callback).toHaveBeenCalled();
});

it('비디오의 볼륨을 조절한다', () => {
  const video = new HTMLVideo(config);

  video.setVolume(0.7);

  expect(video.getVolume()).toBe(0.7);
});

it('비디오 엘리먼트의 volumechange 이벤트가 발생하면 VIDEO_VOLUMECHANGE 이벤트가 발생한다', () => {
  const video = new HTMLVideo(config);
  const callback = jest.fn();

  video.on(Events.VIDEO_VOLUMECHANGE, callback);
  video.el.dispatchEvent(new Event('volumechange'));

  expect(callback).toHaveBeenCalled();
});

it('음소거한다', () => {
  const video = new HTMLVideo(config);

  video.mute();

  expect(video.getVolume()).toBe(0);
});

it('음소거를 해제했을 때 이전 볼륨으로 되돌린다', () => {
  const video = new HTMLVideo(config);

  video.setVolume(0.77);
  video.mute();

  expect(video.getVolume()).toBe(0);

  video.unmute();

  expect(video.getVolume()).toBe(0.77);
});

it('음소거를 해제했을 때 이전 볼륨이 0이라면 1로 되돌린다', () => {
  const video = new HTMLVideo(config);

  video.setVolume(0);
  video.mute();

  expect(video.getVolume()).toBe(0);

  video.unmute();

  expect(video.getVolume()).toBe(1);
});
