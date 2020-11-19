import Player from './Player';

export default {
  title: 'Player',
};

export const Default = () => {
  const parent = document.createElement('div');
  new Player({ parent });
  return parent;
};
