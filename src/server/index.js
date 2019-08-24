import Server from './server'

let server = new Server()

server
  .start()
  .then(value => {
    console.log(value)
  })
  .catch(error => {
    console.error(error)
    console.error('Failed to start the server')
  })
