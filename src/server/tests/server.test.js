import Server from '../server'

describe('Server class', () => {
  let server
  beforeAll(() => {
    server = new Server()
  })

  test('should successfully start the server', () => {
    // need to specify return otherwise test will complete before Promise finishes
    return expect(server.start()).resolves.toEqual(
      'Server has started on port 3000'
    )
  })

  test('should exit the server', () => {
    // need to specify return otherwise test will complete before Promise finishes
    return expect(server.stop()).resolves.toEqual('Server has stopped')
  })
})
