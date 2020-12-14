export default function template() {
  return `
    <div class="better-player__controller-top-panel">
      <input type="range" class="better-player__seek-bar" min="0" max="1" value="0" step="any" data-seek-bar>
    </div>
    <div class="better-player__controller-bottom-panel">
      <div class="better-player__controller-left-panel">
        <div class="better-player__toggle-button better-player__play-toggle-button" data-play-toggle>
          <svg class="better-player__toggle-icon--not-pressed better-player__icon">
            <use href="#better-player-play"></use>
          </svg>
          <svg class="better-player__toggle-icon--pressed better-player__icon">
            <use href="#better-player-pause"></use>
          </svg>
        </div>
        <div class="better-player__current-time" data-current-time>00:00</div>
        <div class="better-player__duration" data-duration>00:00</div>
        <div class="better-player__toggle-button better-player__mute-toggle-button" data-mute-toggle>
          <svg class="better-player__toggle-icon--not-pressed better-player__icon">
            <use href="#better-player-volume"></use>
          </svg>
          <svg class="better-player__toggle-icon--pressed better-player__icon">
            <use href="#better-player-mute"></use>
          </svg>
        </div>
        <input type="range" class="better-player__volume-bar" min="0" max="1" value="1" step="any" data-volume-bar>
      </div>
      <div class="better-player__controller-right-panel">
        <div class="better-player__toggle-button better-player__fullscreen-toggle-button" data-fullscreen-toggle>
          <svg class="better-player__toggle-icon--not-pressed better-player__icon">
            <use href="#better-player-fullscreen-in"></use>
          </svg>
          <svg class="better-player__toggle-icon--pressed better-player__icon">
            <use href="#better-player-fullscreen-out"></use>
          </svg>
        </div>
      </div>
    </div>`;
}
