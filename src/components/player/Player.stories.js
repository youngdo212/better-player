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

export const MutiplePlayer = ({ sourceA, sourceB, width, height }) => {
  const wrapper = document.createElement('div');
  const parentA = document.createElement('div');
  const parentB = document.createElement('div');
  wrapper.appendChild(parentA);
  wrapper.appendChild(parentB);

  // eslint-disable-next-line no-unused-vars
  const playerA = new Player({
    source: sourceA,
    parent: parentA,
    width,
    height,
  });

  // eslint-disable-next-line no-unused-vars
  const playerB = new Player({
    source: sourceB,
    parent: parentB,
    width,
    height,
  });

  return wrapper;
};
MutiplePlayer.args = {
  sourceA:
    'http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/Sintel.mp4',
  sourceB:
    'http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/TearsOfSteel.mp4',
  width: 830,
  height: 360,
};
