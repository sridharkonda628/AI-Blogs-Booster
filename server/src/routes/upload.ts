import express from 'express';
import multer from 'multer';
import path from 'path';
import { authMiddleware } from '@/middleware/auth';
import { asyncHandler } from '@/middleware/errorHandler';

const router = express.Router();

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const fileFilter = (req: any, file: any, cb: any) => {
  // Allow only images
  if (file.mimetype.startsWith('image/')) {
    cb(null, true);
  } else {
    cb(new Error('Only image files are allowed'), false);
  }
};

const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: parseInt(process.env.MAX_FILE_SIZE || '5242880') // 5MB default
  }
});

// @desc    Upload image
// @route   POST /api/upload/image
// @access  Private
router.post('/image', authMiddleware, upload.single('image'), asyncHandler(async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: 'No file uploaded' });
  }

  const fileUrl = `${req.protocol}://${req.get('host')}/uploads/${req.file.filename}`;

  res.json({
    success: true,
    data: {
      filename: req.file.filename,
      originalName: req.file.originalname,
      size: req.file.size,
      url: fileUrl
    }
  });
}));

// @desc    Upload multiple images
// @route   POST /api/upload/images
// @access  Private
router.post('/images', authMiddleware, upload.array('images', 5), asyncHandler(async (req, res) => {
  if (!req.files || (req.files as Express.Multer.File[]).length === 0) {
    return res.status(400).json({ error: 'No files uploaded' });
  }

  const files = (req.files as Express.Multer.File[]).map(file => ({
    filename: file.filename,
    originalName: file.originalname,
    size: file.size,
    url: `${req.protocol}://${req.get('host')}/uploads/${file.filename}`
  }));

  res.json({
    success: true,
    data: files
  });
}));

export default router;