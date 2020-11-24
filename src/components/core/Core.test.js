import Core from './Core';
import config from '../../config/defaults';

beforeEach(() => {
  document.body.innerHTML = '';
});

it('부모 엘리먼트가 주어지지 않을 경우 DOM에 추가되지 않는다', () => {
  const body = document.body;
  const core = new Core({
    ...config,
    source: { src: 'test.mp4' },
  });

  core.render();

  expect(body.children.length).toBe(0);
});

it('엘리먼트를 DOM에 추가한다', () => {
  const body = document.body;
  const core = new Core({
    ...config,
    parentElement: body,
    source: { src: 'test.mp4' },
  });

  core.render();

  expect(body.children.length).toBe(1);
});

it('하위 엘리먼트를 렌더링한다', () => {
  const core = new Core({
    ...config,
    source: { src: 'test.mp4' },
  });

  core.render();

  expect(core.el.children.length).toBe(1);
});
