import React, { useState } from "react";
import { Sparkles, Plus, Check, Clock, DollarSign, Baby, Flame, ChefHat, RefreshCw, AlertCircle, Heart } from "lucide-react";
import { COMMON_PANTRY_INGREDIENTS } from "../data/pantryData";
import { CURATED_RECIPES } from "../data/curatedRecipes";
import { Recipe, AgeGroup } from "../types";

interface PantryStretchViewProps {
  onSelectRecipe: (recipe: Recipe) => void;
  savedRecipes: Recipe[];
  onToggleSave: (recipe: Recipe) => void;
}

export const PantryStretchView: React.FC<PantryStretchViewProps> = ({
  onSelectRecipe,
  savedRecipes,
  onToggleSave,
}) => {
  const [selectedIngredients, setSelectedIngredients] = useState<string[]>([
    "Rolled Oats / Oatmeal",
    "Eggs",
    "Bananas",
    "Canned Black/Pinto Beans"
  ]);
  const [customInput, setCustomInput] = useState("");
  const [ageGroup, setAgeGroup] = useState<AgeGroup>("all");
  const [selectedConstraints, setSelectedConstraints] = useState<string[]>([]);
  const [aiRecipes, setAiRecipes] = useState<Recipe[]>([]);
  const [encouragement, setEncouragement] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const constraintOptions = [
    "Under 10 Minutes",
    "No Stove / Microwave Only",
    "Under $1.00 Per Portion",
    "High Protein / Iron",
    "Soft Texture / Easy Chew",
    "Hidden Veggies"
  ];

  const toggleIngredient = (name: string) => {
    if (selectedIngredients.includes(name)) {
      setSelectedIngredients(selectedIngredients.filter((i) => i !== name));
    } else {
      setSelectedIngredients([...selectedIngredients, name]);
    }
  };

  const handleAddCustom = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customInput.trim()) return;
    const item = customInput.trim();
    if (!selectedIngredients.includes(item)) {
      setSelectedIngredients([...selectedIngredients, item]);
    }
    setCustomInput("");
  };

  const toggleConstraint = (c: string) => {
    if (selectedConstraints.includes(c)) {
      setSelectedConstraints(selectedConstraints.filter((item) => item !== c));
    } else {
      setSelectedConstraints([...selectedConstraints, c]);
    }
  };

  // Generate AI recipes via server-side Gemini API
  const handleGenerateAiRecipes = async () => {
    if (selectedIngredients.length === 0) {
      setErrorMessage("Please select at least one pantry item to generate custom meal ideas.");
      return;
    }

    setErrorMessage("");
    setLoading(true);

    try {
      const response = await fetch("/api/gemini/pantry-stretch", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ingredients: selectedIngredients,
          ageGroup:
            ageGroup === "toddler"
              ? "Toddler (1-3 yrs)"
              : ageGroup === "early_child"
              ? "Child (4-7 yrs)"
              : ageGroup === "school_age"
              ? "School Age (8-12 yrs)"
              : "All Ages",
          constraints: selectedConstraints,
        }),
      });

      if (!response.ok) {
        throw new Error("Unable to connect to AI recipe server.");
      }

      const data = await response.json();
      if (data.recipes && Array.isArray(data.recipes)) {
        setAiRecipes(data.recipes);
      }
      if (data.encouragement) {
        setEncouragement(data.encouragement);
      }
    } catch (err: any) {
      console.error(err);
      setErrorMessage(err.message || "Something went wrong generating ideas. You can still view our curated pantry recipes below!");
    } finally {
      setLoading(false);
    }
  };

  // Filter curated static recipes based on selected ingredients
  const matchedCuratedRecipes = CURATED_RECIPES.filter((r) => {
    if (selectedIngredients.length === 0) return true;
    // match if at least one ingredient is present
    return r.ingredientsUsed.some((ing) =>
      selectedIngredients.some((sel) =>
        ing.toLowerCase().includes(sel.toLowerCase()) || sel.toLowerCase().includes(ing.toLowerCase())
      )
    );
  });

  const recipesToDisplay = aiRecipes.length > 0 ? aiRecipes : matchedCuratedRecipes;

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Intro Hero Box */}
      <div className="bg-gradient-to-r from-[#2b2219] to-[#453325] text-white p-6 sm:p-8 rounded-2xl shadow-lg relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-[#d97736]/10 rounded-full blur-3xl pointer-events-none" />
        
        <div className="relative z-10 max-w-2xl space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#d97736]/20 border border-[#d97736]/30 text-xs font-semibold text-[#f7e09e]">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Pantry Miracle Engine</span>
          </div>

          <h2 className="text-2xl sm:text-3xl font-black tracking-tight">
            "I have 4 ingredients... what can I feed my kid right now?"
          </h2>

          <p className="text-sm text-[#d1c2b5] leading-relaxed">
            Select what you currently have in your cabinet or fridge. We’ll generate instant, low-cost, kid-approved recipes engineered for nutrition, soft textures, and tiny budgets.
          </p>
        </div>
      </div>

      {/* Step 1: Ingredient Selection */}
      <div className="bg-[#fffdfa] rounded-2xl border border-[#e8ded1] p-6 space-y-6 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#e8ded1] pb-4">
          <div>
            <h3 className="text-base font-extrabold text-[#2b2219] flex items-center gap-2">
              <ChefHat className="w-5 h-5 text-[#b85a22]" />
              <span>Step 1: Check Off What You Have On Hand</span>
            </h3>
            <p className="text-xs text-[#6e5d50]">Tap items to select them ({selectedIngredients.length} selected)</p>
          </div>

          {/* Quick Clear / Reset */}
          {selectedIngredients.length > 0 && (
            <button
              onClick={() => setSelectedIngredients([])}
              className="text-xs text-[#b85a22] hover:underline font-semibold self-start sm:self-auto"
            >
              Clear Selection
            </button>
          )}
        </div>

        {/* Category Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2.5">
          {COMMON_PANTRY_INGREDIENTS.map((item) => {
            const isSelected = selectedIngredients.includes(item.name);
            return (
              <button
                key={item.id}
                onClick={() => toggleIngredient(item.name)}
                className={`p-3 rounded-xl border text-left text-xs font-semibold transition flex items-start justify-between gap-2 ${
                  isSelected
                    ? "bg-[#2b2219] text-[#fffdfa] border-[#2b2219] shadow-sm"
                    : "bg-[#f9f3ec] text-[#4a3b2c] border-[#e8ded1] hover:bg-[#f2e6db]"
                }`}
              >
                <span className="leading-snug">{item.name}</span>
                <div
                  className={`w-4 h-4 rounded-full flex items-center justify-center shrink-0 mt-0.5 ${
                    isSelected ? "bg-[#b85a22] text-white" : "border border-[#d2c2b2]"
                  }`}
                >
                  {isSelected && <Check className="w-3 h-3 stroke-[3]" />}
                </div>
              </button>
            );
          })}
        </div>

        {/* Add custom item form */}
        <form onSubmit={handleAddCustom} className="flex gap-2 pt-2">
          <input
            type="text"
            value={customInput}
            onChange={(e) => setCustomInput(e.target.value)}
            placeholder="Add another ingredient (e.g. Canned Corn, Squash, Tortillas...)"
            className="flex-1 px-4 py-2.5 rounded-xl border border-[#d2c2b2] bg-white text-xs text-[#2b2219] placeholder-[#9c8b7d] focus:outline-none focus:ring-2 focus:ring-[#b85a22]"
          />
          <button
            type="submit"
            className="px-4 py-2.5 rounded-xl bg-[#e8ded1] text-[#2b2219] hover:bg-[#d9cbbe] font-bold text-xs flex items-center gap-1 transition"
          >
            <Plus className="w-4 h-4" />
            <span>Add</span>
          </button>
        </form>
      </div>

      {/* Step 2: Age Group & Constraints */}
      <div className="grid md:grid-cols-2 gap-6">
        {/* Age Group */}
        <div className="bg-[#fffdfa] rounded-2xl border border-[#e8ded1] p-5 space-y-3 shadow-sm">
          <div className="flex items-center gap-2 text-sm font-extrabold text-[#2b2219]">
            <Baby className="w-4 h-4 text-[#b85a22]" />
            <span>Target Child Age Group</span>
          </div>
          <div className="grid grid-cols-2 gap-2 text-xs font-semibold">
            {[
              { id: "all", label: "All Ages (1-12 yrs)" },
              { id: "toddler", label: "Toddler (1-3 yrs)" },
              { id: "early_child", label: "Early Child (4-7 yrs)" },
              { id: "school_age", label: "School Age (8-12 yrs)" },
            ].map((a) => (
              <button
                key={a.id}
                onClick={() => setAgeGroup(a.id as AgeGroup)}
                className={`py-2.5 px-3 rounded-xl border transition text-center ${
                  ageGroup === a.id
                    ? "bg-[#b85a22] text-white border-[#b85a22] font-bold shadow-sm"
                    : "bg-[#f9f3ec] text-[#544538] border-[#e8ded1] hover:bg-[#f1e6da]"
                }`}
              >
                {a.label}
              </button>
            ))}
          </div>
        </div>

        {/* Preparation Goals */}
        <div className="bg-[#fffdfa] rounded-2xl border border-[#e8ded1] p-5 space-y-3 shadow-sm">
          <div className="flex items-center gap-2 text-sm font-extrabold text-[#2b2219]">
            <Flame className="w-4 h-4 text-[#436a52]" />
            <span>Special Constraints or Goals</span>
          </div>
          <div className="flex flex-wrap gap-2 text-xs font-medium">
            {constraintOptions.map((c) => {
              const isSel = selectedConstraints.includes(c);
              return (
                <button
                  key={c}
                  onClick={() => toggleConstraint(c)}
                  className={`px-3 py-1.5 rounded-lg border transition ${
                    isSel
                      ? "bg-[#436a52] text-white border-[#436a52] font-semibold"
                      : "bg-[#f9f3ec] text-[#544538] border-[#e8ded1] hover:bg-[#f1e6da]"
                  }`}
                >
                  {isSel ? "✓ " : "+ "}{c}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Action Button: Generate via Gemini AI */}
      <div className="text-center space-y-3">
        {errorMessage && (
          <div className="p-3.5 rounded-xl bg-[#fdf2f2] border border-[#f8d7d7] text-xs text-[#b82a2a] font-medium flex items-center justify-center gap-2 max-w-lg mx-auto">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{errorMessage}</span>
          </div>
        )}

        <button
          onClick={handleGenerateAiRecipes}
          disabled={loading}
          className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-gradient-to-r from-[#b85a22] to-[#d97736] text-white font-extrabold text-base shadow-lg hover:brightness-110 active:scale-98 transition flex items-center justify-center gap-3 mx-auto disabled:opacity-50"
        >
          {loading ? (
            <>
              <RefreshCw className="w-5 h-5 animate-spin" />
              <span>Gemini AI is crafting kid-friendly recipes...</span>
            </>
          ) : (
            <>
              <Sparkles className="w-5 h-5 text-[#f7e09e]" />
              <span>Generate AI Meal Ideas From Selected Ingredients</span>
            </>
          )}
        </button>
      </div>

      {/* AI Encouragement note if generated */}
      {encouragement && (
        <div className="p-4 rounded-xl bg-[#f0f7ed] border border-[#c4e2bd] text-xs text-[#214028] font-medium flex items-center gap-3">
          <Heart className="w-5 h-5 text-[#436a52] shrink-0" />
          <p>{encouragement}</p>
        </div>
      )}

      {/* Recipe Cards Output Grid */}
      <div className="space-y-4">
        <div className="flex items-center justify-between border-b border-[#e8ded1] pb-3">
          <h3 className="text-lg font-extrabold text-[#2b2219] flex items-center gap-2">
            <span>{aiRecipes.length > 0 ? "Gemini Custom Meal Ideas" : "Recommended Pantry Meal Ideas"}</span>
            <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-[#f3e8dd] text-[#8a5b28]">
              {recipesToDisplay.length} recipes
            </span>
          </h3>

          {aiRecipes.length > 0 && (
            <button
              onClick={() => setAiRecipes([])}
              className="text-xs text-[#b85a22] font-semibold hover:underline"
            >
              Show Default Curated Set
            </button>
          )}
        </div>

        {recipesToDisplay.length === 0 ? (
          <div className="p-12 text-center bg-[#fffdfa] rounded-2xl border border-dashed border-[#d2c2b2] text-[#6e5d50] space-y-2">
            <p className="font-bold">No exact recipe matches for those specific items.</p>
            <p className="text-xs">Try selecting 2-3 additional items like Oats, Eggs, or Rice, or tap the button above to ask Nourish AI!</p>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 gap-5">
            {recipesToDisplay.map((recipe, index) => {
              const isSaved = savedRecipes.some((s) => s.title === recipe.title);
              return (
                <div
                  key={recipe.id || index}
                  className="bg-[#fffdfa] rounded-2xl border border-[#e8ded1] shadow-sm p-5 hover:shadow-md transition flex flex-col justify-between space-y-4 group"
                >
                  <div className="space-y-3">
                    <div className="flex items-start justify-between gap-2">
                      <span className="text-[11px] font-bold uppercase tracking-wider text-[#436a52] bg-[#e3eedb] px-2.5 py-1 rounded-full">
                        {recipe.estimatedCost}
                      </span>
                      <span className="text-[11px] font-semibold text-[#8a5b28] bg-[#f3e8dd] px-2.5 py-1 rounded-full">
                        {recipe.ageSuitability}
                      </span>
                    </div>

                    <h4 className="text-lg font-bold text-[#2b2219] group-hover:text-[#b85a22] transition">
                      {recipe.title}
                    </h4>

                    <p className="text-xs text-[#544538] leading-relaxed line-clamp-2">
                      {recipe.description}
                    </p>

                    <div className="flex flex-wrap gap-1.5 pt-1">
                      {recipe.ingredientsUsed.map((ing, i) => (
                        <span
                          key={i}
                          className="px-2 py-0.5 rounded-md bg-[#f9f3ec] text-[#6e5d50] text-[11px] border border-[#e8ded1] font-medium"
                        >
                          {ing}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="pt-3 border-t border-[#e8ded1] flex items-center justify-between gap-3">
                    <button
                      onClick={() => onSelectRecipe(recipe)}
                      className="text-xs font-extrabold text-[#b85a22] hover:text-[#91461b] hover:underline flex items-center gap-1"
                    >
                      <span>View Full Recipe & Cooking Steps</span>
                      <span>→</span>
                    </button>

                    <button
                      onClick={() => onToggleSave(recipe)}
                      className={`p-2 rounded-lg border transition text-xs font-semibold flex items-center gap-1 ${
                        isSaved
                          ? "bg-[#436a52] text-white border-[#436a52]"
                          : "bg-[#f9f3ec] text-[#544538] border-[#d2c2b2] hover:bg-[#f1e6da]"
                      }`}
                    >
                      {isSaved ? "Saved" : "+ Save"}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};
