import express from 'express'

const app = express()
const PORT = 3070

app.get('/', (req, res) => {
  res.send('Hello World')
})

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`)
})