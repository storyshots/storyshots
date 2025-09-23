export type Either<TLeft, TRight> =
  | {
      type: 'left';
      data: TLeft;
    }
  | {
      type: 'right';
      data: TRight;
    };

export const Either = {
  left<T>(data: T): Either<T, never> {
    return { type: 'left', data };
  },
  right<T>(data: T): Either<never, T> {
    return { type: 'right', data };
  },
  when<TLeft, TRight, T>(
    either: Either<TLeft, TRight>,
    handlers: { onLeft(left: TLeft): T; onRight(right: TRight): T },
  ): T {
    if (either.type === 'left') {
      return handlers.onLeft(either.data);
    }

    return handlers.onRight(either.data);
  },
};
