import { Endpoint } from '@storyshots/msw-externals';
import { arrange, endpoint } from './arrangers';

import {
  AddPetApiResponse,
  FindPetsByStatusApiResponse,
} from '../../src/externals/pets-api';

export function setup() {
  return arrange(
    endpoint('findPetsByStatus', {
      url: '/api/pet/findByStatus',
    }),
    endpoint('addPet', {
      url: '/api/pet',
      method: 'POST',
    }),
  );
}

declare module '@storyshots/msw-externals' {
  interface Endpoints {
    findPetsByStatus: Endpoint<FindPetsByStatusApiResponse>;
    addPet: Endpoint<AddPetApiResponse>;
  }
}
