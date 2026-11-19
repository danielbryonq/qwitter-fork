jest.setTimeout(5000)

// PageHome logs every Firestore change with console.log; keep test output readable.
beforeEach(() => {
  jest.spyOn(console, 'log').mockImplementation(() => {})
})

afterEach(() => {
  console.log.mockRestore()
})
