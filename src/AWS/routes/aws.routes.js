const { Router } = require('express')

const {
  awsControllerGenerate,
  generateSignedUrl,
  ListObjectBucket,
  UploadObjectBucket,
  uploadObjectToS3
} = require('../controller/aws.controller')

const awsRouters = Router()

awsRouters.get('/', awsControllerGenerate)
awsRouters.get('/generate-signed-url', generateSignedUrl)
awsRouters.post('/ListObject', ListObjectBucket)
awsRouters.post('/UploadObject', UploadObjectBucket)
awsRouters.post('/UploadObjectV2', uploadObjectToS3)


module.exports = awsRouters