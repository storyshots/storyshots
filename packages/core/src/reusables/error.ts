export type WithPossibleError<T> =
  | ErrorStruct
  | {
      type: 'success';
      data: T;
    };

export type ErrorStruct = {
  type: 'error';
  message: string;
};
