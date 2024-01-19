import {v4 as uuid} from 'uuid'

export const fileNamer = (
  req: Express.Request,
  file: Express.Multer.File,
  cb: Function,
) => {
  console.log({ file });
  if (!file) return cb(new Error('File is empy'), false); // Verifica que venga un archivo
  const flieExtension = file.mimetype.split('/')[1];
  const fileName = `${uuid()}.${flieExtension}`;
  cb(null, fileName);
};