/** @module plugins/error-screen */

import './ErrorScreen.scss';
import UIPlugin from '../../base/ui-plugin';
import {
  addClass,
  appendChild,
  getElementsBySelectorMap,
  innerHTML,
  removeClass,
} from '../../utils/element';
import template from './template';
import Events from '../../base/events';
import type { Attributes, EventHandlerNameMap, VideoError } from '../../types';
import type Core from '../../components/core';
import { assertIsDefined } from '../../utils/assert';

interface ChildElements {
  errorMessage: HTMLElement;
}

/**
 * 비디오 리소스를 서버에서 찾을 수 없는 경우 나타나는 UI 플러그인
 *
 * @extends UIPlugin
 */
export default class ErrorScreen extends UIPlugin {
  public childElements: ChildElements | null = null;

  get selectors(): Record<keyof ChildElements, string> {
    return {
      errorMessage: '[data-error-message]',
    };
  }

  get attributes(): Attributes {
    return {
      class: 'better-player__error-screen',
    };
  }

  get events(): EventHandlerNameMap {
    return {
      'click [data-reload]': 'reload',
    };
  }

  /**
   * 인스턴스를 생성하고 초기 상태로 자신을 숨긴다.
   */
  constructor(core: Core) {
    super(core);
    this.hide();
  }

  /**
   * 비디오 컴포넌트에 에러 이벤트 핸들러를 등록한다
   */
  protected addEventListeners(): void {
    this.listenTo(this.video, Events.VIDEO_ERROR, this.onError);
  }

  /**
   * 비디오 플레이어에서 발생한 에러를 핸들링한다.
   */
  private onError({ message }: VideoError): void {
    assertIsDefined(this.childElements, 'childElements');
    const { errorMessage } = this.childElements;
    errorMessage.textContent = message;
    this.show();
  }

  /**
   * 에러가 발생하지 않았기 때문에 에러 스크린을 보이지 않게 한다
   */
  private hide(): void {
    addClass(this.el, 'better-player__error-screen--hide');
  }

  /**
   * 에러가 발생해서 에러 스크린이 보이게 한다
   */
  private show(): void {
    removeClass(this.el, 'better-player__error-screen--hide');
  }

  /**
   * 비디오 플레이어를 리로드 한다.
   */
  private reload(): void {
    this.hide();
    this.core.reload();
  }

  /**
   * 자식 엘리먼트를 캐상한다.
   */
  private cacheChildElements(): void {
    const childElements = getElementsBySelectorMap(this.el, this.selectors);
    assertIsValidChildElements(childElements);
    this.childElements = childElements;
  }

  /**
   * 하위 엘리먼트를 렌더링하고 core에 자신을 추가한다
   */
  public render(): ErrorScreen {
    innerHTML(this.el, template());
    this.cacheChildElements();
    appendChild(this.core.el, this.el);
    return this;
  }
}

/**
 * childElements의 속성 값이 HTMLElement의 인스턴스라는 것을 단언한다
 */
function assertIsValidChildElements(
  childElements: Record<keyof ChildElements, unknown>,
): asserts childElements is ChildElements {
  const { errorMessage } = childElements;

  if (errorMessage instanceof HTMLElement) return;

  throw new Error('invalid childElements');
}
