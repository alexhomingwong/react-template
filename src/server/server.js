const express = require('express')

export default class Server {
  constructor() {
    this.app = express()
    this.app.use(express.static('dist/public'))
  }
  start = () => {
    return new Promise((resolve, reject) => {
      try {
        const PORT = process.env.PORT || 3000
        this.server = this.app.listen(PORT, function() {
          resolve(`Server has started on port ${PORT}`)
        })
      } catch (error) {
        console.error(error)
        reject(error)
      }
    })
  }
  stop = () => {
    return new Promise((resolve, reject) => {
      try {
        this.server.close(() => {
          resolve()
        })
      } catch (error) {
        console.error(error.message)
        reject(error)
      }
    })
  }
}
