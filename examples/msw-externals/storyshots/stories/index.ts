import { finder } from '@storyshots/core';
import { body, native } from '@storyshots/msw-externals';
import { HttpResponse } from 'msw';
import {
  AddPetApiArg,
  FindPetsByStatusApiResponse,
} from '../../src/externals/pets-api';
import { it } from '../preview/config';
import { arrange, handle, record, transform } from './arrangers';
import { setup } from './setup';

export const stories = [
  it('renders empty list of pets', {
    arrange: arrange(setup(), withNoPets()),
  }),
  it('renders several pets', {
    arrange: arrange(setup(), withFewPets()),
  }),
  it('is able to add new pet', {
    arrange: arrange(setup(), withNoPets(), withAddingPetsEmulated()),
    act: (actor) =>
      actor.click(finder.getByRole('button', { name: 'Add a pet' })),
  }),
  it('handles internal server error', {
    arrange: arrange(
      setup(),
      handle('findPetsByStatus', () =>
        native(new HttpResponse(null, { status: 500 })),
      ),
    ),
  }),
  it('handles adding error', {
    arrange: arrange(
      setup(),
      withNoPets(),
      handle('addPet', () => native(new HttpResponse(null, { status: 406 }))),
      record('addPet'),
    ),
    act: (actor) =>
      actor
        .click(finder.getByRole('button', { name: 'Add a pet' }))
        .screenshot('Error')
        .click(finder.getByRole('button', { name: 'OK' })),
  }),
];

function withAddingPetsEmulated() {
  const pets: FindPetsByStatusApiResponse = [];

  return arrange(
    transform('findPetsByStatus', (response) => [...response, ...pets]),
    handle('addPet', async (arg) => {
      const added: AddPetApiArg = await body(arg);

      pets.push(added);
    }),
  );
}

function withNoPets() {
  return handle('findPetsByStatus', () => []);
}

function withFewPets() {
  return handle('findPetsByStatus', () => [
    { name: 'Izi', tags: [{ name: 'smart' }], photoUrls: [] },
    { name: 'Izya', tags: [{ name: 'cutie' }], photoUrls: [] },
  ]);
}
