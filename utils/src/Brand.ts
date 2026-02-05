export type Brand<TType, TProperty extends string> = TType & {
  [Key in `__${TProperty}`]: TProperty;
};
