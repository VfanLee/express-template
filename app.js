import { fileURLToPath, URL } from 'node:url'

import express from 'express'
import morgan from 'morgan'
import cors from 'cors'
import cookieParser from 'cookie-parser'
import serveIndex from 'serve-index'

import errorHandler from './middleware/errorHandler.js'
import notFound from './middleware/notFound.js'

import indexRoute from './routes/index.js'
import userRoute from './routes/users.js'

const app = express()

// 日志
app.use(morgan('dev'))

// 处理 CORS 跨域和 Request Body
app.use(cors())
app.use(express.json())
app.use(express.urlencoded({ extended: false }))
app.use(cookieParser())

// 静态文件服务器
const publicDir = fileURLToPath(new URL('./public', import.meta.url))
app.use('/', express.static(publicDir))

// 文件目录索引
const uploadsDir = fileURLToPath(new URL('./uploads', import.meta.url))
app.use('/uploads', express.static(uploadsDir), serveIndex(uploadsDir, { icons: true }))

// 路由
app.use('/api', indexRoute)
app.use('/api/users', userRoute)

// 错误处理
app.use(notFound)
app.use(errorHandler)

export default app
