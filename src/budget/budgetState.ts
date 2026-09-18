export interface ExpenseItem {
  id: string;
  name: string;
  cost: number;
  category:
    | "Produce"
    | "Protein"
    | "Dairy"
    | "Grains"
    | "Canned / Pantry"
    | "Snacks";
}

export const SAMPLE_EXPENSES: ExpenseItem[] = [
  { id: "e1", name: "Rolled Oats (Big Container)", cost: 3.8, category: "Grains" },
  { id: "e2", name: "Large Eggs (1 Dozen)", cost: 2.5, category: "Protein" },
  { id: "e3", name: "Store Brand Peanut Butter (28 oz)", cost: 2.8, category: "Protein" },
  { id: "e4", name: "Canned Diced Tomatoes (3 cans)", cost: 2.25, category: "Canned / Pantry" },
  { id: "e5", name: "Black Beans & Pinto Beans (4 cans)", cost: 3.2, category: "Canned / Pantry" },
  { id: "e6", name: "White Rice (3 lb bag)", cost: 2.3, category: "Grains" },
  { id: "e7", name: "Frozen Peas & Corn (2 bags)", cost: 2.8, category: "Produce" },
  { id: "e8", name: "Bananas & Apples", cost: 3.5, category: "Produce" },
  { id: "e9", name: "Cheddar Cheese Block", cost: 2.5, category: "Dairy" },
];

export function initialExpensesFromStorage(raw: string | null): ExpenseItem[] {
  if (!raw) return [];

  try {
    const parsed: unknown = JSON.parse(raw);
    return Array.isArray(parsed) ? (parsed as ExpenseItem[]) : [];
  } catch {
    return [];
  }
}
