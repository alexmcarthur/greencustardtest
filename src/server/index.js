const createApp = require('./app')

const app = createApp({})

const port = process.env.PORT || 8080
app.listen(port, () => {
  console.info(`listening on http://localhost:${port}`)
})
