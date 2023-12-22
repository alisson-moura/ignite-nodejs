import { type Either, right, left } from './either';

function doSomething (x: boolean = false): Either<string, number> {
  if (x) {
    return right(0);
  }
  return left('failure');
}

describe('Either test', () => {
  test('success result', () => {
    const result = doSomething(true);

    if (result.isRight()) {
      expect(result.value);
    }
  });

  test('failure result', () => {
    const result = doSomething(false);

    expect(result.isLeft()).toBe(true);
    expect(result.value).toBeTypeOf('string');
  });
});
