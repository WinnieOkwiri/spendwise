export interface Category {
  id: number
  name: string
  color: string
  budget_limit: number
}

export interface Expense {
  id: number
  user_id: number
  category_id: number
  amount: number
  description: string
  date: string
  category_name: string
  category_color: string
}