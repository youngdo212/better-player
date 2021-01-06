import Events from './Events';

describe('on', () => {
  it('처음 등록하는 이벤트에 대해서 이벤트 리스너가 올바르게 추가된다', () => {
    class TestEvents extends Events {}
    const eventName = 'test';
    const callback = jest.fn();
    const events = new TestEvents();

    events.on(eventName, callback);
    events.emit(eventName);

    expect(callback).toHaveBeenCalledTimes(1);
  });

  it('이미 존재하는 이벤트에 새로운 이벤트 리스너를 등록한다', () => {
    class TestEvents extends Events {}
    const eventName = 'test';
    const callback1 = jest.fn();
    const callback2 = jest.fn();
    const events = new TestEvents();

    events.on(eventName, callback1);
    events.on(eventName, callback2);
    events.emit(eventName);

    expect(callback1).toHaveBeenCalledTimes(1);
    expect(callback2).toHaveBeenCalledTimes(1);
  });

  it('컨텍스트를 설정해서 이벤트 리스너를 등록할 수 있다', () => {
    class TestEvents extends Events {}
    class Context extends Events {
      constructor(public age: number) {
        super();
      }
    }

    const events = new TestEvents();
    const context = new Context(10);
    const callback = function (this: Context, age: number): void {
      this.age = age;
    };
    const age = 20;
    const eventName = 'test';

    events.on(eventName, callback, context);
    events.emit(eventName, age);

    expect(context.age).toBe(age);
  });
});

describe('once', () => {
  it('이벤트 리스너가 한 번만 호출되도록 등록한다', () => {
    class TestEvents extends Events {}

    const eventName = 'test';
    const callback = jest.fn();
    const args = ['a', 'b', 'c'];
    const events = new TestEvents();

    events.once(eventName, callback);
    events.emit(eventName, ...args);
    events.emit(eventName, ...args);

    expect(callback).toHaveBeenCalledTimes(1);
    expect(callback).toHaveBeenCalledWith(...args);
  });

  it('복수의 이벤트 리스너 사이에서 이벤트 리스너가 한 번만 호출되도록 등록한다', () => {
    class TestEvents extends Events {}

    const eventName = 'test';
    const callback1 = jest.fn();
    const callback2 = jest.fn();
    const listenerOnce = jest.fn();
    const args = ['a', 'b', 'c'];
    const events = new TestEvents();
    const times = 3;

    events.on(eventName, callback1);
    events.on(eventName, callback2);
    events.once(eventName, listenerOnce);
    for (let i = 0; i < times; i++) {
      events.emit(eventName, ...args);
    }

    expect(callback1).toHaveBeenCalledTimes(times);
    expect(callback1).toHaveBeenCalledWith(...args);
    expect(callback2).toHaveBeenCalledTimes(times);
    expect(callback2).toHaveBeenCalledWith(...args);
    expect(listenerOnce).toHaveBeenCalledTimes(1);
    expect(listenerOnce).toHaveBeenCalledWith(...args);
  });

  it('컨텍스트를 설정해서 한 번만 호출되는 이벤트 리스너를 등록할 수 있다', () => {
    class TestEvents extends Events {}
    class Context extends Events {
      constructor(public age: number) {
        super();
      }
    }

    const events = new TestEvents();
    const context = new Context(10);
    const callback = function (this: Context, age: number): void {
      this.age = age;
    };
    const age = 20;
    const eventName = 'test';

    events.once(eventName, callback, context);
    events.emit(eventName, age);
    events.emit(eventName, 30);

    expect(context.age).toBe(age);
  });
});

describe('off', () => {
  it('존재하지 않는 이벤트의 이벤트 리스너를 제거하면 에러를 발생하지 않는다', () => {
    class TestEvents extends Events {}
    const eventName = 'test';
    const callback = jest.fn();
    const events = new TestEvents();

    expect(() => {
      events.off(eventName, callback);
    }).not.toThrow();
  });

  it('등록되어 있지 않은 이벤트 리스너를 제거해도 에러를 발생시키지 않는다', () => {
    class TestEvents extends Events {}
    const eventName = 'test';
    const callback = jest.fn();
    const notAddedCallback = jest.fn();
    const events = new TestEvents();

    events.on(eventName, callback);

    expect(() => {
      events.off(eventName, notAddedCallback);
    }).not.toThrow();
  });

  it('등록되지 않은 context를 제거해도 에러를 발생시키지 않는다', () => {
    class TestEvents extends Events {}
    class ContextEvents extends Events {}

    const eventName = 'test';
    const callback = jest.fn();
    const events = new TestEvents();
    const context = new ContextEvents();
    const wrongContext = new ContextEvents();

    events.on(eventName, callback, context);
    expect(() => {
      events.off(eventName, callback, wrongContext);
    }).not.toThrow();
  });

  it('모든 이벤트와 이벤트 리스너를 전부 성공적으로 제거한다', () => {
    class TestEvents extends Events {}

    const events = new TestEvents();
    const eventName1 = 'test1';
    const eventName2 = 'test2';
    const callback1 = jest.fn();
    const callback2 = jest.fn();

    events.on(eventName1, callback1);
    events.on(eventName2, callback2, events);
    events.off();
    events.emit(eventName1);
    events.emit(eventName2);

    expect(callback1).toHaveBeenCalledTimes(0);
    expect(callback2).toHaveBeenCalledTimes(0);
  });

  it('한 이벤트에 대한 모든 이벤트 리스너를 제거한다', () => {
    class TestEvents extends Events {}

    const events = new TestEvents();
    const eventName1 = 'test1';
    const eventName2 = 'test2';
    const callback1 = jest.fn();
    const callback2 = jest.fn();
    const callback3 = jest.fn();
    const callback4 = jest.fn();

    events.on(eventName1, callback1);
    events.on(eventName1, callback2, events);
    events.on(eventName2, callback3);
    events.on(eventName2, callback4, events);
    events.off(eventName1);

    // 이벤트 발생
    events.emit(eventName1);
    events.emit(eventName2);

    expect(callback1).toHaveBeenCalledTimes(0);
    expect(callback2).toHaveBeenCalledTimes(0);
    expect(callback3).toHaveBeenCalledTimes(1);
    expect(callback4).toHaveBeenCalledTimes(1);
  });

  it('한 callback에 대한 모든 이벤트 리스너를 제거한다', () => {
    class TestEvents extends Events {}

    const events = new TestEvents();
    const eventName1 = 'test1';
    const eventName2 = 'test2';
    const callback1 = jest.fn();
    const callback2 = jest.fn();

    events.on(eventName1, callback1);
    events.on(eventName1, callback1, events);
    events.on(eventName1, callback2);
    events.on(eventName1, callback2, events);
    events.on(eventName2, callback1);
    events.on(eventName2, callback1, events);
    events.on(eventName2, callback2);
    events.on(eventName2, callback2, events);
    events.off(undefined, callback1);

    // 이벤트 발생
    events.emit(eventName1);
    events.emit(eventName2);

    expect(callback1).toHaveBeenCalledTimes(0);
    expect(callback2).toHaveBeenCalledTimes(4);
  });

  it('한 context에 대한 모든 이벤트 리스너를 제거한다', () => {
    class TestEvents extends Events {}
    class Context extends Events {}

    const events = new TestEvents();
    const eventName1 = 'test1';
    const eventName2 = 'test2';
    const callback1 = jest.fn();
    const callback2 = jest.fn();
    const callback3 = jest.fn();
    const context1 = new Context();
    const context2 = new Context();

    events.on(eventName1, callback1);
    events.on(eventName1, callback2, context1);
    events.on(eventName1, callback3, context2);
    events.on(eventName2, callback1);
    events.on(eventName2, callback2, context1);
    events.on(eventName2, callback3, context2);
    events.off(undefined, undefined, context1);

    // 이벤트 발생
    events.emit(eventName1);
    events.emit(eventName2);

    expect(callback1).toHaveBeenCalledTimes(2);
    expect(callback2).toHaveBeenCalledTimes(0);
    expect(callback3).toHaveBeenCalledTimes(2);
  });

  it('context에 상관없이 이벤트 리스너를 제거한다', () => {
    class TestEvents extends Events {}
    class Context extends Events {}

    const events = new TestEvents();
    const eventName1 = 'test1';
    const eventName2 = 'test2';
    const callback1 = jest.fn();
    const callback2 = jest.fn();
    const context = new Context();

    events.on(eventName1, callback1);
    events.on(eventName1, callback1, context);
    events.on(eventName1, callback2);
    events.on(eventName1, callback2, context);
    events.on(eventName2, callback1);
    events.on(eventName2, callback1, context);
    events.on(eventName2, callback2);
    events.on(eventName2, callback2, context);
    events.off(eventName1, callback1);

    // 이벤트 발생
    events.emit(eventName1);
    events.emit(eventName2);

    expect(callback1).toHaveBeenCalledTimes(2);
    expect(callback2).toHaveBeenCalledTimes(4);
  });

  it('callback에 상관없이 이벤트 리스너를 제거한다', () => {
    class TestEvents extends Events {}
    class Context extends Events {}

    const events = new TestEvents();
    const eventName1 = 'test1';
    const eventName2 = 'test2';
    const callback1 = jest.fn();
    const callback2 = jest.fn();
    const context1 = new Context();
    const context2 = new Context();

    events.on(eventName1, callback1);
    events.on(eventName1, callback1, context1);
    events.on(eventName1, callback1, context2);
    events.on(eventName1, callback2);
    events.on(eventName1, callback2, context1);
    events.on(eventName1, callback2, context2);
    events.on(eventName2, callback1);
    events.on(eventName2, callback1, context1);
    events.on(eventName2, callback1, context2);
    events.on(eventName2, callback2);
    events.on(eventName2, callback2, context1);
    events.on(eventName2, callback2, context2);
    events.off(eventName1, undefined, context1);

    // 이벤트 발생
    events.emit(eventName1);
    events.emit(eventName2);

    expect(callback1).toHaveBeenCalledTimes(5);
    expect(callback2).toHaveBeenCalledTimes(5);
  });

  it('eventName에 상관없이 이벤트 리스너를 제거한다', () => {
    class TestEvents extends Events {}
    class Context extends Events {}

    const events = new TestEvents();
    const eventName1 = 'test1';
    const eventName2 = 'test2';
    const callback1 = jest.fn();
    const callback2 = jest.fn();
    const context1 = new Context();
    const context2 = new Context();

    events.on(eventName1, callback1);
    events.on(eventName1, callback1, context1);
    events.on(eventName1, callback1, context2);
    events.on(eventName1, callback2);
    events.on(eventName1, callback2, context1);
    events.on(eventName1, callback2, context2);
    events.on(eventName2, callback1);
    events.on(eventName2, callback1, context1);
    events.on(eventName2, callback1, context2);
    events.on(eventName2, callback2);
    events.on(eventName2, callback2, context1);
    events.on(eventName2, callback2, context2);
    events.off(undefined, callback1, context1);

    // 이벤트 발생
    events.emit(eventName1);
    events.emit(eventName2);

    expect(callback1).toHaveBeenCalledTimes(4);
    expect(callback2).toHaveBeenCalledTimes(6);
  });

  it('이벤트 이름과 context를 모두 지정한 이벤트 리스너가 성공적으로 제거된다', () => {
    class TestEvents extends Events {}
    class Context extends Events {}

    const events = new TestEvents();
    const eventName1 = 'test1';
    const eventName2 = 'test2';
    const callback1 = jest.fn();
    const callback2 = jest.fn();
    const context1 = new Context();
    const context2 = new Context();

    events.on(eventName1, callback1);
    events.on(eventName1, callback1, context1);
    events.on(eventName1, callback1, context2);
    events.on(eventName1, callback2);
    events.on(eventName1, callback2, context1);
    events.on(eventName1, callback2, context2);
    events.on(eventName2, callback1);
    events.on(eventName2, callback1, context1);
    events.on(eventName2, callback1, context2);
    events.on(eventName2, callback2);
    events.on(eventName2, callback2, context1);
    events.on(eventName2, callback2, context2);
    events.off(eventName1, callback1, context1);

    // 이벤트 발생
    events.emit(eventName1);
    events.emit(eventName2);

    expect(callback1).toHaveBeenCalledTimes(5);
    expect(callback2).toHaveBeenCalledTimes(6);
  });
});

describe('emit', () => {
  it('등록되지 않은 이벤트를 발생시키면 이벤트 리스너가 호출되지 않는다', () => {
    class TestEvents extends Events {}

    const eventName = 'test';
    const wrongEventName = 'wrong';
    const callback = jest.fn();
    const events = new TestEvents();

    events.on(eventName, callback);
    events.emit(wrongEventName);

    expect(callback).not.toHaveBeenCalled();
  });

  it('이벤트를 발생시켜 이벤트 리스너가 올바르게 호출된다', () => {
    class TestEvents extends Events {}

    const eventName = 'test';
    const callback = jest.fn();
    const events = new TestEvents();

    events.on(eventName, callback);
    events.emit(eventName);

    expect(callback).toHaveBeenCalledTimes(1);
    expect(callback).toHaveBeenCalledWith();
  });

  it('이벤트를 발생시켜 이벤트 리스너가 인자와 함께 올바르게 호출된다', () => {
    class TestEvents extends Events {}

    const eventName = 'test';
    const callback = jest.fn();
    const args = [1, 2, 3];
    const events = new TestEvents();

    events.on(eventName, callback);
    events.emit(eventName, ...args);

    expect(callback).toHaveBeenCalledTimes(1);
    expect(callback).toHaveBeenCalledWith(...args);
  });

  it('이벤트를 발생시켜 복수의 이벤트 리스너가 올바르게 호출된다', () => {
    class TestEvents extends Events {}

    const eventName = 'test';
    const callback1 = jest.fn();
    const callback2 = jest.fn();
    const events = new TestEvents();

    events.on(eventName, callback1);
    events.on(eventName, callback2);
    events.emit(eventName);

    expect(callback1).toHaveBeenCalledTimes(1);
    expect(callback1).toHaveBeenCalledWith();
    expect(callback2).toHaveBeenCalledTimes(1);
    expect(callback2).toHaveBeenCalledWith();
  });
});

describe('listenTo', () => {
  it('listenTo를 이용해 이벤트 리스너를 등록한다', () => {
    class TestEvents extends Events {}

    const observer = new TestEvents();
    const subject = new TestEvents();
    const eventName = 'test';
    const callback = jest.fn();

    observer.listenTo(subject, eventName, callback);

    subject.emit(eventName);

    expect(callback).toHaveBeenCalledTimes(1);
  });

  it('동일한 events에 두 개 이상의 이벤트 리스너를 listenTo를 이용해 등록한다', () => {
    class TestEvents extends Events {}

    const observer = new TestEvents();
    const subject = new TestEvents();
    const eventName = 'test';
    const callback1 = jest.fn();
    const callback2 = jest.fn();

    observer.listenTo(subject, eventName, callback1);
    observer.listenTo(subject, eventName, callback2);

    subject.emit(eventName);

    expect(callback1).toHaveBeenCalledTimes(1);
    expect(callback2).toHaveBeenCalledTimes(1);
  });
});

describe('stopListening', () => {
  it('정해진 대상에 등록한 이벤트 리스너를 제거한다', () => {
    class TestEvents extends Events {}

    const observer = new TestEvents();
    const subject1 = new TestEvents();
    const subject2 = new TestEvents();
    const eventName1 = 'test1';
    const eventName2 = 'test2';
    const callback1 = jest.fn();
    const callback2 = jest.fn();

    observer.listenTo(subject1, eventName1, callback1);
    observer.listenTo(subject2, eventName2, callback2);

    observer.stopListening(subject1);
    subject1.emit(eventName1);
    subject2.emit(eventName2);

    expect(callback1).toHaveBeenCalledTimes(0);
    expect(callback2).toHaveBeenCalledTimes(1);
  });

  it('자신이 등록한 이벤트 리스너를 모두 제거한다', () => {
    class TestEvents extends Events {}

    const observer = new TestEvents();
    const subject1 = new TestEvents();
    const subject2 = new TestEvents();
    const eventName1 = 'test1';
    const eventName2 = 'test2';
    const callback1 = jest.fn();
    const callback2 = jest.fn();

    observer.stopListening();
    subject1.emit(eventName1);
    subject2.emit(eventName2);

    expect(callback1).toHaveBeenCalledTimes(0);
    expect(callback2).toHaveBeenCalledTimes(0);
  });
});
