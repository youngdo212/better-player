import HTMLVideo from './HTMLVideo';

export default {
  title: 'HTMLVideo',
};

export const Default = ({ videoUrl }) => {
  const video = new HTMLVideo({
    source: {
      src: videoUrl,
    },
  });
  return video.el;
};
Default.args = {
  videoUrl:
    'http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
};
