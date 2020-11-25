import Player from './Player';

export default {
  title: 'Player',
};

const Template = ({ source, width, height }) => {
  const parent = document.createElement('div');

  new Player({
    source,
    parent,
    width,
    height,
  });

  return parent;
};

export const WithSource = Template.bind({});
WithSource.args = {
  source:
    'http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
};

export const WithoutSource = Template.bind({});
WithoutSource.args = {};

export const NotSupportVideoFormat = Template.bind({});
NotSupportVideoFormat.args = {
  source: 'http:/not-support.video/format.jpg',
};

export const WithSize = Template.bind({});
WithSize.args = {
  source:
    'http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
  width: 640,
  height: 360,
};
