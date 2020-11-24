import UIObject from './UIObject';

beforeEach(() => {
  document.body.innerHTML = '';
});

it('div 엘리먼트가 디폴트로 만들어진다', () => {
  const div = new UIObject();
  expect(div.el.tagName).toBe('DIV');
});

it('tagName을 오버라이딩해 어떤 태그로도 생성이 가능하다', () => {
  class Button extends UIObject {
    get tagName() {
      return 'button';
    }
  }
  const button = new Button();

  expect(button.el.tagName).toBe('BUTTON');
});

it('attributes를 오버라이딩해서 태그에 속성을 추가할 수 있다', () => {
  class Button extends UIObject {
    get attributes() {
      return { class: 'my-button' };
    }
  }
  const button = new Button();

  expect(button.el.className).toBe('my-button');
});

it('events를 오버라이딩하여 이벤트 리스너를 추가할 수 있다', () => {
  class Button extends UIObject {
    get events() {
      return {
        click: 'onClick',
      };
    }
    onClick() {
      this.clicked = true;
    }
  }
  const button = new Button();
  const clickEvent = new Event('click');

  button.el.dispatchEvent(clickEvent);

  expect(button.clicked).toBe(true);
});

it('events에 설정된 메소드 중 존재하지 않는 메소드는 제외하고 등록된다', () => {
  class Button extends UIObject {
    get events() {
      return {
        click: 'onClick',
        mouseover: 'onMouseover',
      };
    }
    handleClick() {
      this.clicked = true;
    }
    onMouseover() {
      this.mouseovered = true;
    }
  }
  const button = new Button();
  const clickEvent = new Event('click');
  const mouseoverEvent = new Event('mouseover');

  button.el.dispatchEvent(clickEvent);
  button.el.dispatchEvent(mouseoverEvent);

  expect(button.clicked).toBeUndefined();
  expect(button.mouseovered).toBe(true);
});

it('render 메소드 호출 시 자기 자신을 반환한다', () => {
  const test = new UIObject();

  expect(test.render()).toBe(test);
});

it('엘리먼트에 등록한 이벤트 리스너를 전부 제거한다', () => {
  class Button extends UIObject {
    constructor() {
      super();
      this.count = 0;
    }
    get events() {
      return {
        click: 'increase',
      };
    }
    increase() {
      this.count = this.count + 1;
    }
  }
  const button = new Button();
  const clickEvent = new Event('click');

  button.el.dispatchEvent(clickEvent);

  expect(button.count).toBe(1);

  button.destroy();
  button.el.dispatchEvent(clickEvent);
  button.el.dispatchEvent(clickEvent);

  expect(button.count).toBe(1);
});

it('DOM에서 엘리먼트를 제거한다', () => {
  class Button extends UIObject {
    get tagName() {
      return 'button';
    }
  }

  const body = document.body;
  const button = new Button();

  body.appendChild(button.el);

  expect(body.children.length).toBe(1);
  expect(body.firstElementChild).toBe(button.el);
  expect(button.el.parentNode).toBe(body);

  button.destroy();

  expect(body.children.length).toBe(0);
  expect(body.firstElementChild).not.toBe(button.el);
  expect(button.el.parentNode).not.toBe(body);
});

it('객체에 등록한 이벤트 리스너를 전부 제거한다', () => {
  class Button extends UIObject {
    get tagName() {
      return 'button';
    }
  }

  const button = new Button();
  const listener = jest.fn();
  const eventName = 'test';

  button.on(eventName, listener);
  button.emit(eventName);

  expect(listener).toHaveBeenCalledTimes(1);

  button.destroy();
  button.emit(eventName);
  button.emit(eventName);

  expect(listener).toHaveBeenCalledTimes(1);
});
