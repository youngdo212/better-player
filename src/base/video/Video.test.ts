import config from '../../config/defaults';
import Video from './Video';

it('config이라는 이름의 환경 설정 속성을 가진다', () => {
  class TestVideo extends Video {}

  const video = new TestVideo(config);

  expect(video.config).toBe(config);
});

it('isPaused() 메소드가 기본 값을 가진다', () => {
  class TestVideo extends Video {}

  const video = new TestVideo(config);

  expect(video.isPaused()).toBe(true);
});

it('play() 메소드를 가진다', () => {
  class TestVideo extends Video {}

  const video = new TestVideo(config);

  expect(video.play).toBeDefined();
});

it('pause() 메소드를 가진다', () => {
  class TestVideo extends Video {}

  const video = new TestVideo(config);

  expect(video.pause).toBeDefined();
});

it('getDuration() 메소드를 가진다', () => {
  class TestVideo extends Video {}

  const video = new TestVideo(config);

  expect(video.getDuration).toBeDefined();
});

it('getCurrentTime() 메소드를 가진다', () => {
  class TestVideo extends Video {}

  const video = new TestVideo(config);

  expect(video.getCurrentTime).toBeDefined();
});

it('seek() 메소드를 가진다', () => {
  class TestVideo extends Video {}

  const video = new TestVideo(config);

  expect(video.seek).toBeDefined();
});

it('setVolume() 메소드를 가진다', () => {
  class TestVideo extends Video {}

  const video = new TestVideo(config);

  expect(video.setVolume).toBeDefined();
});

it('getVolume() 메소드를 가진다', () => {
  class TestVideo extends Video {}

  const video = new TestVideo(config);

  expect(video.getVolume).toBeDefined();
});

it('mute() 메소드를 가진다', () => {
  class TestVideo extends Video {}

  const video = new TestVideo(config);

  expect(video.mute).toBeDefined();
});

it('unmute() 메소드를 가진다', () => {
  class TestVideo extends Video {}

  const video = new TestVideo(config);

  expect(video.unmute).toBeDefined();
});

it('reload() 메소드를 가진다', () => {
  class TestVideo extends Video {}

  const video = new TestVideo(config);

  expect(video.reload).toBeDefined();
});
