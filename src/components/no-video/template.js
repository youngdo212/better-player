import i18n from '../../utils/i18n';

/**
 * NoVideo의 내부 html 템플릿
 * @param {object} config
 * @returns {string}
 */
export default function template(config) {
  return `<span class="better-player__no-video-message">${i18n.get(
    'notSupportVideoFormat',
    config
  )}</span>`;
}
