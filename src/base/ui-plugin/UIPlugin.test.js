import Core from '../../components/core';
import config from '../../config/defaults';
import UIPlugin from './UIPlugin';

it('core를 이용해 인스턴스를 생성하고 속성으로 할당한다', () => {
  const core = new Core(config);
  const plugin = new UIPlugin(core);

  expect(plugin.core).toBe(core);
});

it('video를 속성으로 가진다', () => {
  const core = new Core(config);
  const plugin = new UIPlugin(core);

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
    source: { src: '' },
  });
  const myPlugin = new MyPlugin(core); // eslint-disable-line no-unused-vars

  expect(fn).toHaveBeenCalled();
});
