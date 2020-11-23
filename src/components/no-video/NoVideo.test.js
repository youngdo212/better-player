import NoVideo from './NoVideo';

it('올바른 엘리먼트를 생성한다', () => {
  const noVideo = new NoVideo({
    i18n: {},
  });

  expect(noVideo.el.tagName).toBe('DIV');
  expect(noVideo.el.className).toBe('no-video');
});

it('하위 엘리먼트를 렌더링한다', () => {
  const noVideo = new NoVideo({
    i18n: {
      notSupportVideoFormat:
        'This video format is not supported in current browser',
    },
  });

  noVideo.render();
  expect(noVideo.el.firstElementChild.textContent).toBe(
    'This video format is not supported in current browser'
  );
});

it('canPlay 메소드는 항상 true를 반환한다', () => {
  const source = { src: 'test.mp4', mimeType: 'video/mp4' };

  expect(NoVideo.canPlay()).toBe(true);
  expect(NoVideo.canPlay(source)).toBe(true);
});
