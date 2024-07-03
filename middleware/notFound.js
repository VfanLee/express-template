import { createError } from '../utils/error.js'

// 404 错误处理
const notFound = (req, res, next) => {
  next(createError('Not found', 404))
}

export default notFound
