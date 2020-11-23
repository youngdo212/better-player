import Events from '../../base/events';
import HTMLVideo from './HTMLVideo';

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
