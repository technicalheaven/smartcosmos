import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { logger } from '../logger';
import { config } from '../../config';


const xlsxFilter = (req:any, file:any, cb:any) => {
  const mimeType = "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet";
  if (file.mimetype.includes(mimeType)) {
    cb(null, true);
  } else {
    return cb(new Error('Please provide only XLSX file'));
  }
};

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const filePath:any = config.UPLOAD_FILE_PATH || './src/libs/fileUploader/uploads/';
    const dir = path.resolve(filePath);
    if (!fs.existsSync(dir)){
        fs.mkdirSync(dir);
    }
    logger.info('upload directory: ',dir);
    cb(null, dir);
  },
  filename: (req, file, cb) => {
    logger.info('filename: ',file.originalname);
    cb(null, file.fieldname + "-" + Date.now() + "-" + file.originalname)
  },
});

const fileSize:any = config.UPLOAD_FILE_SIZE || 1024*1024*10;
const uploadXLSX = multer({ 
    storage: storage, 
    limits: {
      fileSize // 1MB - 1024 KB, 1KB - 1024 bytes
    },
    fileFilter: xlsxFilter 
});



export const upload = multer({
    dest: path.join(__dirname, '../../../uploads'),
    fileFilter: (req, file, cb) => {
        if (file.mimetype == "image/png" || file.mimetype == "image/jpg" || file.mimetype == "image/jpeg")
            cb(null, true);
        else
            cb(null, false);
    }
})

export {uploadXLSX};
