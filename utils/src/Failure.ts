export type Failure<TKind extends string, TBody> = {
  kind: TKind;
  body: TBody;
};
