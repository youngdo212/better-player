import Video from './Video';

it('config이라는 이름의 환경 설정 속성을 가진다', () => {
  const config = {};
  const video = new Video(config);

  expect(video.config).toBe(config);
});

it('isPaused() 메소드가 기본 값을 가진다', () => {
  const video = new Video({});

  expect(video.isPaused()).toBe(true);
});

it('play() 메소드를 가진다', () => {
  const video = new Video({});

  expect(video.play).toBeDefined();
});

it('pause() 메소드를 가진다', () => {
  const video = new Video({});

  expect(video.pause).toBeDefined();
});

it('getDuration() 메소드를 가진다', () => {
  const video = new Video({});

  expect(video.getDuration).toBeDefined();
});

it('getCurrentTime() 메소드를 가진다', () => {
  const video = new Video({});

  expect(video.getCurrentTime).toBeDefined();
});
