import Player from './Player';

export default {
  title: 'Player',
};

const Template = ({ source }) => {
  const parent = document.createElement('div');
  parent.style.width = '640px';
  parent.style.height = '360px';

  new Player({
    source,
    parent,
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
