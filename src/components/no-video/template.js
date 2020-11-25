/**
 * NoVideo의 내부 html 템플릿
 * @param {object} i18n
 * @param {string} i18n.notSupportVideoFormat
 * @returns {string}
 */
export default function template({ notSupportVideoFormat }) {
  return `<span class="better-player__no-video-message">${notSupportVideoFormat}</span>`;
}
