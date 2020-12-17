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

describe('비디오 이벤트 발생 관련', () => {
  it('비디오 엘리먼트의 play 이벤트가 발생하면 VIDEO_PLAY 이벤트가 발생한다', () => {
    const video = new HTMLVideo(config);
    const callback = jest.fn();

    video.on(Events.VIDEO_PLAY, callback);
    video.el.dispatchEvent(new Event('play'));

    expect(callback).toHaveBeenCalled();
  });

  it('비디오 엘리먼트의 pause 이벤트가 발생하면 VIDEO_PAUSE 이벤트가 발생한다', () => {
    const video = new HTMLVideo(config);
    const callback = jest.fn();

    video.on(Events.VIDEO_PAUSE, callback);
    video.el.dispatchEvent(new Event('pause'));

    expect(callback).toHaveBeenCalled();
  });

  it('비디오 엘리먼트의 ended 이벤트가 발생하면 VIDEO_ENDED 이벤트가 발생한다', () => {
    const video = new HTMLVideo(config);
    const callback = jest.fn();

    video.on(Events.VIDEO_ENDED, callback);
    video.el.dispatchEvent(new Event('ended'));

    expect(callback).toHaveBeenCalled();
  });

  it('비디오 엘리먼트의 seeking 이벤트가 발생하면 VIDEO_SEEKING 이벤트가 발생한다', () => {
    const video = new HTMLVideo(config);
    const callback = jest.fn();

    video.on(Events.VIDEO_SEEKING, callback);
    video.el.dispatchEvent(new Event('seeking'));

    expect(callback).toHaveBeenCalled();
  });

  it('비디오 엘리먼트의 seeked 이벤트가 발생하면 VIDEO_SEEKED 이벤트가 발생한다', () => {
    const video = new HTMLVideo(config);
    const callback = jest.fn();

    video.on(Events.VIDEO_SEEKED, callback);
    video.el.dispatchEvent(new Event('seeked'));

    expect(callback).toHaveBeenCalled();
  });

  it('비디오 엘리먼트의 error 이벤트가 발생하면 VIDEO_ERROR 이벤트가 발생한다', () => {
    const video = new HTMLVideo(config);
    const callback = jest.fn();

    video.on(Events.VIDEO_ERROR, callback);
    video.el.dispatchEvent(new Event('error'));

    expect(callback).toHaveBeenCalled();
  });

  it('비디오 엘리먼트의 click 이벤트가 발생하면 VIDEO_CLICK 이벤트가 발생한다', () => {
    const video = new HTMLVideo(config);
    const callback = jest.fn();

    video.on(Events.VIDEO_CLICK, callback);
    video.el.dispatchEvent(new Event('click'));

    expect(callback).toHaveBeenCalled();
  });
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

it('비디오의 현재 시간은 총 길이보다 크게 설정하면 총 길이로 설정된다', () => {
  const video = new HTMLVideo(config);
  video.getDuration = () => 200;

  video.seek(1000);

  expect(video.el.currentTime).toBe(200);
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

it('비디오의 볼륨을 음수로 설정하면 0으로 설정된다', () => {
  const video = new HTMLVideo(config);

  video.setVolume(-1);

  expect(video.getVolume()).toBe(0);
});

it('비디오의 볼륨을 1보다 큰 값으로 설정하면 1로 설정된다', () => {
  const video = new HTMLVideo(config);

  video.setVolume(2);

  expect(video.getVolume()).toBe(1);
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

it('비디오를 다시 로드하면 video 엘리먼트의 load 함수를 호출한다', () => {
  const callback = jest.fn();
  HTMLMediaElement.prototype.load = () => {
    callback();
  };
  const video = new HTMLVideo(config);

  video.reload();

  expect(callback).toHaveBeenCalledTimes(1);
});
