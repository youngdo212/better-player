import Events from './Events';

it('처음 등록하는 이벤트에 대해서 이벤트 리스너가 올바르게 추가된다', () => {
  const eventName = 'test';
  const listener = () => {};
  const events = new Events();

  events.on(eventName, listener);

  expect(events.listeners[eventName]).toBeDefined();
  expect(events.listeners[eventName]).toContain(listener);
  expect(events.listeners[eventName].length).toBe(1);
});

it('이미 존재하는 이벤트에 새로운 이벤트 리스너를 등록한다', () => {
  const eventName = 'test';
  const listener1 = () => {};
  const listener2 = () => {};
  const events = new Events();

  events.on(eventName, listener1);
  events.on(eventName, listener2);

  expect(events.listeners[eventName]).toContain(listener1);
  expect(events.listeners[eventName]).toContain(listener2);
  expect(events.listeners[eventName].length).toBe(2);
});

it('존재하지 않는 이벤트의 이벤트 리스너를 제거하면 아무 일도 일어나지 않는다', () => {
  const eventName = 'test';
  const listener = () => {};
  const events = new Events();
  const prevListeners = { ...events.listeners };

  events.off(eventName, listener);

  expect(events.listeners).toEqual(prevListeners);
});

it('등록되어 있지 않은 이벤트 리스너를 제거하면 아무 일도 일어나지 않는다', () => {
  const eventName = 'test';
  const listener = () => {};
  const notAddedListener = () => {};
  const events = new Events();

  events.on(eventName, listener);
  events.off(eventName, notAddedListener);

  expect(events.listeners[eventName]).toContain(listener);
  expect(events.listeners[eventName].length).toBe(1);
});

it('이벤트 리스너가 성공적으로 제거된다', () => {
  const eventName = 'test';
  const listener1 = () => {};
  const listener2 = () => {};
  const events = new Events();

  events.on(eventName, listener1);
  events.on(eventName, listener2);
  events.off(eventName, listener1);

  expect(events.listeners[eventName]).not.toContain(listener1);
  expect(events.listeners[eventName]).toContain(listener2);
  expect(events.listeners[eventName].length).toBe(1);

  events.off(eventName, listener2);

  expect(events.listeners[eventName]).toBeUndefined();
});

it('한 이벤트에 등록된 모든 이벤트 리스너가 성공적으로 제거된다', () => {
  const eventName = 'test';
  const listener1 = () => {};
  const listener2 = () => {};
  const events = new Events();

  events.on(eventName, listener1);
  events.on(eventName, listener2);
  events.off(eventName);

  expect(events.listeners[eventName]).toBeUndefined();
});

it('모든 이벤트와 이벤트 리스너를 전부 성공적으로 제거한다', () => {
  const eventName1 = 'test1';
  const eventName2 = 'test2';
  const listener1 = () => {};
  const listener2 = () => {};
  const events = new Events();
  const initialListeners = { ...events.listeners };

  events.on(eventName1, listener1);
  events.on(eventName2, listener2);
  events.off();

  expect(events.listeners).toEqual(initialListeners);
});

it('등록되지 않은 이벤트를 발생시키면 이벤트 리스너가 호출되지 않는다', () => {
  const eventName = 'test';
  const wrongEventName = 'wrong';
  const listener = jest.fn();
  const events = new Events();

  events.on(eventName, listener);
  events.emit(wrongEventName);

  expect(listener).not.toHaveBeenCalled();
});

it('이벤트를 발생시켜 이벤트 리스너가 올바르게 호출된다', () => {
  const eventName = 'test';
  const listener = jest.fn();
  const events = new Events();

  events.on(eventName, listener);
  events.emit(eventName);

  expect(listener).toHaveBeenCalledTimes(1);
  expect(listener).toHaveBeenCalledWith();
});

it('이벤트를 발생시켜 이벤트 리스너가 인자와 함께 올바르게 호출된다', () => {
  const eventName = 'test';
  const listener = jest.fn();
  const args = [1, 2, 3];
  const events = new Events();

  events.on(eventName, listener);
  events.emit(eventName, ...args);

  expect(listener).toHaveBeenCalledTimes(1);
  expect(listener).toHaveBeenCalledWith(...args);
});

it('이벤트를 발생시켜 복수의 이벤트 리스너가 올바르게 호출된다', () => {
  const eventName = 'test';
  const listener1 = jest.fn();
  const listener2 = jest.fn();
  const events = new Events();

  events.on(eventName, listener1);
  events.on(eventName, listener2);
  events.emit(eventName);

  expect(listener1).toHaveBeenCalledTimes(1);
  expect(listener1).toHaveBeenCalledWith();
  expect(listener2).toHaveBeenCalledTimes(1);
  expect(listener2).toHaveBeenCalledWith();
});

it('이벤트 리스너가 한 번만 호출되도록 등록한다', () => {
  const eventName = 'test';
  const listener = jest.fn();
  const args = ['a', 'b', 'c'];
  const events = new Events();

  events.once(eventName, listener);
  events.emit(eventName, ...args);
  events.emit(eventName, ...args);

  expect(listener).toHaveBeenCalledTimes(1);
  expect(listener).toHaveBeenCalledWith(...args);
  expect(events.listeners[eventName]).toBeUndefined();
});

it('복수의 이벤트 리스너 사이에서 이벤트 리스너가 한 번만 호출되도록 등록한다', () => {
  const eventName = 'test';
  const listener1 = jest.fn();
  const listener2 = jest.fn();
  const listenerOnce = jest.fn();
  const args = ['a', 'b', 'c'];
  const events = new Events();
  const times = 3;

  events.on(eventName, listener1);
  events.on(eventName, listener2);
  events.once(eventName, listenerOnce);
  for (let i = 0; i < times; i++) {
    events.emit(eventName, ...args);
  }

  expect(listener1).toHaveBeenCalledTimes(times);
  expect(listener1).toHaveBeenCalledWith(...args);
  expect(listener2).toHaveBeenCalledTimes(times);
  expect(listener2).toHaveBeenCalledWith(...args);
  expect(listenerOnce).toHaveBeenCalledTimes(1);
  expect(listenerOnce).toHaveBeenCalledWith(...args);
  expect(events.listeners[eventName]).toContain(listener1);
  expect(events.listeners[eventName]).toContain(listener2);
  expect(events.listeners[eventName]).not.toContain(listenerOnce);
  expect(events.listeners[eventName].length).toBe(2);
});
