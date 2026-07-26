import React, { useState } from "react";
import { Calendar, ShoppingBag, CheckSquare, Square, Printer, Copy, Sparkles, ChefHat, Heart, Users, Clock, DollarSign } from "lucide-react";

interface MealDay {
  dayNumber: number;
  dayName: string;
  breakfast: { name: string; cost: string };
  lunch: { name: string; cost: string };
  dinner: { name: string; cost: string };
  snack: { name: string; cost: string };
  kidNote: string;
}

const FAMILY_7_DAY_MENU: MealDay[] = [
  {
    dayNumber: 1,
    dayName: "Monday",
    breakfast: { name: "Cinnamon PB Banana Oatmeal", cost: "$0.85 family total" },
    lunch: { name: "Cheesy Black Bean & Rice Quesadilla Pinwheels", cost: "$1.40 family total" },
    dinner: { name: "Creamy Tomato & Black Bean Rice Skillet", cost: "$2.10 family total" },
    snack: { name: "Sliced Apple with Peanut Butter Dip", cost: "$0.60 family total" },
    kidNote: "Mash beans smoothly before spreading into tortillas for easy finger food."
  },
  {
    dayNumber: 2,
    dayName: "Tuesday",
    breakfast: { name: "Scrambled Eggs with Toast & Banana Slices", cost: "$1.10 family total" },
    lunch: { name: "Leftover Tomato & Bean Rice Skillet", cost: "$0.00 (Leftover)" },
    dinner: { name: "Golden Hidden-Carrot Macaroni & Cheese with Peas", cost: "$2.20 family total" },
    snack: { name: "Hard-Boiled Egg with Paprika / Salt", cost: "$0.50 family total" },
    kidNote: "Carrots pureed into cheese sauce add bright golden color kids adore."
  },
  {
    dayNumber: 3,
    dayName: "Wednesday",
    breakfast: { name: "3-Ingredient Banana Oat Pancakes", cost: "$0.90 family total" },
    lunch: { name: "Creamy Tuna & Sweet Corn Pasta Salad", cost: "$1.85 family total" },
    dinner: { name: "Mild Kid-Friendly Tomato & Lentil Rice Chili", cost: "$2.00 family total" },
    snack: { name: "Warm Applesauce with Cinnamon Oat Sprinkle", cost: "$0.55 family total" },
    kidNote: "Lentils melt into soft broth so picky kids won't notice vegetable chunks."
  },
  {
    dayNumber: 4,
    dayName: "Thursday",
    breakfast: { name: "Microwave Egg & Veggie Mug Bake + Toast", cost: "$1.20 family total" },
    lunch: { name: "Leftover Mild Tomato & Lentil Rice Chili", cost: "$0.00 (Leftover)" },
    dinner: { name: "One-Pot Golden Tomato Rice with Pinto Beans & Peas", cost: "$1.90 family total" },
    snack: { name: "Toast Fingers with Peanut Butter", cost: "$0.45 family total" },
    kidNote: "Rice cooked directly in tomato sauce turns savory sweet."
  },
  {
    dayNumber: 5,
    dayName: "Friday",
    breakfast: { name: "Warm Cinnamon Apple & PB Oat Bowl", cost: "$0.80 family total" },
    lunch: { name: "Grilled Cheddar Cheese & Tomato Soup Dip", cost: "$1.75 family total" },
    dinner: { name: "Cheesy Tomato-Rice & Scrambled Egg Skillet", cost: "$1.95 family total" },
    snack: { name: "Banana Coins with Peanut Butter drizzle", cost: "$0.50 family total" },
    kidNote: "Cut grilled cheese into fun triangle shapes for easy dipping."
  },
  {
    dayNumber: 6,
    dayName: "Saturday",
    breakfast: { name: "Silver Dollar Oat Pancakes with Applesauce Dip", cost: "$0.95 family total" },
    lunch: { name: "Warm Rice & Bean Bowl with Melted Cheese", cost: "$1.30 family total" },
    dinner: { name: "Baked Potato Boats filled with Chili & Cheese", cost: "$2.40 family total" },
    snack: { name: "Carrot Sticks (steamed for toddlers) & Hummus/Yogurt", cost: "$0.65 family total" },
    kidNote: "Potato skins make fun handheld boats for kids."
  },
  {
    dayNumber: 7,
    dayName: "Sunday",
    breakfast: { name: "Fluffy Scrambled Eggs & Toast with Fruit", cost: "$1.15 family total" },
    lunch: { name: "Cheesy Pinto Bean & Corn Tostadas / Quesadillas", cost: "$1.50 family total" },
    dinner: { name: "Family Tomato Pasta with Soft Lentils & Green Peas", cost: "$2.15 family total" },
    snack: { name: "Warm Oats & Honey / Cinnamon Tea Milk", cost: "$0.40 family total" },
    kidNote: "Soft lentils mixed into tomato pasta sauce add high protein effortlessly."
  }
];

interface GroceryCategory {
  category: string;
  items: { name: string; qty: string; estCost: string }[];
}

const CONSOLIDATED_GROCERY_LIST: GroceryCategory[] = [
  {
    category: "Grains & Bakery Staples",
    items: [
      { name: "Rolled Oats / Quick Oats", qty: "1 large container (42 oz)", estCost: "$3.80" },
      { name: "White or Brown Rice", qty: "3 lb bag", estCost: "$2.30" },
      { name: "Elbow Macaroni / Spaghetti Pasta", qty: "2 boxes (16 oz each)", estCost: "$2.40" },
      { name: "Whole Wheat or White Bread", qty: "2 loaves", estCost: "$2.80" },
      { name: "Flour Tortillas", qty: "1 pack (10-12 count)", estCost: "$1.90" }
    ]
  },
  {
    category: "Canned Goods & Legumes",
    items: [
      { name: "Canned Black Beans / Pinto Beans", qty: "5 cans (15 oz)", estCost: "$4.00" },
      { name: "Canned Diced / Crushed Tomatoes", qty: "4 cans (15 oz)", estCost: "$3.20" },
      { name: "Canned Tomato Sauce", qty: "2 cans (8 oz)", estCost: "$1.10" },
      { name: "Canned Sweet Corn", qty: "2 cans (15 oz)", estCost: "$1.80" },
      { name: "Canned Chunk Light Tuna in water", qty: "2 cans", estCost: "$2.20" },
      { name: "Dry Brown or Red Lentils", qty: "1 lb bag", estCost: "$1.40" }
    ]
  },
  {
    category: "Produce & Frozen Veggies",
    items: [
      { name: "Fresh Bananas", qty: "2 bunches (~6 lbs)", estCost: "$3.30" },
      { name: "Apples (Bag of Gala or Fuji)", qty: "3 lb bag", estCost: "$3.50" },
      { name: "Whole Carrots", qty: "2 lb bag", estCost: "$1.60" },
      { name: "Russet Potatoes", qty: "5 lb bag", estCost: "$3.20" },
      { name: "Frozen Peas & Carrots", qty: "1 bag (16 oz)", estCost: "$1.35" }
    ]
  },
  {
    category: "Dairy, Eggs & Fats",
    items: [
      { name: "Large Eggs", qty: "2 dozen", estCost: "$4.80" },
      { name: "Block Cheddar / American Cheese", qty: "16 oz block", estCost: "$3.20" },
      { name: "Whole Milk (or Powdered Milk)", qty: "1 gallon", estCost: "$3.40" },
      { name: "Store Brand Creamy Peanut Butter", qty: "28 oz jar", estCost: "$2.80" }
    ]
  }
];

export const Family7DayPlanView: React.FC = () => {
  const [checkedItems, setCheckedItems] = useState<Record<string, boolean>>({});
  const [copiedNotification, setCopiedNotification] = useState(false);

  const toggleCheck = (itemName: string) => {
    setCheckedItems((prev) => ({
      ...prev,
      [itemName]: !prev[itemName]
    }));
  };

  const handleCopyList = () => {
    const text = CONSOLIDATED_GROCERY_LIST.map((cat) => {
      const itemsStr = cat.items.map((i) => `- [ ] ${i.name} (${i.qty}) ~${i.estCost}`).join("\n");
      return `=== ${cat.category} ===\n${itemsStr}`;
    }).join("\n\n");

    navigator.clipboard.writeText(`7-DAY FAMILY OF 3 GROCERY SHOPPING LIST (Total Est: ~$48.05)\n\n${text}`);
    setCopiedNotification(true);
    setTimeout(() => setCopiedNotification(false), 3000);
  };

  const totalGroceryEstimate = CONSOLIDATED_GROCERY_LIST.reduce((sum, cat) => {
    return sum + cat.items.reduce((itemSum, item) => itemSum + parseFloat(item.estCost.replace("$", "")), 0);
  }, 0);

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Header Banner */}
      <div className="bg-[#2b2219] text-[#fffdfa] p-6 sm:p-8 rounded-2xl shadow-md space-y-3">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#436a52] text-xs font-bold text-[#e3eedb]">
          <Users className="w-3.5 h-3.5" />
          <span>7-Day Plan for Family of 3 (2 Adults + 1 Child)</span>
        </div>

        <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
          $48/Wk Complete Family Meal Plan & Grocery Guide
        </h2>

        <p className="text-xs sm:text-sm text-[#d1c2b5] leading-relaxed max-w-2xl">
          Designed specifically to maximize child nutrition and taste while keeping grocery bills under $50 a week using pantry staples like rice, beans, canned tomatoes, eggs, and oats.
        </p>
      </div>

      {/* 7-Day Meal Plan Grid */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-xl font-extrabold text-[#2b2219] flex items-center gap-2">
            <Calendar className="w-5 h-5 text-[#b85a22]" />
            <span>Weekly Menu Schedule</span>
          </h3>

          <span className="text-xs font-bold text-[#436a52] bg-[#e3eedb] px-3 py-1 rounded-full">
            Est. Food Cost: ~$6.80 / day total for all 3 people
          </span>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {FAMILY_7_DAY_MENU.map((day) => (
            <div
              key={day.dayNumber}
              className="bg-[#fffdfa] rounded-2xl border border-[#e8ded1] p-5 space-y-3 shadow-sm flex flex-col justify-between"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between border-b border-[#e8ded1] pb-2">
                  <span className="font-extrabold text-sm text-[#2b2219]">
                    Day {day.dayNumber}: {day.dayName}
                  </span>
                  <span className="text-[11px] font-bold text-[#b85a22]">
                    Family Plan
                  </span>
                </div>

                <div className="space-y-2 text-xs">
                  <div>
                    <span className="font-bold text-[#8a5b28] text-[10px] uppercase block">Breakfast</span>
                    <p className="font-semibold text-[#2b2219]">{day.breakfast.name}</p>
                    <span className="text-[10px] text-[#6e5d50]">{day.breakfast.cost}</span>
                  </div>

                  <div>
                    <span className="font-bold text-[#8a5b28] text-[10px] uppercase block">Lunch</span>
                    <p className="font-semibold text-[#2b2219]">{day.lunch.name}</p>
                    <span className="text-[10px] text-[#6e5d50]">{day.lunch.cost}</span>
                  </div>

                  <div>
                    <span className="font-bold text-[#8a5b28] text-[10px] uppercase block">Dinner</span>
                    <p className="font-semibold text-[#2b2219]">{day.dinner.name}</p>
                    <span className="text-[10px] text-[#6e5d50]">{day.dinner.cost}</span>
                  </div>

                  <div>
                    <span className="font-bold text-[#8a5b28] text-[10px] uppercase block">Snack</span>
                    <p className="font-semibold text-[#2b2219]">{day.snack.name}</p>
                    <span className="text-[10px] text-[#6e5d50]">{day.snack.cost}</span>
                  </div>
                </div>
              </div>

              <div className="pt-2 border-t border-[#e8ded1] text-[11px] text-[#544538] bg-[#f9f3ec] p-2.5 rounded-xl border-dashed">
                <span className="font-bold text-[#b85a22]">Child Feeding Tip: </span>
                <span>{day.kidNote}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Consolidated Grocery Shopping List */}
      <div className="bg-[#fffdfa] rounded-2xl border border-[#e8ded1] p-6 sm:p-8 space-y-6 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#e8ded1] pb-4">
          <div>
            <h3 className="text-xl font-extrabold text-[#2b2219] flex items-center gap-2">
              <ShoppingBag className="w-5 h-5 text-[#436a52]" />
              <span>Consolidated Weekly Grocery List</span>
            </h3>
            <p className="text-xs text-[#6e5d50]">
              Everything required to cook all 7 days of meals for a family of 3. Total store estimate: <strong className="text-[#2b2219]">${totalGroceryEstimate.toFixed(2)}</strong>
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleCopyList}
              className="px-3.5 py-2 rounded-xl bg-[#f9f3ec] hover:bg-[#ede3d5] text-[#2b2219] border border-[#d2c2b2] font-bold text-xs flex items-center gap-1.5 transition"
            >
              <Copy className="w-3.5 h-3.5" />
              <span>{copiedNotification ? "Copied to Clipboard!" : "Copy Grocery List"}</span>
            </button>
          </div>
        </div>

        {/* Categories List */}
        <div className="grid md:grid-cols-2 gap-6">
          {CONSOLIDATED_GROCERY_LIST.map((cat, idx) => (
            <div
              key={idx}
              className="bg-[#f9f3ec] rounded-xl border border-[#e8ded1] p-5 space-y-3"
            >
              <h4 className="font-extrabold text-sm text-[#2b2219] border-b border-[#e2d4c7] pb-2 flex items-center justify-between">
                <span>{cat.category}</span>
                <span className="text-xs font-bold text-[#436a52]">Department</span>
              </h4>

              <div className="space-y-2">
                {cat.items.map((item, itemIdx) => {
                  const itemKey = `${cat.category}-${item.name}`;
                  const isChecked = !!checkedItems[itemKey];

                  return (
                    <button
                      key={itemIdx}
                      onClick={() => toggleCheck(itemKey)}
                      className="w-full flex items-start gap-3 p-2 rounded-lg hover:bg-[#f1e6da] transition text-left text-xs"
                    >
                      <div className="mt-0.5 text-[#b85a22]">
                        {isChecked ? (
                          <CheckSquare className="w-4 h-4 text-[#436a52]" />
                        ) : (
                          <Square className="w-4 h-4 text-[#8a7a6c]" />
                        )}
                      </div>

                      <div className="flex-1 min-w-0">
                        <span
                          className={`font-bold block ${
                            isChecked ? "line-through text-[#8a7a6c]" : "text-[#2b2219]"
                          }`}
                        >
                          {item.name}
                        </span>
                        <span className="text-[11px] text-[#6e5d50]">{item.qty}</span>
                      </div>

                      <span className="font-extrabold text-[#436a52] shrink-0">
                        {item.estCost}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
