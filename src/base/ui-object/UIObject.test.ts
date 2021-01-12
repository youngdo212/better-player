import UIObject from './UIObject';

beforeEach(() => {
  document.body.innerHTML = '';
});

it('어떤 태그로도 생성이 가능하다', () => {
  class Button extends UIObject<'button'> {
    constructor() {
      super('button');
    }
  }
  const button = new Button();

  expect(button.el.tagName).toBe('BUTTON');
});

it('attributes를 오버라이딩해서 태그에 속성을 추가할 수 있다', () => {
  class Button extends UIObject<'button'> {
    constructor() {
      super('button');
    }
    get attributes() {
      return { class: 'my-button' };
    }
  }
  const button = new Button();

  expect(button.el.className).toBe('my-button');
});

it('events를 오버라이딩하여 이벤트 리스너를 추가할 수 있다', () => {
  class Button extends UIObject<'button'> {
    public clicked = false;
    constructor() {
      super('button');
    }
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

it('events를 오버라이딩 하여 여러개의 이벤트 리스너를 추가할 수 있다', () => {
  class Button extends UIObject<'button'> {
    public clicked = false;
    public mouseovered = false;
    constructor() {
      super('button');
    }
    get events() {
      return {
        click: 'onClick',
        mouseover: 'onMouseover',
      };
    }
    onClick() {
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

  expect(button.clicked).toBe(true);
  expect(button.mouseovered).toBe(true);
});

it('events에 존재하지 않는 메소드를 사용하면 에러를 발생시킨다', () => {
  class Button extends UIObject<'button'> {
    public clicked = false;
    constructor() {
      super('button');
    }
    get events() {
      return {
        click: 'onClick',
      };
    }
    handleClick() {
      this.clicked = true;
    }
  }
  expect(() => {
    new Button();
  }).toThrow();
});

it('render 메소드 호출 시 자기 자신을 반환한다', () => {
  class TestUIObject extends UIObject<'div'> {
    constructor() {
      super('div');
    }
  }
  const test = new TestUIObject();

  expect(test.render()).toBe(test);
});

it('엘리먼트에 등록한 이벤트 리스너를 전부 제거한다', () => {
  class Button extends UIObject<'button'> {
    public count: number;
    constructor() {
      super('button');
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
  class Button extends UIObject<'button'> {
    constructor() {
      super('button');
    }
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
  class Button extends UIObject<'button'> {
    constructor() {
      super('button');
    }
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

it('events 객체에 selector를 이용해 이벤트 리스너를 등록한다', () => {
  const callback1 = jest.fn();
  const callback2 = jest.fn();
  class Wrapper extends UIObject<'div'> {
    constructor() {
      super('div');
    }
    get events() {
      return {
        'click .first': 'onClickFirst',
        'click .second': 'onClickSecond',
      };
    }
    onClickFirst() {
      callback1();
    }
    onClickSecond() {
      callback2();
    }
    render() {
      this.el.innerHTML = '<div class="first"></div><div class="second"></div>';
      return this;
    }
  }
  const wrapper = new Wrapper();
  wrapper.render();
  const firstEl = wrapper.el.querySelector('.first');
  const secondEl = wrapper.el.querySelector('.second');

  wrapper.el.dispatchEvent(new Event('click', { bubbles: true }));
  expect(callback1).not.toHaveBeenCalled();
  expect(callback2).not.toHaveBeenCalled();

  firstEl?.dispatchEvent(new Event('click', { bubbles: true }));
  expect(callback1).toHaveBeenCalled();

  secondEl?.dispatchEvent(new Event('click', { bubbles: true }));
  expect(callback2).toHaveBeenCalled();
});

it('events 객체에 selector를 이용해 등록한 이벤트 리스너를 제거한다', () => {
  const callback1 = jest.fn();
  const callback2 = jest.fn();
  class Wrapper extends UIObject<'div'> {
    constructor() {
      super('div');
    }
    get events() {
      return {
        'click .first': 'onClickFirst',
        'click .second': 'onClickSecond',
      };
    }
    onClickFirst() {
      callback1();
    }
    onClickSecond() {
      callback2();
    }
    render() {
      this.el.innerHTML = '<div class="first"></div><div class="second"></div>';
      return this;
    }
  }
  const wrapper = new Wrapper();
  wrapper.render();
  const firstEl = wrapper.el.querySelector('.first');
  const secondEl = wrapper.el.querySelector('.second');
  wrapper.destroy();

  wrapper.el.dispatchEvent(new Event('click', { bubbles: true }));
  secondEl?.dispatchEvent(new Event('click', { bubbles: true }));
  firstEl?.dispatchEvent(new Event('click', { bubbles: true }));

  expect(callback1).not.toHaveBeenCalled();
  expect(callback2).not.toHaveBeenCalled();
});

it('파괴될 때 내가 등록한 이벤트 리스너를 전부 제거한다', () => {
  class Button extends UIObject<'button'> {
    constructor() {
      super('button');
    }
    get tagName() {
      return 'button';
    }
  }

  const buttonKing = new Button();
  const buttonA = new Button();
  const buttonB = new Button();
  const listener = jest.fn();
  const eventName = 'test';

  buttonKing.listenTo(buttonA, eventName, listener);
  buttonKing.listenTo(buttonB, eventName, listener);

  buttonA.emit(eventName);
  buttonB.emit(eventName);

  expect(listener).toHaveBeenCalledTimes(2);

  buttonKing.destroy();
  buttonA.emit(eventName);
  buttonB.emit(eventName);

  expect(listener).toHaveBeenCalledTimes(2);
});
