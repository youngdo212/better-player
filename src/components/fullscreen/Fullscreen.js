/** @module components/fullscreen */

import Events from '../../base/events';
import fscreen from 'fscreen';

// TODO: 라이브러리(fscreen) 의존성 없애기.
// TODO: Element에 fullscreenchange 이벤트를 등록할 수 있도록 만들기(fscreen은 document에만 등록 가능했음)
/**
 * 전체화면을 관리하는 클래스
 *
 * @extends Events
 */
export default class Fullscreen extends Events {
  /**
   * 전체 화면 된 엘리먼트를 반환한다.
   */
  get element() {
    return fscreen.fullscreenElement;
  }
  /**
   * 인스턴스를 생성한다.
   */
  constructor() {
    super();
    this.boundFullscreenChangeHandler = event =>
      this.emit(Events.FULLSCREEN_CHANGE, event);
    fscreen.addEventListener(
      'fullscreenchange',
      this.boundFullscreenChangeHandler
    );
  }

  /**
   * 엘리먼트를 전체화면으로 전환한다.
   *
   * @param {Element} element
   */
  request(element) {
    fscreen.requestFullscreen(element);
  }

  /**
   * 전체 화면에서 나온다.
   */
  exit() {
    fscreen.exitFullscreen();
  }

  /**
   * 인스턴스에 등록된 이벤트 핸들러를 전부 제거하고
   * document에 등록한 fullscreenchange 이벤트 핸들러도 제거한다.
   */
  destroy() {
    this.off();
    fscreen.removeEventListener(
      'fullscreenchange',
      this.boundFullscreenChangeHandler
    );
  }
}
