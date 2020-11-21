import Core from './Core';

it('부모 엘리먼트가 주어지지 않을 경우 DOM에 추가되지 않는다', () => {
  const body = document.body;
  const core = new Core({});

  core.render();

  expect(body.children.length).toBe(0);
});

it('엘리먼트를 DOM에 추가한다', () => {
  const body = document.body;
  const core = new Core({
    parentElement: body,
  });

  core.render();

  expect(body.children.length).toBe(1);
});
