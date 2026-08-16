import multer from 'multer'

const ALLOWED_TYPES = [
  'image/jpeg',
  'image/png',
  'image/webp',
  'image/gif',
  'application/pdf',
  'application/msword',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
]

function fileFilter(req, file, cb) {
  if (!ALLOWED_TYPES.includes(file.mimetype)) {
    return cb(new Error('File type not allowed. Upload an image, PDF, or Word document.'))
  }
  cb(null, true)
}

// Memory storage — the file buffer is streamed straight to Cloudinary and
// never touches this server's disk, which matters for deployment (most
// free hosting tiers have ephemeral/read-only filesystems anyway).
export const upload = multer({
  storage: multer.memoryStorage(),
  fileFilter,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB
})
