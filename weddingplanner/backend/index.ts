import express from 'express'
import cookieParser from 'cookie-parser'
import cors from 'cors'
import usersRoutes from './routes/users'
import authRoutes from './routes/auth'
import { errorHandler } from './middleware/errorHandler'

const app = express()
const PORT = 3070

// CORS configuration
const corsOptions = {
    origin: [
        'http://localhost:3050', // Alternative React port
    ],
    credentials: true, // Allow cookies and authorization headers
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
}

app.use(cors(corsOptions))
app.use(express.json())
app.use(cookieParser())

app.use('/api/auth', authRoutes) // auth routes
app.use('/api/users', usersRoutes) // users route


// app.use(/api/invitations', invitationRoites) // invitation rotues.

app.use(errorHandler)

app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`))