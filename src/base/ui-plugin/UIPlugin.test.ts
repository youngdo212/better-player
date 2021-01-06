import Core from '../../components/core';
import config from '../../config/defaults';
import UIPlugin from './UIPlugin';

it('core를 이용해 인스턴스를 생성하고 속성으로 할당한다', () => {
  class TestUIPlugin extends UIPlugin {
    addEventListeners() {
      // do nothing.
    }
  }
  const core = new Core(config);
  const plugin = new TestUIPlugin(core);

  expect(plugin.core).toBe(core);
});

it('video를 속성으로 가진다', () => {
  class TestUIPlugin extends UIPlugin {
    addEventListeners() {
      // do nothing.
    }
  }
  const core = new Core(config);
  const plugin = new TestUIPlugin(core);

  expect(plugin.video).toBe(core.video);
});

it('인스턴스를 생성할 때 addEventListener 메소드를 호출한다', () => {
  const fn = jest.fn();
  class MyPlugin extends UIPlugin {
    addEventListeners() {
      fn();
    }
  }
  const core = new Core({
    ...config,
    source: '',
  });
  new MyPlugin(core);

  expect(fn).toHaveBeenCalled();
});

it('플러그인이 작동하지 않도록 한다', () => {
  const eventName = 'test';
  const callback = jest.fn();
  class MyPlugin extends UIPlugin {
    addEventListeners() {
      this.listenTo(this.video, eventName, callback);
    }
  }
  const core = new Core(config);
  const myPlugin = new MyPlugin(core);

  myPlugin.video.emit(eventName);

  expect(callback).toHaveBeenCalledTimes(1);

  myPlugin.disable();
  myPlugin.video.emit(eventName);

  expect(callback).toHaveBeenCalledTimes(1);
  expect(myPlugin.el.style.display).toBe('none');
});

it('플러그인을 다시 작동하도록 만든다', () => {
  const eventName = 'test';
  const callback = jest.fn();
  class MyPlugin extends UIPlugin {
    addEventListeners() {
      this.listenTo(this.video, eventName, callback);
    }
  }
  const core = new Core(config);
  const myPlugin = new MyPlugin(core);

  myPlugin.disable();
  myPlugin.video.emit(eventName);

  expect(callback).toHaveBeenCalledTimes(0);
  expect(myPlugin.el.style.display).toBe('none');

  myPlugin.enable();
  myPlugin.video.emit(eventName);

  expect(callback).toHaveBeenCalledTimes(1);
  expect(myPlugin.el.style.display).toBe('');
});

it('플러그인의 enable 메소드를 두 번 이상 호출해도 정상적으로 작동한다', () => {
  const eventName = 'test';
  const callback = jest.fn();
  class MyPlugin extends UIPlugin {
    addEventListeners() {
      this.listenTo(this.video, eventName, callback);
    }
  }
  const core = new Core(config);
  const myPlugin = new MyPlugin(core);

  myPlugin.disable();
  myPlugin.enable();
  myPlugin.enable();
  myPlugin.video.emit(eventName);

  expect(callback).toHaveBeenCalledTimes(1);
});
