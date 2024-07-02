// 404 错误处理
const notFound = (req, res, next) => {
  const error = new Error('Not Found')
  error.status = 404

  next(error)
}

export default notFound
