import { Router, Request, Response } from 'express'
import pool from '../db/databases'

const router = Router()

router.get('/', async (req: Request, res: Response) => {
  try {
    const [rows] = await pool.query('SELECT * FROM categories')
    res.json(rows)
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch categories' })
  }
})

export default router