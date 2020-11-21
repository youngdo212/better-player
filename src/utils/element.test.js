import {
  addEventListener,
  createElement,
  removeElement,
  removeEventListener,
} from './element';

describe('createElement', () => {
  it('인자 없이 호출하면 기본 엘리먼트가 생성된다', () => {
    const el = createElement();

    expect(el.tagName.toLowerCase()).toBe('div');
  });

  it('지정한 태그로 엘리먼트가 올바르게 생성된다', () => {
    const tagName = 'video';
    const el = createElement(tagName);

    expect(el.tagName.toLowerCase()).toBe(tagName);
  });

  it('설정한 속성(attribute)대로 엘리먼트를 올바르게 생성한다', () => {
    const tagName = 'video';
    const attributes = {
      src: 'sample.mp4',
      controls: '',
    };
    const el = createElement(tagName, attributes);

    expect(el.tagName.toLowerCase()).toBe(tagName);
    expect(el.getAttribute('src')).toBe(attributes['src']);
    expect(el.getAttribute('controls')).toBe(attributes['controls']);
  });
});

describe('removeElement', () => {
  it('엘리먼트를 DOM에서 성공적으로 제거한다', () => {
    document.body.innerHTML = `
      <div id="parent">
        <div id="target"></div>
      </div>
    `;

    const parent = document.getElementById('parent');
    const target = document.getElementById('target');

    // target 엘리먼트가 parent의 자식으로 생성되었는지 확인
    expect(target.parentNode).toBe(parent);
    expect(parent.children.length).toBe(1);

    removeElement(target);

    expect(target.parentNode).not.toBe(parent);
    expect(parent.children.length).toBe(0);
  });

  it('제거할 엘리먼트가 부모를 가지지 않을 경우 아무 일도 일어나지 않는다', () => {
    const el = document.createElement('div');

    removeElement(el);
  });
});

describe('addEventListener', () => {
  it('이벤트 리스너를 올바르게 추가한다', () => {
    const el = document.createElement('div');
    const eventName = 'click';
    const event = new Event(eventName);
    const listener = jest.fn();

    addEventListener(el, eventName, listener);
    el.dispatchEvent(event);

    expect(listener).toHaveBeenCalled();
  });
});

describe('removeEventListener', () => {
  it('이벤트 리스너를 올바르게 제거한다', () => {
    const el = document.createElement('div');
    const eventName = 'click';
    const event = new Event(eventName);
    const listener = jest.fn();

    addEventListener(el, eventName, listener);
    el.dispatchEvent(event);

    // 올바르게 등록 됐는지 확인
    expect(listener).toHaveBeenCalledTimes(1);

    removeEventListener(el, eventName, listener);
    el.dispatchEvent(event);

    expect(listener).toHaveBeenCalledTimes(1);
  });
});
