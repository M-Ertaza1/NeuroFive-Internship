import { Router } from 'express'
import streamifier from 'streamifier'
import cloudinary from '../cloudinary.js'
import { upload } from '../upload.js'
import UploadRecord from '../models/Upload.js'

const router = Router()

function streamUpload(buffer, resourceType) {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      { resource_type: resourceType, folder: 'doc-uploader' },
      (error, result) => {
        if (error) return reject(error)
        resolve(result)
      }
    )
    streamifier.createReadStream(buffer).pipe(stream)
  })
}

// POST /api/uploads
router.post('/', (req, res) => {
  upload.single('file')(req, res, async (uploadErr) => {
    if (uploadErr) {
      return res.status(400).json({ message: uploadErr.message })
    }
    if (!req.file) {
      return res.status(400).json({ message: 'No file was provided.' })
    }

    try {
      const isImage = req.file.mimetype.startsWith('image/')
      const resourceType = isImage ? 'image' : 'raw'

      const result = await streamUpload(req.file.buffer, resourceType)

      const record = await UploadRecord.create({
        originalName: req.file.originalname,
        url: result.secure_url,
        publicId: result.public_id,
        resourceType,
        format: result.format,
        bytes: result.bytes,
      })

      res.status(201).json(record)
    } catch (err) {
       console.error('UPLOAD ERROR:', err)
      res.status(500).json({ message: 'Upload failed. Please try again.' })
    }
  })
})

// GET /api/uploads — list previously uploaded files
router.get('/', async (req, res) => {
  try {
    const uploads = await UploadRecord.find().sort({ createdAt: -1 })
    res.json(uploads)
  } catch (err) {
     console.error('UPLOAD ERROR:', err)
    res.status(500).json({ message: 'Failed to fetch uploads.' })
  }
})

export default router
