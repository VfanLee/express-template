import fs from 'node:fs'
import path from 'node:path'
// http://mockjs.com/examples.html
import Mock from 'mockjs'

const users = []
for (let i = 0; i < 12; i++) {
  users.push(
    Mock.mock({
      id: Mock.mock('@guid'),
      email: Mock.mock('@email'),
      name: Mock.mock('@name'),
      avatar: 'https://picsum.photos/64/64',
    })
  )
}
console.log('users data:', users)

fs.writeFileSync(path.join(import.meta.dirname, 'users.json'), JSON.stringify(users, null, 2), {
  encoding: 'utf8',
})
