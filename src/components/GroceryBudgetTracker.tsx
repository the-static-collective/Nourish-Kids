import React, { useState, useEffect } from "react";
import { DollarSign, Plus, Trash2, ShoppingCart, Percent, RotateCcw } from "lucide-react";
import {
  SAMPLE_EXPENSES,
  initialExpensesFromStorage,
  type ExpenseItem,
} from "../budget/budgetState.ts";


export const GroceryBudgetTracker: React.FC = () => {
  const [weeklyBudget, setWeeklyBudget] = useState<number>(() => {
    try {
      const saved = localStorage.getItem("nourish_weekly_budget");
      return saved ? parseFloat(saved) : 75.0;
    } catch {
      return 75.0;
    }
  });

  const [expenses, setExpenses] = useState<ExpenseItem[]>(() => {
    try {
      return initialExpensesFromStorage(
        localStorage.getItem("nourish_grocery_expenses"),
      );
    } catch {
      return [];
    }
  });

  const [itemName, setItemName] = useState("");
  const [itemCost, setItemCost] = useState("");
  const [itemCategory, setItemCategory] = useState<ExpenseItem["category"]>("Grains");

  useEffect(() => {
    try {
      localStorage.setItem("nourish_weekly_budget", weeklyBudget.toString());
      localStorage.setItem("nourish_grocery_expenses", JSON.stringify(expenses));
    } catch (e) {
      console.error("Storage error:", e);
    }
  }, [weeklyBudget, expenses]);

  const totalSpent = expenses.reduce((sum, item) => sum + item.cost, 0);
  const remainingBudget = weeklyBudget - totalSpent;
  const percentUsed = weeklyBudget > 0 ? Math.min(Math.round((totalSpent / weeklyBudget) * 100), 100) : 0;
  const isOverBudget = remainingBudget < 0;

  const handleAddExpense = (e: React.FormEvent) => {
    e.preventDefault();
    const costNum = parseFloat(itemCost);
    if (!itemName.trim() || isNaN(costNum) || costNum <= 0) return;

    const newItem: ExpenseItem = {
      id: `exp-${Date.now()}`,
      name: itemName.trim(),
      cost: Math.round(costNum * 100) / 100,
      category: itemCategory,
    };

    setExpenses([...expenses, newItem]);
    setItemName("");
    setItemCost("");
  };

  const removeItem = (id: string) => {
    setExpenses(expenses.filter((e) => e.id !== id));
  };

  const handleLoadSample = () => {
    setWeeklyBudget(75);
    setExpenses(SAMPLE_EXPENSES.map((item) => ({ ...item })));
  };

  const costCuttingTips = [
    {
      title: "1. Buy Store Brands & Generic Lines",
      savings: "Save ~25-30%",
      detail: "Store brand oats, canned tomatoes, beans, rice, and frozen vegetables are chemically identical to name brands but cost up to 30% less."
    },
    {
      title: "2. Swap Fresh for Frozen Fruits & Veggies",
      savings: "Save ~40%",
      detail: "Frozen produce is flash-frozen at peak nutrition. You pay zero tax on food waste from spoiled fresh berries or wilting greens."
    },
    {
      title: "3. Meat-Stretching with Lentils & Beans",
      savings: "Save ~$15/week",
      detail: "Mix cooked brown lentils or black beans 50/50 with ground beef or chicken. Doubles volume, adds iron/fiber, and cuts meat expense in half."
    },
    {
      title: "4. Buy Cheese in Blocks & Shred Yourself",
      savings: "Save ~$2.00 per bag",
      detail: "Pre-shredded cheese includes cellulose anti-caking agents and costs significantly more per ounce than a simple block of cheddar."
    },
    {
      title: "5. Beware Individual Snack Packs",
      savings: "Save ~$10/week",
      detail: "Individual toddler snack pouches and chip bags carry a 200% packaging markup. Buy full jars of applesauce or big boxes of crackers and portion into small reusable cups."
    },
    {
      title: "6. Check Unit Price (Price Per Ounce / Pound)",
      savings: "Save on Bulk Staples",
      detail: "Look at the small orange/yellow tag on the shelf. The 'Unit Price' tells you which package actually gives you more food for your dollar."
    }
  ];

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Header Banner */}
      <div className="bg-[#2b2219] text-[#fffdfa] p-6 sm:p-8 rounded-2xl shadow-md space-y-3">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#436a52] text-xs font-bold text-[#e3eedb]">
          <DollarSign className="w-3.5 h-3.5" />
          <span>Interactive Grocery Budget & Expense Manager</span>
        </div>

        <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
          Track Every Dollar & Maximize Your Family Food Budget
        </h2>

        <p className="text-xs sm:text-sm text-[#d1c2b5] leading-relaxed max-w-2xl">
          Set your target weekly grocery spending limit, log your food purchases, and see instant category breakdowns alongside proven cost-cutting tips.
        </p>
      </div>

      {/* Budget Summary Metrics Card */}
      <div className="bg-[#fffdfa] rounded-2xl border border-[#e8ded1] p-6 shadow-sm space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Target Weekly Budget Setter */}
          <div className="p-4 rounded-xl bg-[#f9f3ec] border border-[#e8ded1] space-y-2">
            <label className="text-xs font-bold text-[#8a5b28] uppercase tracking-wider block">
              Set Weekly Budget Limit ($)
            </label>
            <div className="flex items-center gap-2">
              <span className="text-lg font-bold text-[#2b2219]">$</span>
              <input
                type="number"
                min="5"
                step="5"
                value={weeklyBudget}
                onChange={(e) => setWeeklyBudget(Math.max(0, parseFloat(e.target.value) || 0))}
                className="w-full px-3 py-2 rounded-lg border border-[#d2c2b2] bg-white font-extrabold text-xl text-[#2b2219] focus:outline-none focus:ring-2 focus:ring-[#b85a22]"
              />
            </div>
            <p className="text-[11px] text-[#6e5d50]">Adjust limit anytime to fit your income or benefit cycle.</p>
          </div>

          {/* Total Spent */}
          <div className="p-4 rounded-xl bg-[#f9f3ec] border border-[#e8ded1] space-y-1">
            <span className="text-xs font-bold text-[#6e5d50] uppercase tracking-wider block">
              Total Logged Expenses
            </span>
            <p className="text-2xl font-black text-[#2b2219]">
              ${totalSpent.toFixed(2)}
            </p>
            <p className="text-[11px] text-[#6e5d50]">{expenses.length} item lines tracked</p>
          </div>

          {/* Remaining Budget */}
          <div
            className={`p-4 rounded-xl border space-y-1 ${
              isOverBudget
                ? "bg-[#fdf2f2] border-[#f8d7d7] text-[#b82a2a]"
                : "bg-[#e3eedb] border-[#c4e2bd] text-[#2c5333]"
            }`}
          >
            <span className="text-xs font-bold uppercase tracking-wider block">
              {isOverBudget ? "Over Budget By" : "Remaining Funds"}
            </span>
            <p className="text-2xl font-black">
              ${Math.abs(remainingBudget).toFixed(2)}
            </p>
            <p className="text-[11px] font-medium">
              {isOverBudget
                ? "Warning: Expenses exceed set weekly goal."
                : "Great job staying under your grocery budget!"}
            </p>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="space-y-2">
          <div className="flex justify-between text-xs font-bold text-[#2b2219]">
            <span>Budget Utilization</span>
            <span>{percentUsed}% ({isOverBudget ? "EXCEEDED" : `$${remainingBudget.toFixed(2)} left`})</span>
          </div>

          <div className="w-full h-3 rounded-full bg-[#e8ded1] overflow-hidden">
            <div
              className={`h-full transition-all duration-300 ${
                isOverBudget
                  ? "bg-[#c0392b]"
                  : percentUsed > 85
                  ? "bg-[#d97736]"
                  : "bg-[#436a52]"
              }`}
              style={{ width: `${Math.min(percentUsed, 100)}%` }}
            />
          </div>
        </div>
      </div>

      {/* Add New Expense Form + List */}
      <div className="grid md:grid-cols-[1fr_1.2fr] gap-6">
        {/* Add Line Item Form */}
        <div className="bg-[#fffdfa] rounded-2xl border border-[#e8ded1] p-6 space-y-4 shadow-sm h-fit">
          <h3 className="text-base font-extrabold text-[#2b2219] flex items-center gap-2 border-b border-[#e8ded1] pb-3">
            <Plus className="w-5 h-5 text-[#b85a22]" />
            <span>Add Grocery Item</span>
          </h3>

          <form onSubmit={handleAddExpense} className="space-y-3 text-xs">
            <div>
              <label className="font-bold text-[#544538] block mb-1">Item Name</label>
              <input
                type="text"
                value={itemName}
                onChange={(e) => setItemName(e.target.value)}
                placeholder="e.g. Canned Black Beans or 1 lb Carrots"
                className="w-full px-3.5 py-2.5 rounded-xl border border-[#d2c2b2] bg-[#fdfaf7] text-xs text-[#2b2219] placeholder-[#9c8b7d] focus:outline-none focus:ring-2 focus:ring-[#b85a22]"
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="font-bold text-[#544538] block mb-1">Cost ($)</label>
                <input
                  type="number"
                  step="0.01"
                  min="0.01"
                  value={itemCost}
                  onChange={(e) => setItemCost(e.target.value)}
                  placeholder="0.00"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-[#d2c2b2] bg-[#fdfaf7] text-xs text-[#2b2219] focus:outline-none focus:ring-2 focus:ring-[#b85a22]"
                  required
                />
              </div>

              <div>
                <label className="font-bold text-[#544538] block mb-1">Category</label>
                <select
                  value={itemCategory}
                  onChange={(e) => setItemCategory(e.target.value as any)}
                  className="w-full px-3 py-2.5 rounded-xl border border-[#d2c2b2] bg-[#fdfaf7] text-xs text-[#2b2219] focus:outline-none focus:ring-2 focus:ring-[#b85a22]"
                >
                  <option value="Grains">Grains & Rice</option>
                  <option value="Protein">Protein / Beans / Eggs</option>
                  <option value="Produce">Produce / Fruit & Veg</option>
                  <option value="Dairy">Dairy & Cheese</option>
                  <option value="Canned / Pantry">Canned Tomatoes / Sauce</option>
                  <option value="Snacks">Snacks & Other</option>
                </select>
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-3 rounded-xl bg-[#b85a22] hover:bg-[#91461b] text-white font-bold text-xs flex items-center justify-center gap-2 transition shadow-sm pt-2"
            >
              <Plus className="w-4 h-4" />
              <span>Add Item To Expense Log</span>
            </button>
          </form>
        </div>

        {/* Expense Log List */}
        <div className="bg-[#fffdfa] rounded-2xl border border-[#e8ded1] p-6 space-y-4 shadow-sm">
          <div className="flex items-center justify-between border-b border-[#e8ded1] pb-3">
            <h3 className="text-base font-extrabold text-[#2b2219] flex items-center gap-2">
              <ShoppingCart className="w-5 h-5 text-[#436a52]" />
              <span>Log Grocery Cart Items</span>
            </h3>

            <button
              onClick={handleLoadSample}
              className="text-xs text-[#6e5d50] hover:text-[#b85a22] font-semibold flex items-center gap-1"
              title="Load clearly labeled sample budget items"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Load Sample Cart</span>
            </button>
          </div>

          {expenses.length === 0 ? (
            <div className="p-8 text-center text-xs text-[#6e5d50] bg-[#f9f3ec] rounded-xl border border-dashed border-[#d2c2b2]">
              No expense items logged yet. Add your receipt items on the left!
            </div>
          ) : (
            <div className="space-y-2 max-h-[380px] overflow-y-auto pr-1">
              {expenses.map((item) => (
                <div
                  key={item.id}
                  className="p-3 rounded-xl bg-[#f9f3ec] border border-[#e8ded1] flex items-center justify-between gap-3 text-xs"
                >
                  <div className="min-w-0 flex-1">
                    <span className="font-bold text-[#2b2219] block truncate">{item.name}</span>
                    <span className="text-[10px] text-[#8a7a6c] uppercase font-semibold">
                      {item.category}
                    </span>
                  </div>

                  <div className="flex items-center gap-3 shrink-0 font-extrabold text-[#436a52]">
                    <span>${item.cost.toFixed(2)}</span>
                    <button
                      onClick={() => removeItem(item.id)}
                      className="p-1 rounded-md text-[#b82a2a] hover:bg-[#f2d0d0] transition"
                      title="Delete item"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Common Cost-Cutting Opportunities for Families */}
      <div className="bg-[#fffdfa] rounded-2xl border border-[#e8ded1] p-6 sm:p-8 space-y-4 shadow-sm">
        <div className="border-b border-[#e8ded1] pb-3">
          <h3 className="text-lg font-extrabold text-[#2b2219] flex items-center gap-2">
            <Percent className="w-5 h-5 text-[#b85a22]" />
            <span>Key Cost-Cutting Opportunities for Grocery Shoppers</span>
          </h3>
          <p className="text-xs text-[#6e5d50]">
            Simple adjustments that reduce grocery bills by $30 - $60 per month without sacrificing child nutrition.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-4">
          {costCuttingTips.map((tip, idx) => (
            <div
              key={idx}
              className="p-4 rounded-xl bg-[#f9f3ec] border border-[#e8ded1] space-y-2 text-xs flex flex-col justify-between"
            >
              <div className="space-y-1">
                <div className="flex items-center justify-between">
                  <h4 className="font-bold text-[#2b2219]">{tip.title}</h4>
                </div>
                <p className="text-[#544538] leading-relaxed">{tip.detail}</p>
              </div>

              <div className="pt-2 border-t border-[#e2d4c7] font-extrabold text-[#436a52] text-[11px]">
                ★ Potential Impact: {tip.savings}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
