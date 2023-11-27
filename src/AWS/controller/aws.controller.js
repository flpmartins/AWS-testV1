require('dotenv').config
const AWS = require('aws-sdk')

const AWSListObjectService = require('../service/AWSListObjectService')
const AWSUploadService = require('../service/AWSUploadObjectService')
const AWSUploadV2Service = require('../service/AWSUploadV2Service')

const s3Service = new AWSUploadV2Service()

module.exports = {
  async awsControllerGenerate(request, response) {
    try {
      const s3 = new AWS.S3()
      await s3.putObject({
        Body: 'hello world',
        Bucket: 'flpmartins',
        Key: 'teste.txt',
      }).promise()

      return response.json({ message: true })
    } catch (error) {
      return response.status(500).json({ error: 'Erro interno do servidor' })
    }
  },

  async generateSignedUrl(request, response) {
    try {
      const s3 = new AWS.S3()
      const params = {
        Bucket: 'flpmartins',
        Key: 'my-file.txt',
        Expires: 60,
      }

      const signedUrl = await s3.getSignedUrlPromise('putObject', params)
      return response.json({ signedUrl })
    } catch (error) {
      return response.status(500).json({ error: 'Erro interno do servidor' })
    }
  },

  async ListObjectBucket(request, response) {
    try {
      const { key, bucket } = request.query

      if (!key || !bucket) {
        return response.status(400).json({ error: 'Parâmetros key e bucket são necessários.' })
      }

      const signedUrl = await AWSListObjectService.generateSignedUrl(key, bucket)

      return response.json({ signedUrl })
    } catch (error) {
      return response.status(500).json({ error: 'Erro interno do servidor' })
    }
  },

  async UploadObjectBucket(request, response) {
    try {
      const { key, bucket } = request.query
      const { file } = request.body

      if (!file) {
        return response.status(400).json({ error: 'Nenhum arquivo enviado' })
      }

      const uploadResponse = await AWSUploadService.uploadFile(file, key, bucket)

      return response.json({ uploadResponse })
    } catch (error) {
      return response.status(500).json({ error: 'Erro interno do servidor' })
    }
  },

  async uploadObjectToS3(request, response) {
    try {
      const { key, bucket } = request.query
      const { uploadFile } = request.body

      if (uploadFile) {
        return response.status(400).json({ error: 'Nenhum arquivo ou texto enviado' })
      }

      const contentType = 'application/json'

      const data = uploadFile

      const presignedUrl = await s3Service.getPresignedUrl(key, contentType)

      await s3Service.uploadObjectToS3(
        key,
        bucket,
        data,
        contentType
      )

      return response.json({ message: 'Upload concluído com sucesso', presignedUrl })
    } catch (error) {
      return response.status(500).json({ error: 'Erro interno do servidor' })
    }
  },
}



