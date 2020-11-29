import Core from './Core';
import config from '../../config/defaults';

export default {
  title: 'Core',
};

const Template = ({ videoUrl, width, height }) => {
  const core = new Core({
    ...config,
    source: { src: videoUrl },
    width,
    height,
  });
  core.render();
  return core.el;
};

export const SupportVideoFormat = Template.bind({});
SupportVideoFormat.args = {
  videoUrl:
    'http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
};

export const NotSupportVideoFormat = Template.bind({});
NotSupportVideoFormat.args = {
  videoUrl: 'https://not.support.video.format/image.jpg',
};

export const WithSize = Template.bind({});
WithSize.args = {
  videoUrl:
    'http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
  width: 640,
  height: 360,
};
