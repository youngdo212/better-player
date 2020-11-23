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
    'https://cdn.plyr.io/static/demo/View_From_A_Blue_Moon_Trailer-576p.mp4',
};
