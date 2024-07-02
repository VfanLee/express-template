// 统一错误处理
const errorHandler = (err, req, res, next) => {
  if (err.status) {
    res.status(err.status).json({ msg: err.message || 'Error' })
  } else {
    res.status(500).json({ msg: err.message || 'Error' })
  }
}

export default errorHandler
