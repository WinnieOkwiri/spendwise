import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import expenseRoutes from './routes/expense'
import categoryRoutes from './routes/categories'

dotenv.config()

const app = express()
const PORT = process.env.PORT || 5000

app.use(cors())
app.use(express.json())

app.use('/api/expenses', expenseRoutes)
app.use('/api/categories', categoryRoutes)

app.get('/', (req, res) => {
  res.json({ message: 'SpendWise API is running' })
})

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`)
})