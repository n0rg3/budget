// src/types.ts
export interface Category {
//   id: number;
  name: string;
  icon: string;
//   purchases: Purchase[];
}

export interface Purchase {
  id: number;
  name: string;
  category: string;
  amount: number;
  date: string;
}
