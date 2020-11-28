import Events from './Events';

it('처음 등록하는 이벤트에 대해서 이벤트 리스너가 올바르게 추가된다', () => {
  const eventName = 'test';
  const callback = () => {};
  const events = new Events();

  events.on(eventName, callback);

  expect(events.listeners[eventName]).toBeDefined();
  expect(
    events.listeners[eventName].map(listener => listener.callback)
  ).toContain(callback);
  expect(events.listeners[eventName].length).toBe(1);
});

it('이미 존재하는 이벤트에 새로운 이벤트 리스너를 등록한다', () => {
  const eventName = 'test';
  const callback1 = () => {};
  const callback2 = () => {};
  const events = new Events();

  events.on(eventName, callback1);
  events.on(eventName, callback2);

  expect(
    events.listeners[eventName].map(listener => listener.callback)
  ).toContain(callback1);
  expect(
    events.listeners[eventName].map(listener => listener.callback)
  ).toContain(callback2);
  expect(events.listeners[eventName].length).toBe(2);
});

it('존재하지 않는 이벤트의 이벤트 리스너를 제거하면 아무 일도 일어나지 않는다', () => {
  const eventName = 'test';
  const callback = () => {};
  const events = new Events();
  const prevListeners = { ...events.listeners };

  events.off(eventName, callback);

  expect(events.listeners).toEqual(prevListeners);
});

it('등록되어 있지 않은 이벤트 리스너를 제거하면 아무 일도 일어나지 않는다', () => {
  const eventName = 'test';
  const callback = () => {};
  const notAddedCallback = () => {};
  const events = new Events();

  events.on(eventName, callback);
  events.off(eventName, notAddedCallback);

  expect(
    events.listeners[eventName].map(listener => listener.callback)
  ).toContain(callback);
  expect(events.listeners[eventName].length).toBe(1);
});

it('이벤트 리스너가 성공적으로 제거된다', () => {
  const eventName = 'test';
  const callback1 = () => {};
  const callback2 = () => {};
  const events = new Events();

  events.on(eventName, callback1);
  events.on(eventName, callback2);
  events.off(eventName, callback1);

  let callbacks = events.listeners[eventName].map(
    listener => listener.callback
  );
  expect(callbacks).not.toContain(callback1);
  expect(callbacks).toContain(callback2);
  expect(callbacks.length).toBe(1);

  events.off(eventName, callback2);

  expect(events.listeners[eventName]).toBeUndefined();
});

it('한 이벤트에 등록된 모든 이벤트 리스너가 성공적으로 제거된다', () => {
  const eventName = 'test';
  const callback1 = () => {};
  const callback2 = () => {};
  const events = new Events();

  events.on(eventName, callback1);
  events.on(eventName, callback2);
  events.off(eventName);

  expect(events.listeners[eventName]).toBeUndefined();
});

it('모든 이벤트와 이벤트 리스너를 전부 성공적으로 제거한다', () => {
  const eventName1 = 'test1';
  const eventName2 = 'test2';
  const callback1 = () => {};
  const callback2 = () => {};
  const events = new Events();
  const initialListeners = { ...events.listeners };

  events.on(eventName1, callback1);
  events.on(eventName2, callback2);
  events.off();

  expect(events.listeners).toEqual(initialListeners);
});

it('등록되지 않은 이벤트를 발생시키면 이벤트 리스너가 호출되지 않는다', () => {
  const eventName = 'test';
  const wrongEventName = 'wrong';
  const callback = jest.fn();
  const events = new Events();

  events.on(eventName, callback);
  events.emit(wrongEventName);

  expect(callback).not.toHaveBeenCalled();
});

it('이벤트를 발생시켜 이벤트 리스너가 올바르게 호출된다', () => {
  const eventName = 'test';
  const callback = jest.fn();
  const events = new Events();

  events.on(eventName, callback);
  events.emit(eventName);

  expect(callback).toHaveBeenCalledTimes(1);
  expect(callback).toHaveBeenCalledWith();
});

it('이벤트를 발생시켜 이벤트 리스너가 인자와 함께 올바르게 호출된다', () => {
  const eventName = 'test';
  const callback = jest.fn();
  const args = [1, 2, 3];
  const events = new Events();

  events.on(eventName, callback);
  events.emit(eventName, ...args);

  expect(callback).toHaveBeenCalledTimes(1);
  expect(callback).toHaveBeenCalledWith(...args);
});

it('이벤트를 발생시켜 복수의 이벤트 리스너가 올바르게 호출된다', () => {
  const eventName = 'test';
  const callback1 = jest.fn();
  const callback2 = jest.fn();
  const events = new Events();

  events.on(eventName, callback1);
  events.on(eventName, callback2);
  events.emit(eventName);

  expect(callback1).toHaveBeenCalledTimes(1);
  expect(callback1).toHaveBeenCalledWith();
  expect(callback2).toHaveBeenCalledTimes(1);
  expect(callback2).toHaveBeenCalledWith();
});

it('이벤트 리스너가 한 번만 호출되도록 등록한다', () => {
  const eventName = 'test';
  const callback = jest.fn();
  const args = ['a', 'b', 'c'];
  const events = new Events();

  events.once(eventName, callback);
  events.emit(eventName, ...args);
  events.emit(eventName, ...args);

  expect(callback).toHaveBeenCalledTimes(1);
  expect(callback).toHaveBeenCalledWith(...args);
  expect(events.listeners[eventName]).toBeUndefined();
});

it('복수의 이벤트 리스너 사이에서 이벤트 리스너가 한 번만 호출되도록 등록한다', () => {
  const eventName = 'test';
  const callback1 = jest.fn();
  const callback2 = jest.fn();
  const listenerOnce = jest.fn();
  const args = ['a', 'b', 'c'];
  const events = new Events();
  const times = 3;

  events.on(eventName, callback1);
  events.on(eventName, callback2);
  events.once(eventName, listenerOnce);
  for (let i = 0; i < times; i++) {
    events.emit(eventName, ...args);
  }

  const callbacks = events.listeners[eventName].map(
    listener => listener.callback
  );
  expect(callback1).toHaveBeenCalledTimes(times);
  expect(callback1).toHaveBeenCalledWith(...args);
  expect(callback2).toHaveBeenCalledTimes(times);
  expect(callback2).toHaveBeenCalledWith(...args);
  expect(listenerOnce).toHaveBeenCalledTimes(1);
  expect(listenerOnce).toHaveBeenCalledWith(...args);
  expect(callbacks).toContain(callback1);
  expect(callbacks).toContain(callback2);
  expect(callbacks).not.toContain(listenerOnce);
  expect(callbacks.length).toBe(2);
});

it('컨텍스트를 설정해서 이벤트 리스너를 등록할 수 있다', () => {
  const events = new Events();
  const callback = function (age) {
    this.age = age;
  };
  const context = {};
  const age = 20;
  const eventName = 'test';

  events.on(eventName, callback, context);
  events.emit(eventName, age);

  expect(context.age).toBe(age);
});

it('컨텍스트를 설정한 이벤트 리스너를 삭제한다', () => {
  const events = new Events();
  const callback = jest.fn();
  const context = {};
  const eventName = 'test';

  events.on(eventName, callback, context);
  events.off(eventName, callback);

  expect(events.listeners[eventName]).toBeUndefined();
});

it('컨텍스트를 설정해서 한 번만 호출되는 이벤트 리스너를 등록할 수 있다', () => {
  const events = new Events();
  const callback = function (age) {
    this.age = age;
  };
  const context = {};
  const age = 20;
  const eventName = 'test';

  events.once(eventName, callback, context);
  events.emit(eventName, age);

  expect(context.age).toBe(age);
  expect(events.listeners[eventName]).toBeUndefined();
});
