import Core from './Core';
import config from '../../config/defaults';

export default {
  title: 'Core',
};

interface CoreStoryArgs {
  videoUrl: string;
  width?: number;
  height?: number;
}

interface CoreStory {
  (args: CoreStoryArgs): HTMLElement;
  args?: CoreStoryArgs;
}

const Template: CoreStory = ({ videoUrl, width, height }) => {
  const core = new Core({
    ...config,
    source: videoUrl,
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
