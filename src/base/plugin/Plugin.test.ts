import Core from '../../components/core';
import Plugin from './Plugin';
import config from '../../config/defaults';

it('core속성을 가진다', () => {
  class TestPlugin extends Plugin {
    protected addEventListeners() {
      // do nothing.
    }
  }

  const core = new Core(config);
  const plugin = new TestPlugin(core);

  expect(plugin.core).toBe(core);
});

it('video속성을 가진다', () => {
  class TestPlugin extends Plugin {
    protected addEventListeners() {
      // do nothing.
    }
  }

  const core = new Core(config);
  const plugin = new TestPlugin(core);

  expect(plugin.video).toBe(core.video);
});

it('enabled 속성을 가지며 기본 값은 true이다', () => {
  class TestPlugin extends Plugin {
    protected addEventListeners() {
      // do nothing.
    }
  }

  const core = new Core(config);
  const plugin = new TestPlugin(core);

  expect(plugin.enabled).toBe(true);
});

it('인스턴스를 생성하면 이벤트 리스너를 추가한다', () => {
  class MyPlugin extends Plugin {
    protected addEventListeners() {
      this.listenTo(this.core, eventName, this.handleEvent);
    }
    handleEvent() {
      callback();
    }
  }
  const eventName = 'test';
  const callback = jest.fn();
  const core = new Core(config);
  new MyPlugin(core); // eslint-disable-line no-unused-vars

  core.emit(eventName);

  expect(callback).toHaveBeenCalledTimes(1);
});

it('disable을 통해 플러그인을 사용하지 못하게 만든다', () => {
  class MyPlugin extends Plugin {
    protected addEventListeners() {
      this.listenTo(this.core, eventName, this.handleEvent);
    }
    handleEvent() {
      callback();
    }
  }
  const eventName = 'test';
  const callback = jest.fn();
  const core = new Core(config);
  const myPlugin = new MyPlugin(core);

  myPlugin.disable();
  core.emit(eventName);

  expect(callback).toHaveBeenCalledTimes(0);
});

it('enable을 통해 플러그인을 다시 사용가능하게 만든다', () => {
  class MyPlugin extends Plugin {
    protected addEventListeners() {
      this.listenTo(this.core, eventName, this.handleEvent);
    }
    handleEvent() {
      callback();
    }
  }
  const eventName = 'test';
  const callback = jest.fn();
  const core = new Core(config);
  const myPlugin = new MyPlugin(core);

  myPlugin.disable();
  core.emit(eventName);

  expect(callback).toHaveBeenCalledTimes(0);

  myPlugin.enable();
  core.emit(eventName);

  expect(callback).toHaveBeenCalledTimes(1);
});

it('플러그인을 파괴한다', () => {
  class MyPlugin extends Plugin {
    protected addEventListeners() {
      this.listenTo(this.core, eventName1, this.handleEvent);
    }
    handleEvent() {
      callback1();
    }
  }
  const eventName1 = 'test1';
  const eventName2 = 'test2';
  const callback1 = jest.fn();
  const callback2 = jest.fn();
  const core = new Core(config);
  const myPlugin = new MyPlugin(core);

  myPlugin.on(eventName2, callback2);
  myPlugin.emit(eventName2);
  core.emit(eventName1);

  expect(callback1).toHaveBeenCalledTimes(1);
  expect(callback2).toHaveBeenCalledTimes(1);

  myPlugin.destroy();
  myPlugin.emit(eventName2);
  core.emit(eventName1);

  expect(callback1).toHaveBeenCalledTimes(1);
  expect(callback2).toHaveBeenCalledTimes(1);
});
