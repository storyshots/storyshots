import React, { PropsWithChildren, useContext } from 'react';
import { IExternals } from './types';

const Context = React.createContext<IExternals | undefined>(undefined);

type Props = PropsWithChildren<{
  externals: IExternals;
}>;

export const ExternalsProvider: React.FC<Props> = ({ externals, children }) => (
  <Context.Provider value={externals}>{children}</Context.Provider>
);

export const useExternals = () => {
  const externals = useContext(Context);

  if (externals === undefined) {
    throw new Error('Externals must be provided');
  }

  return externals;
};
