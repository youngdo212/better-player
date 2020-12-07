import i18n from '../../utils/i18n';

/**
 * Error Screen의 템플릿 반환 함수
 *
 * @param {object} config
 * @returns {string}
 */
export default function template(config) {
  return `
    <div class="better-player__error-screen-message">${i18n.get(
      'notFoundVideo',
      config
    )}</div>
    <div class="better-player__reload-button">
      <svg class="better-player__icon">
        <use href="#better-player-reload"></use>
      </svg>
    </div>
  `;
}
