import config from '../../config/defaults';
import NoVideo from '../no-video/NoVideo';
import VideoFactory from './VideoFactory';

it('비디오를 생성한다', () => {
  const videoFactory = new VideoFactory({
    ...config,
    source: 'test.mp4',
  });
  const video = videoFactory.create();

  expect(video instanceof NoVideo).toBe(true);
});
