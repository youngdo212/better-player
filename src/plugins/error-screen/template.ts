/**
 * Error Screen의 템플릿 반환 함수
 *
 * @param {object} config
 * @returns {string}
 */
export default function template(): string {
  return `
    <div class="better-player__error-screen-message" data-error-message></div>
    <div class="better-player__reload-button" data-reload>
      <svg class="better-player__icon">
        <use href="#better-player-reload"></use>
      </svg>
    </div>
  `;
}
