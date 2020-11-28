import {
  addEventListener,
  appendChild,
  createElement,
  getElementById,
  innerHTML,
  getElementByClassName,
  removeElement,
  removeEventListener,
  addClass,
  removeClass,
} from './element';

beforeEach(() => {
  document.body.innerHTML = '';
});

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

describe('appendChild', () => {
  it('자식 엘리먼트를 추가한다', () => {
    const parent = document.createElement('div');
    const child = document.createElement('div');

    appendChild(parent, child);

    expect(parent.children.length).toBe(1);
  });
});

describe('innerHTML', () => {
  it('엘리먼트의 내부 html을 변경한다', () => {
    const element = document.createElement('div');
    const disappear = document.createElement('span');
    const html = '<div>hello world</div>';

    // 없어질 엘리먼트 등록
    element.appendChild(disappear);
    expect(element.firstElementChild).toBe(disappear);

    innerHTML(element, html);

    expect(element.firstElementChild).not.toBe(disappear);
    expect(element.innerHTML).toBe(html);
  });
});

describe('getElementById', () => {
  it('id를 이용해서 엘리먼트를 찾는다', () => {
    const body = document.body;
    const target = document.createElement('div');
    target.id = 'target';

    body.appendChild(target);

    expect(getElementById('target')).toBe(target);
  });

  it('id를 이용해서 엘리먼트를 못찾으면 null을 반환한다', () => {
    const body = document.body;
    const target = document.createElement('div');

    body.appendChild(target);

    expect(getElementById('target')).toBe(null);
  });
});

describe('getElementByClassName', () => {
  it('class 이름을 이용해서 엘리먼트를 찾는다', () => {
    const body = document.body;
    const target = document.createElement('div');
    target.className = 'target_class';
    body.appendChild(target);

    expect(getElementByClassName(body, 'target_class')).toBe(target);
  });
});

describe('addClass', () => {
  it('class를 엘리먼트에 추가한다', () => {
    const el = document.createElement('div');

    addClass(el, 'my-class');

    expect(el.classList.contains('my-class')).toBe(true);
  });

  it('동일한 이름의 class가 이미 존재하는 효과가 없다', () => {
    const el = document.createElement('div');
    el.classList.add('my-class');

    addClass(el, 'my-class');

    expect(el.classList.length).toBe(1);
  });

  it('복수의 class가 존재하는 경우에도 클래스를 추가할 수 있다', () => {
    const el = document.createElement('div');
    el.classList.add('a-class');
    el.classList.add('b-class');

    addClass(el, 'c-class');
    addClass(el, 'd-class');

    expect(el.classList.length).toBe(4);
    expect(el.classList.contains('a-class')).toBe(true);
    expect(el.classList.contains('b-class')).toBe(true);
    expect(el.classList.contains('c-class')).toBe(true);
    expect(el.classList.contains('d-class')).toBe(true);
  });
});

describe('removeClass', () => {
  it('class를 엘리먼트에서 제거한다', () => {
    const el = document.createElement('div');
    el.classList.add('my-class');

    removeClass(el, 'my-class');

    expect(el.classList.contains('my-class')).toBe(false);
  });

  it('제거하려는 class가 존재하지 않는 경우 효과가 없다', () => {
    const el = document.createElement('div');
    el.classList.add('my-class');

    removeClass(el, 'wrong-class');

    expect(el.classList.length).toBe(1);
  });

  it('복수의 class가 존재하는 경우에도 클래스를 삭제할 수 있다', () => {
    const el = document.createElement('div');
    el.classList.add('a-class');
    el.classList.add('b-class');
    el.classList.add('c-class');

    removeClass(el, 'a-class');
    removeClass(el, 'c-class');

    expect(el.classList.length).toBe(1);
    expect(el.classList.contains('b-class')).toBe(true);
  });
});
