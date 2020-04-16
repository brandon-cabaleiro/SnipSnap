/*
* ===========================================
* Image Upload Service
* ===========================================
* ===========================================
* service provider: Cloudinary Image Storage API
* email: snipsnapgroup@gmail.com
* pw: snipthatsnap
* pw2: @Snipthatsnap123
*/

const cloudinary = require('cloudinary').v2

// setup cloudinary
cloudinary.config({
  cloud_name: 'doffbnnc2',
  api_key: '214387138582562',
  api_secret: 'wIWL3Mm3UocuSeEQPcO2H2EcDJo'
})


// Image Upload Function
let uploadImage = async (image_data) => {

  return new Promise((resolve, reject) => {

    // transform the image_data to base64
    let base64_encoded = image_data.toString('base64')
    // console.log (base64_encoded.substring(100))
    console.log(typeof base64_encoded)
    console.log(base64_encoded.substring(0, 10))
    resolve('fake')

    /*
    return cloudinary.uploader.upload(base64_encoded)
    .then(res => {

      // console.log (res)

      resolve ({
        result: res
      })

    })
    .catch(err => {

      console.log(err)
      reject (err)
    })

    */
  });


}


module.exports = {
  upload: uploadImage
}
