export type AgeGroup = "toddler" | "early_child" | "school_age" | "all";

export interface Recipe {
  id: string;
  title: string;
  prepTime: string;
  cookTime: string;
  estimatedCost: string; // e.g. "$0.75 / serving"
  ageSuitability: string;
  description: string;
  ingredientsUsed: string[];
  pantryAdditions?: string[];
  instructions: string[];
  kidHacks?: string;
  safetyNote?: string;
  nutritionHighlight?: string;
  isSaved?: boolean;
  category?: "pantry_staple" | "5_min_quick" | "no_heat" | "budget_hero" | "toddler_soft";
}

export interface PantryIngredient {
  id: string;
  name: string;
  category: "grains" | "protein" | "dairy_alt" | "produce" | "canned_pantry" | "spices_oils";
  iconName: string;
  isCommonStaple?: boolean;
}

export interface BudgetMealPlan {
  id: string;
  weeklyBudget: string;
  daysCount: number;
  targetAge: string;
  weeklyGroceries: {
    item: string;
    estCost: string;
    yieldMeals: string;
  }[];
  dailyMenu: {
    day: string;
    breakfast: string;
    lunch: string;
    dinner: string;
    snack: string;
  }[];
  stretchProTips: string[];
}

export interface FoodResource {
  id: string;
  name: string;
  category: "wic" | "snap" | "food_bank" | "school_meals" | "free_pantry" | "hot_meals";
  title: string;
  summary: string;
  eligibility: string;
  howToApply: string[];
  contactInfo: string;
  linkUrl?: string;
  urgentTips: string;
}

export interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: string;
}

export interface SubstitutionRule {
  missingItem: string;
  substitutes: string[];
  bestFor: string;
  kidSafetyTip?: string;
}
