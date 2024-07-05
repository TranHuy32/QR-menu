import multer from "multer"
import random_name from 'node-random-name';


const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, "./uploads")
    },
    filename: function (req, file, cb) {
      const uniqueSuffix = random_name(Math.random() * 1E9);
      cb(null,uniqueSuffix +''+ file.originalname);
  }
  })
  const upload = multer({ storage: storage })
  export default upload