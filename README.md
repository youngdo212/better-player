# BetterPlayer.js
확장 가능한 웹 비디오 플레이어

## Table of Contents
* [Quick Start](#Quick-Start)
* [API Documents](#API)

## Quick Start

### HTML

다음과 같이 body 태그에 엘리먼트를 준비합니다.

```javascript
<body>
  <div id="player"></div>
</body>
```

### CSS

기본 스타일을 적용하기 위해서 패키지의 `/dist/main.css` 파일을 다음과 같이 head 태그에 추가합니다.

```html
<head>
	<link rel="stylesheet" href="path/to/main.css" />
</head>
```

또는, CDN을 이용해서 다음과 같이 스타일을 추가할 수 있습니다.

```html
<head>
	<link rel="stylesheet" href="https://unpkg.com/@mando212/better-player/dist/main.css">
</head>
```

### Javascript

이제 모듈을 불러와 비디오 플레이어를 생성하세요.

```javascript
import BetterPlayer from '@mando212/better-player';

const player = new BetterPlayer.Player({
	source: "http://your.video/here.mp4",
	parentId: "player"
});
```

또는, CDN을 이용할 수도 있습니다. 이 경우 `BetterPlayer` 변수를 전역 환경에서 사용할 수 있습니다.

```html
<script src="https://unpkg.com/@mando212/better-player"></script>
```

### 환경 설정

비디오 플레이어 인스턴스를 생성할 때 `BetterPlayer.Player`에 객체를 인자로 사용할 수 있습니다. 이 객체를 옵션 객체라고 부릅니다.

```jsx
const options = {
	source: 'http://path.to/video.mp4',
	parentId: 'player'
};

const player = new BetterPlayer.Player(options);
```

옵션 객체는 다음과 같은 속성을 가집니다.

**parent: HTMLElement**

비디오 플레이어가 생성될 DOM 엘리먼트를 설정합니다.

**parentId: string**

비디오 플레이어가 생성될 DOM 엘리먼트의 id 속성을 설정합니다.

**source: string**

비디오 소스의 URL을 설정합니다.

## API

### Methods

**isPaused(): boolean**

재생 여부를 반환합니다.

```javascript
const isPaused = player.isPaused();
```

**play(): void**

영상을 재생합니다.

```javascript
player.play();
```

**pause(): void**

영상을 일시 정지합니다.

```javascript
player.pause();
```

**on(event, handler): void**

비디오 플레이어에 이벤트 핸들러를 등록합니다.

- event: string - 이벤트 이름
- handler: function - 이벤트 핸들러

```jsx
player.on('play', () => {
	// do something ...
});
```

**off(event, handler): void**

비디오 플레이어에 등록한 이벤트 핸들러를 삭제합니다.

- event: string - 이벤트 이름
- handler: function - 삭제할 이벤트 핸들러

```jsx
player.off('play', addedHandler);
```

**once(event, handler): void**

비디오 플레이어에 한 번만 실행할 이벤트 핸들러를 등록합니다.

- event: string - 이벤트 이름
- handler: function - 이벤트 핸들러

```jsx
player.once('play', () => {
	// do something ...
});
```

**destroy(): void**

인스턴스를 파괴하고 등록된 이벤트 핸들러를 전부 제거합니다. 또한 생성된 엘리먼트들도 전부 제거합니다. parent 엘리먼트는 남아있습니다.

```jsx
player.destroy();
```

### Events

비디오 플레이어는 다양한 이벤트를 발생합니다. 이벤트 핸들러를 등록하고 싶다면 다음과 같이 작성할 수 있습니다.

```jsx
player.on('play', (event) => {
	handlePlay(event);
});
```

이벤트 목록은 아래와 같습니다.

- pause: 일시 정지 됐을 때 발생
- play: 재생 됐을 때 발생