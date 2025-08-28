import express from 'express'
import userRoutes from './routes/user'

const app = express()
const PORT = 3070

// user routes
app.use('/api/user', userRoutes)

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`)
})