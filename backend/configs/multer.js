import multer from 'multer';

 export const upload = multer({
  storage: multer.diskStorage({})
 }); // Change 'image' to the field name you are using in your form