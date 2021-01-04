import loadSprite from './load-sprite';

beforeEach(() => {
  document.body.innerHTML = '';
});

it('body의 첫 번째 자식 엘리먼트로 svg sprite를 추가한다', () => {
  const body = document.body;
  body.innerHTML = `<div class="second"></div><div class="third"></div>`;

  loadSprite('better-player.svg');

  const spriteWrapperElement = body.firstElementChild as HTMLElement;
  const spriteElement = spriteWrapperElement.firstElementChild as SVGElement;

  expect(spriteWrapperElement.className).toBe(
    'better-player__svg-sprite-wrapper',
  );
  expect(spriteElement.tagName).toBe('svg');
});

it('두 번 이상 호출해도 svg sprite를 하나만 추가한다', () => {
  const body = document.body;
  body.innerHTML = `<div class="second"></div><div class="third"></div>`;

  loadSprite('better-player.svg');
  loadSprite('better-player.svg');
  loadSprite('better-player.svg');

  expect(
    body.querySelectorAll('.better-player__svg-sprite-wrapper').length,
  ).toBe(1);
});
