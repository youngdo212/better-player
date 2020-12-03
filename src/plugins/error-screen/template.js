/**
 * Error Screen의 템플릿 반환 함수
 *
 * @param {object} i18n
 * @param {string} i18n.notFoundVideo
 * @returns {string}
 */
export default function template({ notFoundVideo }) {
  return `
    <div class="better-player__error-screen-message">${notFoundVideo}</div>
    <div class="better-player__reload-button">
      <svg class="better-player__icon">
        <use href="#better-player-reload"></use>
      </svg>
    </div>
  `;
}
