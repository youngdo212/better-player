import NoVideo from './NoVideo';
import config from '../../config/defaults';
import Events from '../../base/events';

it('올바른 엘리먼트를 생성한다', () => {
  const noVideo = new NoVideo(config);

  expect(noVideo.el.tagName).toBe('VIDEO');
  expect(noVideo.el.className).toBe('better-player__no-video');
});

it('생성될 때 VIDEO_ERROR 이벤트를 적절한 인자와 함께 비동기로 발생시킨다', done => {
  const noVideo = new NoVideo(config);

  noVideo.on(Events.VIDEO_ERROR, ({ message }) => {
    try {
      expect(message).toBe(config.i18n.notSupportVideoFormat);
      done();
    } catch (error) {
      done(error);
    }
  });
});

it('reload 메소드를 호출하면 VIDEO_ERROR 이벤트를 적절한 인자와 함께 발생시킨다', done => {
  const noVideo = new NoVideo(config);

  noVideo.once(Events.VIDEO_ERROR, () => {
    noVideo.reload();
    noVideo.on(Events.VIDEO_ERROR, ({ message }) => {
      try {
        expect(message).toBe(config.i18n.notSupportVideoFormat);
        done();
      } catch (error) {
        done(error);
      }
    });
  });
});

it('canPlayType 메소드는 항상 true를 반환한다', () => {
  const source = 'test.mp4';

  expect(NoVideo.canPlayType(source)).toBe(true);
});
