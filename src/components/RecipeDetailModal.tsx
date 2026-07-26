import React from "react";
import { X, Clock, DollarSign, Baby, Bookmark, Check, ShieldCheck, Lightbulb, Sparkles, Heart } from "lucide-react";
import { Recipe } from "../types";

interface RecipeDetailModalProps {
  recipe: Recipe | null;
  onClose: () => void;
  onToggleSave: (recipe: Recipe) => void;
  isSaved: boolean;
}

export const RecipeDetailModal: React.FC<RecipeDetailModalProps> = ({
  recipe,
  onClose,
  onToggleSave,
  isSaved,
}) => {
  if (!recipe) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fade-in">
      <div className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto bg-[#fffdfa] rounded-2xl border border-[#e8ded1] shadow-2xl p-6 sm:p-8 space-y-6 text-[#2b2219]">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-full hover:bg-[#f3e8dd] text-[#6e5d50] transition"
          aria-label="Close"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="space-y-3 pr-8">
          <div className="flex flex-wrap items-center gap-2 text-xs font-semibold text-[#8a5b28]">
            <span className="px-2.5 py-1 rounded-full bg-[#f3e8dd] text-[#2b2219]">
              {recipe.estimatedCost}
            </span>
            <span className="px-2.5 py-1 rounded-full bg-[#e3eedb] text-[#2c5333]">
              {recipe.nutritionHighlight || "Nutritious & Budget Friendly"}
            </span>
          </div>

          <h2 className="text-2xl sm:text-3xl font-extrabold text-[#2b2219] leading-tight">
            {recipe.title}
          </h2>

          <p className="text-sm text-[#544538] leading-relaxed">
            {recipe.description}
          </p>

          {/* Quick Metrics */}
          <div className="grid grid-cols-3 gap-2 pt-2 text-xs text-[#544538]">
            <div className="flex items-center gap-1.5 p-2.5 rounded-xl bg-[#f9f3ec] border border-[#e8ded1]">
              <Clock className="w-4 h-4 text-[#b85a22] shrink-0" />
              <div>
                <p className="text-[10px] text-[#8a7a6c] uppercase font-bold">Prep & Cook</p>
                <p className="font-semibold">{recipe.prepTime} + {recipe.cookTime}</p>
              </div>
            </div>

            <div className="flex items-center gap-1.5 p-2.5 rounded-xl bg-[#f9f3ec] border border-[#e8ded1]">
              <DollarSign className="w-4 h-4 text-[#436a52] shrink-0" />
              <div>
                <p className="text-[10px] text-[#8a7a6c] uppercase font-bold">Est. Cost</p>
                <p className="font-semibold">{recipe.estimatedCost}</p>
              </div>
            </div>

            <div className="flex items-center gap-1.5 p-2.5 rounded-xl bg-[#f9f3ec] border border-[#e8ded1]">
              <Baby className="w-4 h-4 text-[#d97736] shrink-0" />
              <div>
                <p className="text-[10px] text-[#8a7a6c] uppercase font-bold">Best For</p>
                <p className="font-semibold truncate">{recipe.ageSuitability}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Ingredients section */}
        <div className="space-y-2 pt-2 border-t border-[#e8ded1]">
          <h3 className="text-sm font-bold uppercase tracking-wider text-[#8a5b28]">
            Ingredients Needed
          </h3>
          <div className="flex flex-wrap gap-2">
            {recipe.ingredientsUsed.map((ing, i) => (
              <span
                key={i}
                className="px-3 py-1 rounded-lg text-xs font-semibold bg-[#f3e8dd] text-[#2b2219] border border-[#e2d4c7]"
              >
                ✓ {ing}
              </span>
            ))}
            {recipe.pantryAdditions && recipe.pantryAdditions.length > 0 && (
              recipe.pantryAdditions.map((add, i) => (
                <span
                  key={`add-${i}`}
                  className="px-3 py-1 rounded-lg text-xs font-medium bg-[#f9f3ec] text-[#6e5d50] border border-[#e8ded1] italic"
                >
                  + {add}
                </span>
              ))
            )}
          </div>
        </div>

        {/* Step-by-Step Instructions */}
        <div className="space-y-3 pt-2 border-t border-[#e8ded1]">
          <h3 className="text-sm font-bold uppercase tracking-wider text-[#8a5b28]">
            Simple Step-by-Step Preparation
          </h3>
          <ol className="space-y-2.5">
            {recipe.instructions.map((step, idx) => (
              <li key={idx} className="flex gap-3 text-sm text-[#2b2219] leading-relaxed">
                <span className="flex-shrink-0 w-6 h-6 rounded-full bg-[#b85a22] text-white text-xs font-bold flex items-center justify-center mt-0.5">
                  {idx + 1}
                </span>
                <span>{step}</span>
              </li>
            ))}
          </ol>
        </div>

        {/* Kid Hacks & Texture Tips */}
        {recipe.kidHacks && (
          <div className="p-4 rounded-xl bg-[#fff8e7] border border-[#f2deaa] text-xs space-y-1">
            <div className="flex items-center gap-1.5 text-[#916212] font-bold">
              <Lightbulb className="w-4 h-4 shrink-0" />
              <span>Kid-Approved Hack & Texture Tip</span>
            </div>
            <p className="text-[#594211] leading-relaxed">{recipe.kidHacks}</p>
          </div>
        )}

        {/* Toddler Safety Note */}
        {recipe.safetyNote && (
          <div className="p-3.5 rounded-xl bg-[#f0f7ed] border border-[#c4e2bd] text-xs space-y-1">
            <div className="flex items-center gap-1.5 text-[#2c5333] font-bold">
              <ShieldCheck className="w-4 h-4 shrink-0" />
              <span>Toddler & Small Child Safety Note</span>
            </div>
            <p className="text-[#214028] leading-relaxed">{recipe.safetyNote}</p>
          </div>
        )}

        {/* Footer Actions */}
        <div className="pt-4 border-t border-[#e8ded1] flex items-center justify-between gap-4">
          <button
            onClick={() => onToggleSave(recipe)}
            className={`flex-1 py-3 px-4 rounded-xl font-bold text-sm flex items-center justify-center gap-2 transition ${
              isSaved
                ? "bg-[#436a52] text-white shadow-sm"
                : "bg-[#2b2219] text-white hover:bg-[#3f3126]"
            }`}
          >
            {isSaved ? (
              <>
                <Check className="w-4 h-4" />
                <span>Saved to Family Recipe Box</span>
              </>
            ) : (
              <>
                <Bookmark className="w-4 h-4 text-[#f7e09e]" />
                <span>Save Recipe to Favorites</span>
              </>
            )}
          </button>

          <button
            onClick={onClose}
            className="py-3 px-5 rounded-xl border border-[#d2c2b2] text-sm font-semibold text-[#544538] hover:bg-[#f3e8dd] transition"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
