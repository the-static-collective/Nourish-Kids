import type { Requirement, ReviewedRecipe } from "../fulfillment/types.ts";

const ingredient = (
  id: string,
  label: string,
  quantity?: number,
  unit?: string,
  required = true,
): Requirement => ({
  id: `ingredient:${id}`,
  kind: "ingredient",
  label,
  required,
  quantity,
  unit,
});

const equipment = (id: string, label: string): Requirement => ({
  id: `equipment:${id}`,
  kind: "equipment",
  label,
  required: true,
});

export const REVIEWED_RECIPES: ReviewedRecipe[] = [
  {
    id: "staple-1-tomato-bean-rice-bowl",
    title: "Creamy Tomato & Black Bean Rice Bowl",
    serves: 2,
    requirements: [
      ingredient("rice", "Rice", 1, "cup"),
      ingredient("canned_beans", "Canned black or pinto beans", 0.5, "cup"),
      ingredient("canned_tomatoes", "Canned tomatoes or sauce", 0.5, "cup"),
      ingredient("cheese", "Cheddar or cheese", 0.25, "cup"),
      equipment("stovetop", "Stovetop"),
      equipment("saucepan", "Saucepan"),
    ],
    optionalRequirements: [
      ingredient("butter", "Butter or cooking oil", undefined, undefined, false),
      ingredient("salt", "Salt or seasoning", undefined, undefined, false),
    ],
    instructions: [
      "Warm tomatoes, add beans, and mash some beans into the sauce.",
      "Serve with prepared rice and cheese.",
    ],
    safetyNotes: ["Serve at a safe eating temperature."],
  },
  {
    id: "staple-2-mild-tomato-lentil-rice-chili",
    title: "Mild Tomato Lentil Rice Chili",
    serves: 2,
    requirements: [
      ingredient("lentils", "Dry lentils", 0.5, "cup"),
      ingredient("canned_tomatoes", "Canned tomatoes", 0.5, "cup"),
      ingredient("rice", "Rice", 0.5, "cup"),
      ingredient("canned_corn", "Canned corn", 0.25, "cup"),
      equipment("stovetop", "Stovetop"),
      equipment("saucepan", "Saucepan"),
    ],
    optionalRequirements: [
      ingredient("salt", "Salt", undefined, undefined, false),
      ingredient("cumin", "Cumin", undefined, undefined, false),
    ],
    instructions: ["Simmer lentils until soft, then combine with tomatoes, corn, and rice."],
    safetyNotes: ["Ensure lentils are fully cooked and soft."],
  },
  {
    id: "staple-3-rice-bean-quesadilla",
    title: "Rice & Bean Stuffed Tortilla",
    serves: 1,
    requirements: [
      ingredient("bread", "Tortilla or other flatbread", 1, "each"),
      ingredient("canned_beans", "Canned beans", 0.33, "cup"),
      ingredient("rice", "Rice", 0.33, "cup"),
      ingredient("canned_tomatoes", "Tomato sauce", 0.125, "cup"),
      ingredient("cheese", "Cheese", 0.125, "cup"),
      equipment("stovetop", "Stovetop"),
      equipment("skillet", "Skillet"),
    ],
    optionalRequirements: [ingredient("oil", "Cooking oil", undefined, undefined, false)],
    instructions: ["Combine filling, roll in a tortilla, and warm in a skillet."],
    safetyNotes: ["Cut into an age-appropriate shape before serving."],
  },
  {
    id: "staple-4-one-pot-spanish-rice",
    title: "One-Pot Golden Tomato Rice with Beans & Peas",
    serves: 3,
    requirements: [
      ingredient("rice", "Rice", 1, "cup"),
      ingredient("canned_tomatoes", "Tomato sauce", 0.5, "cup"),
      ingredient("canned_beans", "Canned beans", 0.33, "cup"),
      ingredient("frozen_veg", "Frozen peas or mixed vegetables", 0.33, "cup"),
      equipment("stovetop", "Stovetop"),
      equipment("saucepan", "Saucepan with lid"),
    ],
    optionalRequirements: [
      ingredient("oil", "Cooking oil", undefined, undefined, false),
      ingredient("salt", "Salt or seasoning", undefined, undefined, false),
    ],
    instructions: ["Cook the reviewed ingredients together until the rice is tender."],
    safetyNotes: ["Check that rice and vegetables are fully cooked."],
  },
  {
    id: "staple-5-tomato-rice-egg-scramble",
    title: "Cheesy Tomato-Rice & Egg Skillet",
    serves: 2,
    requirements: [
      ingredient("rice", "Rice", 0.5, "cup"),
      ingredient("canned_tomatoes", "Tomato sauce", 0.125, "cup"),
      ingredient("eggs", "Eggs", 2, "each"),
      ingredient("cheese", "Cheese", 0.125, "cup"),
      equipment("stovetop", "Stovetop"),
      equipment("skillet", "Skillet"),
    ],
    optionalRequirements: [ingredient("butter", "Butter or cooking oil", undefined, undefined, false)],
    instructions: ["Warm rice and tomato, add eggs, cook fully, then add cheese."],
    safetyNotes: ["Cook eggs fully before serving."],
  },
  {
    id: "pancake-banana-oat",
    title: "Banana Oat Pancakes",
    serves: 2,
    requirements: [
      ingredient("bananas", "Banana", 1, "each"),
      ingredient("eggs", "Egg", 1, "each"),
      ingredient("oats", "Rolled oats", 0.5, "cup"),
      equipment("stovetop", "Stovetop"),
      equipment("skillet", "Skillet"),
    ],
    optionalRequirements: [
      ingredient("cinnamon", "Cinnamon", undefined, undefined, false),
      ingredient("butter", "Butter or cooking oil", undefined, undefined, false),
    ],
    instructions: ["Mash, mix, and cook small pancakes until cooked through."],
    safetyNotes: ["Cool before serving."],
  },
  {
    id: "egg-veggie-mug-bake",
    title: "Microwave Egg & Veggie Mug Bake",
    serves: 1,
    requirements: [
      ingredient("eggs", "Eggs", 2, "each"),
      ingredient("frozen_veg", "Frozen vegetables", 0.125, "cup"),
      ingredient("milk", "Milk or milk alternative", 0.0625, "cup"),
      ingredient("cheese", "Cheese", 0.125, "cup"),
      equipment("microwave", "Microwave"),
      equipment("microwave_mug", "Microwave-safe mug"),
    ],
    optionalRequirements: [ingredient("salt", "Salt or seasoning", undefined, undefined, false)],
    instructions: ["Whisk ingredients and microwave in short intervals until fully set."],
    safetyNotes: ["Verify mug and food temperature before serving."],
  },
  {
    id: "golden-carrot-mac-cheese",
    title: "Golden Carrot Macaroni & Cheese",
    serves: 2,
    requirements: [
      ingredient("pasta", "Dry pasta", 1, "cup"),
      ingredient("carrots", "Carrot or squash", 0.5, "cup"),
      ingredient("cheese", "Cheese", 0.5, "cup"),
      ingredient("milk", "Milk or milk alternative", 0.25, "cup"),
      equipment("stovetop", "Stovetop"),
      equipment("pot", "Cooking pot"),
    ],
    optionalRequirements: [ingredient("butter", "Butter", undefined, undefined, false)],
    instructions: ["Cook pasta and vegetables, then combine with milk and cheese."],
    safetyNotes: ["Vegetables should be soft enough for the intended eater."],
  },
  {
    id: "creamy-tuna-pasta-salad",
    title: "Creamy Tuna & Sweet Corn Pasta",
    serves: 2,
    requirements: [
      ingredient("pasta", "Dry pasta", 1, "cup"),
      ingredient("tuna", "Canned tuna or chicken", 1, "can"),
      ingredient("canned_corn", "Canned corn", 0.5, "cup"),
      equipment("stovetop", "Stovetop"),
      equipment("pot", "Cooking pot"),
    ],
    optionalRequirements: [
      ingredient("mayo_yogurt", "Mayonnaise or plain yogurt", undefined, undefined, false),
    ],
    instructions: ["Cook pasta, drain, and combine with canned protein and corn."],
    safetyNotes: ["Inspect canned fish for unexpected bones before serving."],
  },
  {
    id: "peanut-butter-apple-oat-crunch",
    title: "Warm Apple, Peanut Butter & Oats",
    serves: 1,
    requirements: [
      ingredient("oats", "Rolled oats", 0.5, "cup"),
      ingredient("apples", "Apple or applesauce", 0.5, "cup"),
      ingredient("pb", "Peanut or nut butter", 0.0625, "cup"),
      equipment("microwave", "Microwave"),
      equipment("microwave_bowl", "Microwave-safe bowl"),
    ],
    optionalRequirements: [ingredient("cinnamon", "Cinnamon", undefined, undefined, false)],
    instructions: ["Microwave oats and apple until soft, then stir in nut butter."],
    safetyNotes: ["Serve at a safe temperature and account for known allergies."],
  },
];

export interface ResourceCatalogEntry {
  id: string;
  kind: Requirement["kind"];
  label: string;
  unit?: string;
}

export function deriveResourceCatalog(recipes: ReviewedRecipe[]): ResourceCatalogEntry[] {
  const catalog = new Map<string, ResourceCatalogEntry>();

  for (const recipe of recipes) {
    for (const requirement of [...recipe.requirements, ...recipe.optionalRequirements]) {
      const existing = catalog.get(requirement.id);
      catalog.set(requirement.id, {
        id: requirement.id,
        kind: requirement.kind,
        label: existing?.label ?? requirement.label,
        unit: existing?.unit ?? requirement.unit,
      });
    }
  }

  return [...catalog.values()].sort((a, b) => a.label.localeCompare(b.label));
}

export function validateReviewedRecipes(recipes: ReviewedRecipe[]): string[] {
  const errors: string[] = [];
  const recipeIds = new Set<string>();
  const units = new Map<string, string>();

  for (const recipe of recipes) {
    if (recipeIds.has(recipe.id)) errors.push(`duplicate recipe id: ${recipe.id}`);
    recipeIds.add(recipe.id);

    if (recipe.requirements.length === 0) {
      errors.push(`recipe has no requirements: ${recipe.id}`);
    }

    for (const requirement of [...recipe.requirements, ...recipe.optionalRequirements]) {
      if (requirement.quantity !== undefined && !requirement.unit) {
        errors.push(`quantity has no unit: ${recipe.id}/${requirement.id}`);
      }

      if (requirement.unit) {
        const prior = units.get(requirement.id);
        if (prior && prior !== requirement.unit) {
          errors.push(`unit mismatch for ${requirement.id}: ${prior} vs ${requirement.unit}`);
        } else {
          units.set(requirement.id, requirement.unit);
        }
      }
    }
  }

  return errors;
}


export interface ReviewedRecipeAdmission {
  recipes: ReviewedRecipe[];
  errors: string[];
}

export function admitReviewedRecipes(
  recipes: ReviewedRecipe[],
): ReviewedRecipeAdmission {
  const errors = validateReviewedRecipes(recipes);
  return {
    recipes: errors.length === 0 ? recipes : [],
    errors,
  };
}
