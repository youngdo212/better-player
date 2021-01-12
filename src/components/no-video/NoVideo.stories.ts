import NoVideo from './NoVideo';
import config from '../../config/defaults';

export default {
  title: 'NoVideo',
  decorators: [
    (Story: () => HTMLElement): HTMLElement => {
      const parent = document.createElement('div');
      parent.style.width = '500px';
      parent.style.height = '300px';
      parent.appendChild(Story());
      return parent;
    },
  ],
};

export const Default = (): HTMLElement => {
  const noVideo = new NoVideo(config);
  noVideo.render();
  return noVideo.el;
};
