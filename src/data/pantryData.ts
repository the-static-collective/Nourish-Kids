import { PantryIngredient, SubstitutionRule } from "../types";

export const COMMON_PANTRY_INGREDIENTS: PantryIngredient[] = [
  // Grains & Carbs
  { id: "oats", name: "Rolled Oats / Oatmeal", category: "grains", iconName: "Wheat", isCommonStaple: true },
  { id: "rice", name: "White or Brown Rice", category: "grains", iconName: "Utensils", isCommonStaple: true },
  { id: "pasta", name: "Pasta (Macaroni/Spaghetti)", category: "grains", iconName: "UtensilsCrossed", isCommonStaple: true },
  { id: "bread", name: "Bread / Tortillas / Pita", category: "grains", iconName: "Square", isCommonStaple: true },
  { id: "potatoes", name: "Potatoes / Sweet Potatoes", category: "grains", iconName: "Circle", isCommonStaple: true },
  
  // Proteins
  { id: "pb", name: "Peanut Butter / Nut Butter", category: "protein", iconName: "Smile", isCommonStaple: true },
  { id: "eggs", name: "Eggs", category: "protein", iconName: "Egg", isCommonStaple: true },
  { id: "canned_beans", name: "Canned Black/Pinto Beans", category: "protein", iconName: "Package", isCommonStaple: true },
  { id: "lentils", name: "Dry Lentils or Beans", category: "protein", iconName: "Disc", isCommonStaple: true },
  { id: "tuna", name: "Canned Tuna or Chicken", category: "protein", iconName: "Fish", isCommonStaple: true },
  { id: "ground_meat", name: "Ground Meat or Hot Dogs", category: "protein", iconName: "Beef", isCommonStaple: false },

  // Dairy & Fridge
  { id: "cheese", name: "Cheddar / Cheese Slices", category: "dairy_alt", iconName: "Shield", isCommonStaple: true },
  { id: "milk", name: "Milk / Plant Milk / Powdered Milk", category: "dairy_alt", iconName: "CupSoda", isCommonStaple: true },
  { id: "yogurt", name: "Yogurt or Cottage Cheese", category: "dairy_alt", iconName: "Coffee", isCommonStaple: false },
  { id: "butter", name: "Butter or Margarine", category: "dairy_alt", iconName: "Flame", isCommonStaple: true },

  // Fruits & Veggies
  { id: "bananas", name: "Bananas", category: "produce", iconName: "Apple", isCommonStaple: true },
  { id: "apples", name: "Apples or Applesauce", category: "produce", iconName: "Apple", isCommonStaple: true },
  { id: "carrots", name: "Carrots or Squash", category: "produce", iconName: "Carrot", isCommonStaple: true },
  { id: "frozen_veg", name: "Frozen Peas / Corn / Broccoli", category: "produce", iconName: "Snowflake", isCommonStaple: true },
  { id: "canned_tomatoes", name: "Canned Tomatoes or Sauce", category: "canned_pantry", iconName: "HeartHandshake", isCommonStaple: true },
  { id: "canned_corn", name: "Canned Corn", category: "canned_pantry", iconName: "Sun", isCommonStaple: true },
];

export const COMMON_SUBSTITUTIONS: SubstitutionRule[] = [
  {
    missingItem: "Fluid Milk",
    substitutes: [
      "Water + 1 tbsp Butter or Margarine (adds rich creaminess to Mac & Cheese or oatmeal)",
      "Powdered Milk dissolved in warm water",
      "Plain or Vanilla Yogurt diluted with a little water",
      "Canned Evaporated Milk diluted 50/50 with water"
    ],
    bestFor: "Mac & Cheese, Oatmeal, Pancakes, Soups",
    kidSafetyTip: "For toddlers under 12 months, cow's milk isn't recommended as main drink, but small amounts cooked into oats or pancakes are safe."
  },
  {
    missingItem: "Eggs (for Baking or Pancakes)",
    substitutes: [
      "1/4 cup Applesauce or Mashed Banana per egg",
      "1 tbsp Peanut Butter (adds binding + protein)",
      "1 tbsp Chia Seeds or Ground Flax mixed with 3 tbsp warm water",
      "2 tbsp Yogurt"
    ],
    bestFor: "Pancakes, Oat Muffins, Quick Breads",
    kidSafetyTip: "Bananas and applesauce add natural sweetness so you can reduce added sugar."
  },
  {
    missingItem: "Fresh Meat",
    substitutes: [
      "Canned Black or Pinto Beans (mashed slightly for young kids)",
      "Cooked Brown or Green Lentils (blends seamlessly into taco seasoning or pasta sauce)",
      "Scrambled Eggs or Hard-boiled Eggs (cut into thin quarters)",
      "Peanut Butter spread on whole grain bread"
    ],
    bestFor: "Tacos, Quesadillas, Spaghetti Sauce, Stews",
    kidSafetyTip: "Lentils absorb spices like cumin and tomato sauce naturally, mimicking ground meat texture."
  },
  {
    missingItem: "Fresh Fruit",
    substitutes: [
      "Canned Fruit drained of heavy syrup (or rinsed)",
      "Unsweetened Applesauce or fruit purees",
      "Frozen Berries microwaved for 15 seconds (creates a warm juicy syrup for oats/pancakes)",
      "Raisins soaked in warm water for 5 minutes so they are soft and chewable"
    ],
    bestFor: "Snacks, Oatmeal, Yogurt toppings",
    kidSafetyTip: "Always cut grapes, cherry tomatoes, and round dried fruit into quarters for kids under 4."
  },
  {
    missingItem: "Bread",
    substitutes: [
      "Corn or Flour Tortillas (rolled up with cheese or PB)",
      "Oat Pancakes made from just oats, water/milk & banana",
      "Cooked Rice or Potato slices as a base for eggs or beans"
    ],
    bestFor: "Sandwiches, Breakfast rolls, Dinner bases",
    kidSafetyTip: "Warm tortillas in a pan for 10 seconds so they soft-roll without cracking."
  }
];
