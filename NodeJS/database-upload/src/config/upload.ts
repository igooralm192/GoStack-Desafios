import path from 'path';
import multer from 'multer';

const tmpFolder = path.resolve(__dirname, '..', '..', 'tmp');

export default {
  temporaryFolder: tmpFolder,
  storage: multer.diskStorage({
    destination: tmpFolder,
    filename(request, file, callback) {
      const fileName = 'temporary-file.csv';

      return callback(null, fileName);
    },
  }),
};
