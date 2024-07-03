import { join } from 'node:path'

import { Router } from 'express'
import multer from 'multer'
import { isEmail, isNull } from '../utils/valid.js'
import { createError } from '../utils/error.js'

import { users } from '../data/index.js'

const router = Router()

// https://github.com/expressjs/multer#usage
const storage = multer.diskStorage({
  destination(req, file, cb) {
    console.log('file:', file)
    cb(null, join(import.meta.dirname, '../uploads'))
  },
  filename(req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9)
    cb(null, uniqueSuffix + '.' + file.originalname)
  },
})

const upload = multer({
  storage,
  limits: {
    fileSize: 10 * 1024 * 1024, // 10M
  },
})

// hello api
router.get('/', (req, res, next) => {
  res.send('Hello Express API!')
})

// login
router.post('/login', (req, res, next) => {
  const body = req.body

  const { email, password } = body

  if (isNull(email) || isNull(password)) {
    return next(createError('email or password cannot be empty'))
  }

  if (!isEmail(email)) {
    return next(createError('email vaild fail'))
  }

  const exists = users.some(u => u.email === email)
  if (!exists) {
    return next(createError("user doesn't exist", 404))
  }

  const data = {
    token: Math.random().toString(16).slice(2),
  }
  res.status(200).json(data)
})

// single 字段名需要与 input:file name 一致
router.post('/upload', upload.single('file'), (req, res, next) => {
  res.status(200).json({ msg: 'success' })
})

export default router
