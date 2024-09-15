import express from 'express'
import cors from 'cors'
import cookieParser from 'cookie-parser'


const app = express()

app.use(cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true 
}))


// Built-in express.js middleware functions
app.use(express.json({limit: '16kb'}))
app.use(express.urlencoded({extended: true, limit: '16kb'}))
app.use(express.static("public"))
app.use(cookieParser())



// routes
import userRouter from './routes/user.routes.js'



// routes declaration

// users will become a prefix
// http://localhost:8000/users/register
app.use('/api/v1/users', userRouter)



// export default app
export {app}