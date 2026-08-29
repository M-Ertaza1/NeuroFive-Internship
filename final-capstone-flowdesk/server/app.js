import express from 'express'
import cors from 'cors'
import authRouter from './routes/auth.js'
import projectsRouter from './routes/projects.js'
import tasksRouter from './routes/tasks.js'
import dashboardRouter from './routes/dashboard.js'

// Exported separately so tests can import the app directly with supertest,
// without binding a real port.
export function createApp() {
  const app = express()
  app.use(cors())
  app.use(express.json())

  app.use('/api/auth', authRouter)
  app.use('/api/projects', projectsRouter)
  app.use('/api/projects/:projectId/tasks', tasksRouter)
  app.use('/api/dashboard', dashboardRouter)

  app.get('/', (req, res) => res.json({ status: 'Flowdesk API is running.' }))

  return app
}
