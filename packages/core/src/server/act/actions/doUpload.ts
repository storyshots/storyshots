import { UploadFileAction } from '@core';
import path from 'path';
import { Frame } from 'playwright';
import { doClick } from './doClick';

export async function doUploadFile(preview: Frame, upload: UploadFileAction) {
  const waitingForChooser = preview.page().waitForEvent('filechooser');

  await doClick(preview, {
    action: 'click',
    payload: {
      on: upload.payload.chooser,
      options: upload.payload.options?.upload,
    },
  });

  const chooser = await waitingForChooser;

  await chooser.setFiles(
    upload.payload.paths.map((it) => path.join(process.cwd(), it)),
    upload.payload.options?.chooser,
  );
}
