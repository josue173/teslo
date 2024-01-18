// ESTE ARCHIVO EVALUA EL ARCHIVO Y SI ES PERMITIDO REGRESA UN TRUE
export const fileFilter = (
  req: Express.Request,
  file: Express.Multer.File,
  cb: Function,
) => {
  console.log({ file });
  if (!file) return cb(new Error('File is empy'), false); // Verifica que venga un archivo
  const fileExtension = file.mimetype.split('/')[1]; // Mimetype nos dice que tipo de aplicación es
  const validExtension = ['jpg', 'jpeg', 'png', 'gif'];
  if (validExtension.includes(fileExtension)) {
    return cb(null, true);
  }
  cb(null, false);
  // Estas líneas aceptan o no un archivo 
};
