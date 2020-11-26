export default function template() {
  return `
    <div class="better-player__controller-top-panel">
      <input type="range" class="better-player__seek-bar">
    </div>
    <div class="better-player__controller-bottom-panel">
      <div class="better-player__controller-left-panel">
        <div class="better-player__play-toggle-button">
          <svg class="better-player__icon">
            <use href="#better-player-play"></use>
          </svg>
          <svg class="better-player__icon better-player__icon--hide">
            <use href="#better-player-pause"></use>
          </svg>
        </div>
        <div class="better-player__current-time">00:00</div>
        <div class="better-player__duration">00:00</div>
        <div class="better-player__mute-toggle-button">
          <svg class="better-player__icon">
            <use href="#better-player-volume"></use>
          </svg>
          <svg class="better-player__icon better-player__icon--hide">
            <use href="#better-player-mute"></use>
          </svg>
        </div>
        <input type="range" class="better-player__volume-bar">
      </div>
      <div class="better-player__controller-right-panel">
        <div class="better-player__fullscreen-toggle-button">
          <svg class="better-player__icon">
            <use href="#better-player-fullscreen-in"></use>
          </svg>
          <svg class="better-player__icon better-player__icon--hide">
            <use href="#better-player-fullscreen-out"></use>
          </svg>
        </div>
      </div>
    </div>`;
}
