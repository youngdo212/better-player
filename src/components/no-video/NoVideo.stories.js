import NoVideo from './NoVideo';
import config from '../../config';

export default {
  title: 'NoVideo',
  decorators: [
    Story => {
      const parent = document.createElement('div');
      parent.style.width = '500px';
      parent.style.height = '300px';
      parent.appendChild(Story());
      return parent;
    },
  ],
};

export const Default = ({ message }) => {
  const options = { ...config, i18n: { notSupportVideoFormat: message } };
  const noVideo = new NoVideo(options);
  noVideo.render();
  return noVideo.el;
};
Default.args = {
  message: config.i18n.notSupportVideoFormat,
};
