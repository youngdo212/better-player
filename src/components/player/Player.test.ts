import Events from '../../base/events';
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

describe('이벤트 리스너 관련', () => {
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

  it('비디오 볼륨 변경 이벤트 리스너를 호출한다', () => {
    HTMLMediaElement.prototype.canPlayType = () => 'maybe';

    const player = new Player();
    const callback = jest.fn();

    player.on('volumechange', callback);
    player.core.video.el.dispatchEvent(new Event('volumechange'));

    expect(callback).toHaveBeenCalledTimes(1);
  });

  it('비디오 현재 시간 변경 이벤트 리스너를 호출한다', () => {
    HTMLMediaElement.prototype.canPlayType = () => 'maybe';

    const player = new Player();
    const callback = jest.fn();

    player.on('timeupdate', callback);
    player.core.video.el.dispatchEvent(new Event('timeupdate'));

    expect(callback).toHaveBeenCalledTimes(1);
  });

  it('비디오 끝 이벤트 리스너를 호출한다', () => {
    HTMLMediaElement.prototype.canPlayType = () => 'maybe';

    const player = new Player();
    const callback = jest.fn();

    player.on('ended', callback);
    player.core.video.el.dispatchEvent(new Event('ended'));

    expect(callback).toHaveBeenCalledTimes(1);
  });

  it('비디오 탐색 시작 리스너를 호출한다', () => {
    HTMLMediaElement.prototype.canPlayType = () => 'maybe';

    const player = new Player();
    const callback = jest.fn();

    player.on('seeking', callback);
    player.core.video.el.dispatchEvent(new Event('seeking'));

    expect(callback).toHaveBeenCalledTimes(1);
  });

  it('비디오 탐색 완료 리스너를 호출한다', () => {
    HTMLMediaElement.prototype.canPlayType = () => 'maybe';

    const player = new Player();
    const callback = jest.fn();

    player.on('seeked', callback);
    player.core.video.el.dispatchEvent(new Event('seeked'));

    expect(callback).toHaveBeenCalledTimes(1);
  });

  it('전체 화면 시작 이벤트를 호출한다', () => {
    const player = new Player();
    player.core.isFullscreen = () => true;
    const callback = jest.fn();

    player.on('requestfullscreen', callback);
    player.core.emit(Events.CORE_FULLSCREENCHANGE);

    expect(callback).toHaveBeenCalledTimes(1);
  });

  it('전체 화면 종료 이벤트를 호출한다', () => {
    const player = new Player();
    player.core.isFullscreen = () => false;
    const callback = jest.fn();

    player.on('exitfullscreen', callback);
    player.core.emit(Events.CORE_FULLSCREENCHANGE);

    expect(callback).toHaveBeenCalledTimes(1);
  });
});

it('비디오 플레이어의 isPaused() 메소드는 기본으로 true다', () => {
  const player = new Player();

  expect(player.isPaused()).toBe(true);
});

it('비디오 플레이어를 DOM에서 제거한다', () => {
  HTMLMediaElement.prototype.load = () => {
    // do nothing
  };

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
  HTMLMediaElement.prototype.load = () => {
    // do nothing
  };

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

it('getCurrentTime의 기본 반환값은 0이다', () => {
  HTMLMediaElement.prototype.canPlayType = mimeType =>
    mimeType === 'video/mp4' ? 'maybe' : '';
  const HTMLVideoPlayer = new Player({
    source: 'http://localhost/test.mp4',
  });
  const NoVideoPlayer = new Player();

  expect(HTMLVideoPlayer.getCurrentTime()).toBe(0);
  expect(NoVideoPlayer.getCurrentTime()).toBe(0);
});

it('비디오가 메타 데이터를 로드하기 전에 getDuration을 호출하면 NaN을 반환한다', () => {
  HTMLMediaElement.prototype.canPlayType = mimeType =>
    mimeType === 'video/mp4' ? 'maybe' : '';
  const HTMLVideoPlayer = new Player({
    source: 'http://localhost/test.mp4',
  });
  const NoVideoPlayer = new Player();

  expect(HTMLVideoPlayer.getDuration()).toBe(NaN);
  expect(NoVideoPlayer.getDuration()).toBe(NaN);
});

it('getVolume의 기본 반환값은 1이다', () => {
  HTMLMediaElement.prototype.canPlayType = mimeType =>
    mimeType === 'video/mp4' ? 'maybe' : '';
  const HTMLVideoPlayer = new Player({
    source: 'http://localhost/test.mp4',
  });
  const NoVideoPlayer = new Player();

  expect(HTMLVideoPlayer.getVolume()).toBe(1);
  expect(NoVideoPlayer.getVolume()).toBe(1);
});

it('isMuted의 기본 반환값은 false이다', () => {
  HTMLMediaElement.prototype.canPlayType = mimeType =>
    mimeType === 'video/mp4' ? 'maybe' : '';
  const HTMLVideoPlayer = new Player({
    source: 'http://localhost/test.mp4',
  });
  const NoVideoPlayer = new Player();

  expect(HTMLVideoPlayer.isMuted()).toBe(false);
  expect(NoVideoPlayer.isMuted()).toBe(false);
});

it('isFullscreen의 기본 반환값은 false이다', () => {
  HTMLMediaElement.prototype.canPlayType = mimeType =>
    mimeType === 'video/mp4' ? 'maybe' : '';
  const HTMLVideoPlayer = new Player({
    source: 'http://localhost/test.mp4',
  });
  const NoVideoPlayer = new Player();

  expect(HTMLVideoPlayer.isFullscreen()).toBe(false);
  expect(NoVideoPlayer.isFullscreen()).toBe(false);
});

it('seek 메소드로 비디오를 탐색할 수 있다', () => {
  HTMLMediaElement.prototype.canPlayType = mimeType =>
    mimeType === 'video/mp4' ? 'maybe' : '';
  const HTMLVideoPlayer = new Player({
    source: 'http://localhost/test.mp4',
  });
  const NoVideoPlayer = new Player();

  HTMLVideoPlayer.seek(1);
  NoVideoPlayer.seek(2);

  expect(HTMLVideoPlayer.getCurrentTime()).toBe(1);
  expect(NoVideoPlayer.getCurrentTime()).toBe(0); // noVideoPlayer는 탐색 작업이 불가능하다
});

it('setVolume 메소드로 볼륨을 조절할 수 있다', () => {
  HTMLMediaElement.prototype.canPlayType = mimeType =>
    mimeType === 'video/mp4' ? 'maybe' : '';
  const HTMLVideoPlayer = new Player({
    source: 'http://localhost/test.mp4',
  });
  const NoVideoPlayer = new Player();

  HTMLVideoPlayer.setVolume(0.1);
  NoVideoPlayer.setVolume(0.2);

  expect(HTMLVideoPlayer.getVolume()).toBe(0.1);
  expect(NoVideoPlayer.getVolume()).toBe(1); // noVideoPlayer는 볼륨 조절이 되지 않는다
});

it('mute 메소드로 음소거할 수 있다', () => {
  HTMLMediaElement.prototype.canPlayType = mimeType =>
    mimeType === 'video/mp4' ? 'maybe' : '';
  const HTMLVideoPlayer = new Player({
    source: 'http://localhost/test.mp4',
  });
  const NoVideoPlayer = new Player();

  HTMLVideoPlayer.setVolume(0.1);
  NoVideoPlayer.setVolume(0.2);
  HTMLVideoPlayer.mute();
  NoVideoPlayer.mute();

  expect(HTMLVideoPlayer.getVolume()).toBe(0);
  expect(NoVideoPlayer.getVolume()).toBe(1); // noVideoPlayer는 볼륨 조절이 되지 않는다
});

it('unmute 메소드로 음소거를 해제한다', () => {
  HTMLMediaElement.prototype.canPlayType = mimeType =>
    mimeType === 'video/mp4' ? 'maybe' : '';
  const HTMLVideoPlayer = new Player({
    source: 'http://localhost/test.mp4',
  });
  const NoVideoPlayer = new Player();

  HTMLVideoPlayer.setVolume(0.1);
  NoVideoPlayer.setVolume(0.2);
  HTMLVideoPlayer.mute();
  NoVideoPlayer.mute();
  HTMLVideoPlayer.unmute();
  NoVideoPlayer.unmute();

  expect(HTMLVideoPlayer.getVolume()).toBe(0.1);
  expect(NoVideoPlayer.getVolume()).toBe(1); // noVideoPlayer는 볼륨 조절이 되지 않는다
});

it('전체화면으로 전환한다', () => {
  const player = new Player();
  const core = player.core;
  jest.spyOn(core, 'requestFullscreen').mockImplementation(() => {
    // do nothing
  });

  player.requestFullscreen();

  expect(core.requestFullscreen).toHaveBeenCalled();
});

it('전체화면을 해제한다', () => {
  const player = new Player();
  const core = player.core;
  jest.spyOn(core, 'exitFullscreen').mockImplementation(() => {
    // do nothing
  });

  player.exitFullscreen();

  expect(core.exitFullscreen).toHaveBeenCalled();
});
