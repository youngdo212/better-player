import Player from './Player';

beforeEach(() => {
  document.body.innerHTML = '';
});

it('비디오 플레이어를 parent 엘리먼트에 생성한다', () => {
  const parent = document.createElement('div');
  new Player({
    parent,
    source: 'test.mp4',
  });

  expect(parent.children.length).toBe(1);
});

it('parentId를 이용해 엘리먼트를 찾고 거기에 비디오 엘리먼트를 생성한다', () => {
  const body = document.body;
  const parent = document.createElement('div');
  parent.id = 'parent';
  body.appendChild(parent);
  new Player({
    parentId: 'parent',
    source: 'test.mp4',
  });

  expect(parent.children.length).toBe(1);
});

it('parentId와 parent 속성이 둘 다 주어질 경우 parentId를 우선한다', () => {
  const body = document.body;
  const mother = document.createElement('div');
  const father = document.createElement('div');
  mother.id = 'mother';
  body.appendChild(mother);
  new Player({
    parent: father,
    parentId: 'mother',
    source: 'test.mp4',
  });

  expect(father.children.length).toBe(0);
  expect(mother.children.length).toBe(1);
});

it('parent나 parentId 속성이 없으면 DOM에 엘리먼트를 추가하지 않는다', () => {
  const body = document.body;
  new Player({
    source: 'test.mp4',
  });

  expect(body.querySelector('.better-player')).toBe(null);
});

it('비디오 재생 이벤트 리스너를 호출한다', () => {
  HTMLMediaElement.prototype.canPlayType = () => 'maybe';

  const player = new Player();
  const callback = jest.fn();

  player.on('play', callback);
  player.core.video.el.dispatchEvent(new Event('play'));

  expect(callback).toHaveBeenCalledTimes(1);
});

it('비디오 일시 정시 이벤트 리스너를 호출한다', () => {
  HTMLMediaElement.prototype.canPlayType = () => 'maybe';

  const player = new Player();
  const callback = jest.fn();

  player.on('pause', callback);
  player.core.video.el.dispatchEvent(new Event('pause'));

  expect(callback).toHaveBeenCalledTimes(1);
});

it('비디오 플레이어의 isPaused() 메소드는 기본으로 true다', () => {
  const player = new Player();

  expect(player.isPaused()).toBe(true);
});

it('비디오 플레이어를 DOM에서 제거한다', () => {
  HTMLMediaElement.prototype.load = () => {};

  const body = document.body;
  const parent = document.createElement('div');
  parent.id = 'parent';
  body.appendChild(parent);
  const player = new Player({
    parentId: 'parent',
    source: 'test.mp4',
  });

  expect(parent.children.length).toBe(1);

  player.destroy();

  expect(parent.children.length).toBe(0);
});

it('비디오 플레이어에 등록된 커스텀 이벤트 리스너가 삭제된다', () => {
  HTMLMediaElement.prototype.canPlayType = () => 'maybe';
  HTMLMediaElement.prototype.load = () => {};

  const player = new Player();
  const callback = jest.fn();

  player.on('play', callback);
  player.core.video.el.dispatchEvent(new Event('play'));

  expect(callback).toHaveBeenCalledTimes(1);

  player.destroy();
  player.core.video.el.dispatchEvent(new Event('play'));
  player.core.video.el.dispatchEvent(new Event('play'));

  expect(callback).toHaveBeenCalledTimes(1);
});

it('source 옵션에 아무것도 입력하지 않는다', () => {
  HTMLMediaElement.prototype.canPlayType = mimeType => {
    if (mimeType === 'video/mp4') return 'maybe';
    return '';
  };

  const player = new Player();

  expect(player.core.video.el.className).toBe('better-player__no-video');
});

it('source 옵션에 문자열을 입력한다', () => {
  HTMLMediaElement.prototype.canPlayType = mimeType => {
    if (mimeType === 'video/mp4') return 'maybe';
    return '';
  };

  const player = new Player({
    source: 'http://localhost/test.mp4',
  });

  expect(player.core.video.el.src).toBe('http://localhost/test.mp4');
});
