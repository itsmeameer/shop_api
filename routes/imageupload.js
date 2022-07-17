const express = require('express');
const router = express.Router();
const { authorizeAdmin } = require('../controllers/auth/authorize');
const fs = require('fs-extra');
var dir = './uploads/';
const path = require('path');
const Images = require('../models/images.model');
const cloudinary = require('cloudinary').v2;
const formidable = require('formidable');

cloudinary.config({ 
  cloud_name: 'dv6yradft', 
  api_key: '955241487948243', 
  api_secret: '8budTL-IDw7HUXUCwHWvpS2FaMY' 
});


router.post('/upload-image',  async  (req, res) => {

  try {

    // create upload folder if not exist
    if (!fs.existsSync(dir)){
      fs.mkdirSync(dir);
    }

    const form = new formidable.IncomingForm();
    form.parse(req, (err, fields, files) => {

      //check file
      if(!files.img){
        return res.status(400).send({
          message: 'Please upload an image'
        });
      }

      const fullUrl = `${req.protocol}://${req.get("host")}`;

      cloudinary.uploader.upload(files.img.filepath, async (error, result) => {
        console.log(result);
        await Images.create({
          url: result.url,
          size: result.bytes,
          type: result.format,
          public_id: result.public_id,
        });

        //send success response
        res.status(200).json({url: result.url});
      });
    });

  } catch (error) {
    console.log(error)
    res.status(500).json({message: "Something wrong",error});
  }

});

module.exports = router;