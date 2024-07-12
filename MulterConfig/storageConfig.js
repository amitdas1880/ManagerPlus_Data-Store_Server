const multer = require('multer');

const storage = multer.diskStorage({
    destination : (req, file, callback) => {
        callback(null, './uploads');
    },
    filename : (req, file, callback) => {
        const ImageName = `image-${Date.now()}.${file.originalname}`;
        callback(null, ImageName);
    }
})

// filter

const fileFilter = (req, file, callback) => {
    if(file.mimetype === 'image/jpeg' || file.mimetype === 'image/png' || file.mimetype === 'image/gif' || file.mimetype === 'image/jpg'){
        callback(null, true);
    }else{
        callback(null, false);
        return callback(new Error('Only .png .jpeg .gif and jpg image files are allowed!'));
    }
}

const upload = multer({
    storage : storage,
    fileFilter : fileFilter
});

module.exports = upload;