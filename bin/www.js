import http from 'node:http'

import dotenv from 'dotenv'

import app from '../app.js'

dotenv.config({ debug: false })

const PORT = process.env.PORT || 3000

const server = http.createServer(app)

server.listen(PORT, () => {
  console.log(`current environment: ${process.env.ENV}`)
  console.log(`Express server is running at: http://localhost:${PORT}`)
})
