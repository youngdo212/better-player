import Player from './Player';

it('비디오 플레이어를 올바르게 렌더링한다', () => {
  const parent = document.createElement('div');
  new Player({ parent });

  expect(parent.children.length).toBe(1);
});
