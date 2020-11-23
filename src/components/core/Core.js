/** @module components/core */

import UIObject from '../../base/ui-object';
import { appendChild } from '../../utils/element';

/**
 * 비디오 플레이어의 핵심 클래스
 * 비디오 플레이어 그 자체 엘리먼트를 가지고 있으며 다양한 컴포넌트를 제공한다.
 * 컴포넌트간의 소통은 항상 Core를 거친다.
 *
 * @extends UIObject
 */
export default class Core extends UIObject {
  /**
   * 옵션 객체를 이용해 인스턴스를 생성한다.
   * @param {object} options
   * @param {HTMLElement=} options.parentElement
   */
  constructor(options) {
    super();
    this.options = options;
  }

  /**
   * 부모 엘리먼트에 core 엘리먼트를 추가한다.
   */
  render() {
    if (this.options.parentElement) {
      appendChild(this.options.parentElement, this.el);
    }
    return this;
  }
}
