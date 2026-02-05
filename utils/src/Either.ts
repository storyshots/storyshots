export const Either = {
  right<TRight>(value: TRight): Either<never, TRight> {
    return { type: 'right', value };
  },
  left<TLeft>(value: TLeft): Either<TLeft, never> {
    return { type: 'left', value };
  },
  map<TLeft, TRight, TMapped>(
    either: Either<TLeft, TRight>,
    transform: (value: TRight) => TMapped
  ): Either<TLeft, TMapped> {
    if (Either.isLeft(either)) {
      return either;
    }

    return Either.right(transform(either.value));
  },
  isLeft<TLeft>(
    either: Either<TLeft, unknown>,
  ): either is Either<TLeft, never> {
    return either.type === 'left';
  },
  isRight<TRight>(
    either: Either<unknown, TRight>,
  ): either is Either<never, TRight> {
    return either.type === 'right';
  },
};

export type Either<TLeft, TRight> =
  | { type: 'left'; value: TLeft }
  | { type: 'right'; value: TRight };
