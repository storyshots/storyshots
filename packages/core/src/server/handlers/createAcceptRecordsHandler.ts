import { Router } from 'express';
import { DeviceAndAcceptableRecords } from '../../reusables/types';
import { Baseline } from './reusables/baseline';

export function createAcceptRecordsHandler(router: Router, baseline: Baseline) {
  router.post('/api/record/accept', async (request, response) => {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    const { id, records, device }: DeviceAndAcceptableRecords = request.body;

    await baseline.acceptRecords(id, device, records);

    return response.end();
  });
}
