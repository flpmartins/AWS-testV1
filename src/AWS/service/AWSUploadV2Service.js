const AWS = require('aws-sdk')

class S3Service {
  constructor() {
    this.s3 = new AWS.S3()
  }
  async getPresignedUrl(fileName, fileType) {
    const S3BucketName = 'flpmartins'
    const params = {
      Bucket: S3BucketName,
      Key: fileName,
      Expires: 60 * 60,
      ContentType: fileType,
    };

    return new Promise((resolve, reject) => {
      this.s3.getSignedUrl('putObject', params, (err, data) => {
        if (err) {
          reject(err)
        } else {
          resolve(data)
        }
      })
    })
  }
  async uploadObjectToS3(key, bucket, uploadFile, contentType) {
    await this.s3.putObject({
      Body: uploadFile,
      Bucket: bucket,
      Key: key,
      ContentType: contentType,
    }).promise()
  }
}

module.exports = S3Service;
