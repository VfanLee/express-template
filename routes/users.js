import { Router } from 'express'
import { isEmail, isNull, isObject } from '../utils/valid.js'
import { createError } from '../utils/error.js'
import { users } from '../data/index.js'
import { v4 as uuidv4 } from 'uuid'

const router = Router()

// read
router.get('/', (req, res, next) => {
  const query = req.query
  console.log('query:', query)

  let { pn, ps, kw = '' } = query

  pn = parseInt(pn)
  ps = parseInt(ps)
  if (isNaN(pn) || pn <= 0) {
    pn = 1
  }
  if (isNaN(ps) || ps <= 0) {
    ps = 10
  }

  let filteredUsers = users.filter(u => u.email.toLowerCase().includes(kw.toLowerCase()))
  let total = filteredUsers.length

  const totalPages = Math.ceil(filteredUsers.length / ps)

  if (pn > totalPages) {
    pn = totalPages
  }

  const startIndex = (pn - 1) * ps
  const endIndex = startIndex + ps

  const list = filteredUsers.slice(startIndex, endIndex)

  const data = {
    pn, // 当前页
    ps, // 页大小
    total, // 总数
    totalPages, // 总页数
    list, // 当前页数据
  }

  res.status(200).json(data)
})

// read single
router.get('/:id', (req, res, next) => {
  const params = req.params
  console.log('params:', params)

  const user = users.find(p => p.id === params.id)

  if (!isObject(user)) {
    return next(createError("user doesn't exist", 404))
  }

  res.status(200).json(user)
})

// create
router.post('/', (req, res, next) => {
  const body = req.body
  console.log('body:', body)

  const { email, name, avatar = 'https://picsum.photos/64/64' } = body

  if (isNull(email) || isNull(name)) {
    return next(createError('email or name cannot be empty'))
  }

  if (!isEmail(email)) {
    return next(createError('email vaild fail'))
  }

  if (users.find(u => u.email === email)) {
    return next(createError('email already exists'))
  }

  const user = {
    id: uuidv4(),
    email,
    name,
    avatar,
  }
  users.push(user)

  res.status(201).send(user)
})

// update
router.put('/:id', (req, res, next) => {
  const params = req.params
  const body = req.body
  console.log('params:', params)
  console.log('body:', body)

  const { email, name, avatar } = body

  if (isNull(email) || isNull(name)) {
    return next(createError('email or name cannot be empty'))
  }

  if (!isEmail(email)) {
    return next(createError('email vaild fail'))
  }

  const index = users.findIndex(p => p.id === params.id)

  if (index === -1) {
    return next(createError("user doesn't exist"), 404)
  }

  if (users.some((user, idx) => idx !== index && user.email === email)) {
    return next(createError('email already exists'))
  }

  users[index] = {
    ...users[index],
    email: email !== undefined ? email : users[index].email,
    name: name !== undefined ? name : users[index].name,
    avatar: avatar !== undefined ? avatar : users[index].avatar,
  }
  res.status(204).send()
})

// delete
router.delete('/:id', (req, res, next) => {
  const params = req.params
  console.log('params:', params)

  const index = users.findIndex(p => p.id === params.id)

  if (index === -1) {
    return next(createError("user doesn't exist"), 404)
  }

  users.splice(index, 1)
  res.status(204).send()
})

export default router
