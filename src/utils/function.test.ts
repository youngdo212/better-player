import { defer } from './function';

describe('defer', () => {
  it('비동기로 함수가 호출된다', done => {
    const deferedCallback = jest.fn();

    defer(() => {
      deferedCallback();
      try {
        expect(deferedCallback).toHaveBeenCalledTimes(1);
        done();
      } catch (error) {
        done(error);
      }
    });

    expect(deferedCallback).toHaveBeenCalledTimes(0);
  });
});
