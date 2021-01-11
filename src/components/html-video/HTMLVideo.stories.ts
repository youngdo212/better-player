import HTMLVideo from './HTMLVideo';
import config from '../../config/defaults';

export default {
  title: 'HTMLVideo',
};

export const Default = ({ videoUrl }: { videoUrl: string }): HTMLElement => {
  const video = new HTMLVideo({
    ...config,
    source: videoUrl,
  });
  return video.el;
};
Default.args = {
  videoUrl:
    'http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
};
