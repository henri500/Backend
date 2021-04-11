exports.saveMedia = (req, res) => {
    const multer = require('multer'); 
    const storage = multer.diskStorage({
        destination: (req, file, callback) => {
            callback(null, (config.const.path.base + config.const.path.productReviewMedia));
        },
        filename: (req, file, callback) => {
            callback(null, Date.now() + '-' + file.originalname);
        }
    });

    const upload = multer({storage: storage}).any('file');

    upload(req, res, (err) => {
        if (err) {
            return res.status(400).send({
                message: helper.getErrorMessage(err)
            });
        }
        let results = req.files.map((file) => {
            return {
                mediaName: file.filename,
                origMediaName: file.originalname,
                mediaSource: 'http://' + req.headers.host + config.const.path.productReviewMedia + file.filename
            }
        });
        res.status(200).json(results);
    });
}