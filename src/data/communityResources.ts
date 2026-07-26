import { FoodResource, BudgetMealPlan } from "../types";

export const FOOD_RESOURCES: FoodResource[] = [
  {
    id: "wic-program",
    name: "WIC (Women, Infants, and Children)",
    category: "wic",
    title: "Special Supplemental Nutrition Program for Mothers & Children",
    summary: "Provides specific nutritious foods (milk, eggs, cheese, cereal, juice, peanut butter, beans, fresh fruits & veggies) for pregnant women, new moms, infants, and children up to age 5.",
    eligibility: "Pregnant women, breastfeeding/postpartum mothers, infants, and children up to 5th birthday. Income eligibility is up to 185% of Federal Poverty Line (if on SNAP/Medicaid, you automatically qualify).",
    howToApply: [
      "Find your state or local county WIC clinic online or call 211.",
      "Schedule an appointment (many offer telehealth or quick intake).",
      "Bring proof of income (paystub or benefit letter), ID, and address."
    ],
    contactInfo: "Call 2-1-1 or visit signup.wicworks.fns.usda.gov",
    linkUrl: "https://www.fns.usda.gov/wic",
    urgentTips: "WIC benefits are provided on an eBT card monthly and do NOT affect SNAP allotments. You can receive both WIC and SNAP at the same time!"
  },
  {
    id: "snap-program",
    name: "SNAP (Food Stamps / EBT)",
    category: "snap",
    title: "Supplemental Nutrition Assistance Program",
    summary: "Monthly benefit card loaded with funds to buy groceries at supermarkets, discount stores, farmers markets, and online retailers (Walmart, Amazon, Aldi).",
    eligibility: "Based on household income and size. Many states have expedited SNAP approval (within 7 days) if your monthly income is below $150 or housing costs exceed income.",
    howToApply: [
      "Apply online via your state's social service or human services portal.",
      "Request 'Expedited / Emergency SNAP' if you have under $100 in cash/bank account.",
      "Many local community centers help fill out the application in 15 minutes."
    ],
    contactInfo: "Call USDA Hunger Hotline at 1-866-3-HUNGRY (1-866-348-6479) or 211",
    linkUrl: "https://www.fns.usda.gov/snap",
    urgentTips: "At many local Farmers Markets, SNAP dollars are matched 1:1 through Double Up Food Bucks (e.g. spend $10 EBT, get $20 worth of fresh produce for kids)."
  },
  {
    id: "food-bank-pantry",
    name: "Local Food Pantries & Feeding America Network",
    category: "food_bank",
    title: "Free Food Boxes, Produce Distribution, & Mobile Food Pantries",
    summary: "Immediate, no-cost emergency groceries provided by community non-profits, churches, and neighborhood pantries. No government registration required for most.",
    eligibility: "Open to anyone in need. Most pantries ask for zero proof of income or citizenship—just your name and family size.",
    howToApply: [
      "Visit FeedingAmerica.org/find-your-local-foodbank or call 211.",
      "Check distribution days and times (many operate drive-thru or evening hours).",
      "Bring reusable bags or boxes if available."
    ],
    contactInfo: "Visit FeedingAmerica.org or Call 2-1-1",
    linkUrl: "https://www.feedingamerica.org",
    urgentTips: "Mobile food pantries often give out fresh milk, eggs, bread, and seasonal produce in large boxes—great for stocking up on perishable staples."
  },
  {
    id: "school-meals",
    name: "National School Breakfast & Lunch + Summer Meal Sites",
    category: "school_meals",
    title: "Free & Reduced-Price School Breakfast/Lunch & Summer Eats",
    summary: "Nutritious breakfasts, warm lunches, and afternoon snacks provided directly at public and charter schools, as well as community summer meal parks.",
    eligibility: "All children at Community Eligibility Provision (CEP) schools eat FREE. At non-CEP schools, families below 185% poverty qualify for free or 40¢ lunch.",
    howToApply: [
      "Fill out the 1-page School Meal Application given at school start or anytime during the year.",
      "In summer, text 'FOOD' or 'COMIDA' to 304-304 to locate free summer meal sites near you."
    ],
    contactInfo: "Contact your local school district office or text FOOD to 304-304",
    linkUrl: "https://www.fns.usda.gov/cn/summer",
    urgentTips: "If your financial situation changes mid-year (job loss, medical bill), you can re-apply for free school meals on ANY day of the school year!"
  },
  {
    id: "little-free-pantries",
    name: "Little Free Pantries & Mutual Aid Fridges",
    category: "free_pantry",
    title: "24/7 Anonymous Neighborhood Food Cabinets",
    summary: "Small wooden cabinets placed in neighborhoods stocked with non-perishable canned goods, pasta, formula, baby wipes, and snacks by neighbors.",
    eligibility: "100% free, anonymous, open 24/7. Take what you need, leave what you can.",
    howToApply: [
      "Search the directory at LittleFreePantry.org or map 'Community Fridge' online.",
      "Walk up anytime day or night—no paperwork, no waiting in line."
    ],
    contactInfo: "Visit mapping.littlefreepantry.org",
    linkUrl: "https://www.littlefreepantry.org",
    urgentTips: "These are wonderful for late-night emergency items like a missing can of beans, box of mac & cheese, or baby formula jar."
  }
];

export const BUDGET_MEAL_PLANS: BudgetMealPlan[] = [
  {
    id: "plan-15-week",
    weeklyBudget: "$15.00 / week",
    daysCount: 7,
    targetAge: "Toddler & Young Child (Ages 2-6)",
    weeklyGroceries: [
      { item: "Rolled Oats (18 oz container)", estCost: "$2.10", yieldMeals: "14 bowls of oatmeal" },
      { item: "Large Eggs (1 Dozen)", estCost: "$2.50", yieldMeals: "12 servings (scrambled/bakes)" },
      { item: "Store Brand Peanut Butter (16 oz)", estCost: "$1.90", yieldMeals: "20+ spreads & oat mixes" },
      { item: "Bananas (1 bunch ~ 3 lbs)", estCost: "$1.60", yieldMeals: "6-8 bananas" },
      { item: "Canned Black Beans (2 cans)", estCost: "$1.60", yieldMeals: "4 bean meals" },
      { item: "White/Brown Rice (1 lb bag)", estCost: "$1.10", yieldMeals: "10 rice servings" },
      { item: "Frozen Peas & Carrots (12 oz bag)", estCost: "$1.30", yieldMeals: "6 veggie servings" },
      { item: "Cheddar Cheese Slices or Block", estCost: "$2.20", yieldMeals: "8-10 cheesy servings" }
    ],
    dailyMenu: [
      { day: "Monday", breakfast: "PB & Banana Warm Oatmeal", lunch: "Cheesy Scrambled Eggs with Peas", dinner: "Mashed Black Beans & Warm Rice with Cheese", snack: "Sliced Banana with PB dip" },
      { day: "Tuesday", breakfast: "3-Ingredient Banana Oat Pancakes", lunch: "PB & Banana Roll-Up", dinner: "Cheesy Bean & Rice Bowl", snack: "Hard-Boiled Egg quartered" },
      { day: "Wednesday", breakfast: "Peanut Butter Oatmeal with Apple/Banana", lunch: "Egg & Peas Mug Bake", dinner: "Savory Fried Rice with Egg & Veggies", snack: "Warm Banana mashed with cinnamon" },
      { day: "Thursday", breakfast: "Banana Oat Pancakes", lunch: "Mashed Black Bean & Cheese Tortilla/Rice", dinner: "Scrambled Eggs with Cheese & Frozen Veggies", snack: "Spoonful of Peanut Butter on Oat Cookie" },
      { day: "Friday", breakfast: "Warm PB Oat Porridge", lunch: "Rice & Peas Fiesta Bowl", dinner: "Cheesy Bean Quesadilla / Roll-up", snack: "Sliced Banana" },
      { day: "Saturday", breakfast: "Fluffy Egg Scramble", lunch: "PB & Banana Oat Bake", dinner: "Black Bean & Rice Cheesy Bake", snack: "Cool Boiled Egg" },
      { day: "Sunday", breakfast: "Banana Oat Pancakes", lunch: "Cheesy Egg & Veggie Rice", dinner: "Warm Bean & Cheese Dip with Toast/Rice", snack: "Oat & PB Spoon Bites" }
    ],
    stretchProTips: [
      "Save the water from boiling rice or veggies to thicken soups or bean mash—it retains nutrients!",
      "Bananas that get brown are sweetest—mash them into oats or pancakes so you never need added sugar.",
      "Rinse canned beans before mashing to reduce extra sodium for young kids."
    ]
  },
  {
    id: "plan-28-week",
    weeklyBudget: "$28.00 / week",
    daysCount: 7,
    targetAge: "Growing Kid / Multiple Children",
    weeklyGroceries: [
      { item: "Dry Brown Lentils (1 lb bag)", estCost: "$1.20", yieldMeals: "8-10 high-protein meals" },
      { item: "Pasta Spaghetti/Macaroni (2 lbs)", estCost: "$2.00", yieldMeals: "12 pasta servings" },
      { item: "Canned Diced Tomatoes (28 oz)", estCost: "$1.50", yieldMeals: "Sauce base for 8 meals" },
      { item: "Eggs (1 Dozen)", estCost: "$2.50", yieldMeals: "12 eggs" },
      { item: "Rolled Oats (42 oz big tub)", estCost: "$3.80", yieldMeals: "30+ oatmeal breakfasts" },
      { item: "Canned Tuna or Chicken (3 cans)", estCost: "$3.30", yieldMeals: "6 tuna/chicken meals" },
      { item: "Peanut Butter (28 oz big jar)", estCost: "$2.80", yieldMeals: "35 spreads" },
      { item: "Loaf of Whole Wheat Bread", estCost: "$1.80", yieldMeals: "20 bread slices" },
      { item: "Applesauce (24 oz jar)", estCost: "$2.20", yieldMeals: "12 fruit servings" },
      { item: "Cheddar Cheese Block (8 oz)", estCost: "$2.40", yieldMeals: "Shreds for 10 meals" },
      { item: "Frozen Mixed Veggies (16 oz)", estCost: "$1.50", yieldMeals: "8 veggie servings" },
      { item: "Bag of Carrots (1 lb)", estCost: "$1.20", yieldMeals: "Steams soft for 8 meals" }
    ],
    dailyMenu: [
      { day: "Monday", breakfast: "Apple Cinnamon Oatmeal", lunch: "PB & Jelly or PB & Applesauce Toast", dinner: "Creamy Tomato Lentil Pasta with Cheese", snack: "Hard-boiled egg" },
      { day: "Tuesday", breakfast: "Scrambled Eggs on Toast", lunch: "Creamy Tuna & Sweet Corn Pasta Salad", dinner: "Lentil Taco Meat over Rice or Toast", snack: "Warm Applesauce with Oat Crunch" },
      { day: "Wednesday", breakfast: "Peanut Butter Toast & Applesauce", lunch: "Cheesy Lentil & Tomato Soup", dinner: "Spaghetti with Hidden-Carrot Tomato Meatless Sauce", snack: "Hard-boiled egg" },
      { day: "Thursday", breakfast: "Banana/Apple Oat Pancakes", lunch: "Tuna Salad Toast Triangles", dinner: "Lentil & Veggie Shepherd's Pie (over mashed carrots/potatoes)", snack: "PB Toast" },
      { day: "Friday", breakfast: "Warm Cinnamon Oatmeal", lunch: "Egg & Cheese Toastie", dinner: "Golden Carrot Mac & Cheese with Peas", snack: "Applesauce cup" },
      { day: "Saturday", breakfast: "PB Oat Muffins or Pancakes", lunch: "Creamy Tuna Pasta Bowl", dinner: "Cheesy Lentil & Rice Casserole", snack: "Toast with Butter & Cinnamon" },
      { day: "Sunday", breakfast: "Egg & Cheese Toast", lunch: "Leftover Golden Mac & Cheese", dinner: "Comforting Tomato Lentil Stew with Warm Bread", snack: "Spoon of PB & Applesauce" }
    ],
    stretchProTips: [
      "Cook dry lentils with a pinch of garlic or onion powder—they cook in just 20 minutes without soaking!",
      "Puree cooked carrots directly into canned tomato sauce to sweeten the sauce naturally for kids.",
      "Store bread in the freezer and toast individual slices as needed so zero bread ever goes moldy or gets wasted."
    ]
  }
];
