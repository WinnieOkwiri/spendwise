import { Router, Request, Response } from "express";
import pool from "../db/databases";

const router = Router();

// Get all expenses
router.get("/", async (req: Request, res: Response) => {
  try {
    const [rows] = await pool.query(
      `SELECT e.id, e.user_id, e.category_id, e.amount, e.description,
   DATE_FORMAT(e.date, '%Y-%m-%d') as date,
   c.name as category_name, c.color as category_color
   FROM expenses e
   LEFT JOIN categories c ON e.category_id = c.id
   ORDER BY e.date DESC`,
    );
    res.json(rows);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch expenses" });
  }
});

// Add a new expense
router.post("/", async (req: Request, res: Response) => {
  const { user_id, category_id, amount, description, date } = req.body;
  try {
    const [result] = await pool.query(
      `INSERT INTO expenses (user_id, category_id, amount, description, date)
       VALUES (?, ?, ?, ?, ?)`,
      [user_id, category_id, amount, description, date],
    );
    res.status(201).json({ message: "Expense added", result });
  } catch (error) {
    res.status(500).json({ error: "Failed to add expense" });
  }
});

// Delete an expense
router.delete("/:id", async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    await pool.query("DELETE FROM expenses WHERE id = ?", [id]);
    res.json({ message: "Expense deleted" });
  } catch (error) {
    res.status(500).json({ error: "Failed to delete expense" });
  }
});

// Get all categories
router.get("/categories", async (req: Request, res: Response) => {
  try {
    const [rows] = await pool.query("SELECT * FROM categories");
    res.json(rows);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch categories" });
  }
});

export default router;
