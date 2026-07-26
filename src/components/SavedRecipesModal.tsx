import React from "react";
import { Bookmark, Trash2, ArrowRight, Clock, DollarSign, ChefHat } from "lucide-react";
import { Recipe } from "../types";

interface SavedRecipesModalProps {
  savedRecipes: Recipe[];
  onSelectRecipe: (recipe: Recipe) => void;
  onRemoveSave: (recipe: Recipe) => void;
  onClose: () => void;
}

export const SavedRecipesModal: React.FC<SavedRecipesModalProps> = ({
  savedRecipes,
  onSelectRecipe,
  onRemoveSave,
  onClose,
}) => {
  return (
    <div className="space-y-6 animate-fade-in">
      <div className="bg-[#fffdfa] rounded-2xl border border-[#e8ded1] p-6 space-y-4 shadow-sm">
        <div className="flex items-center justify-between border-b border-[#e8ded1] pb-4">
          <div className="flex items-center gap-2">
            <Bookmark className="w-5 h-5 text-[#b85a22]" />
            <h2 className="text-xl font-extrabold text-[#2b2219]">
              Family Recipe Box ({savedRecipes.length})
            </h2>
          </div>
          <p className="text-xs text-[#6e5d50]">Saved recipes persist locally on your device</p>
        </div>

        {savedRecipes.length === 0 ? (
          <div className="p-12 text-center text-[#6e5d50] space-y-3 bg-[#f9f3ec] rounded-2xl border border-dashed border-[#d2c2b2]">
            <ChefHat className="w-10 h-10 mx-auto text-[#b85a22] opacity-60" />
            <h3 className="font-extrabold text-base text-[#2b2219]">Your Recipe Box is Empty</h3>
            <p className="text-xs max-w-md mx-auto">
              Save favorite low-cost meals from the Pantry Miracle or Budget Plans tabs so you can access them quickly anytime!
            </p>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 gap-4">
            {savedRecipes.map((recipe, idx) => (
              <div
                key={recipe.id || idx}
                className="bg-[#f9f3ec] rounded-xl border border-[#e8ded1] p-5 flex flex-col justify-between space-y-3"
              >
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-bold text-[#436a52] bg-[#e3eedb] px-2.5 py-0.5 rounded-full">
                      {recipe.estimatedCost}
                    </span>
                    <button
                      onClick={() => onRemoveSave(recipe)}
                      className="p-1 rounded-md text-[#b82a2a] hover:bg-[#f2d0d0] transition"
                      title="Remove from saved"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>

                  <h3 className="font-extrabold text-base text-[#2b2219]">
                    {recipe.title}
                  </h3>

                  <p className="text-xs text-[#544538] line-clamp-2">
                    {recipe.description}
                  </p>
                </div>

                <div className="pt-2 border-t border-[#e2d4c7] flex items-center justify-between">
                  <span className="text-[11px] font-semibold text-[#8a5b28]">
                    {recipe.ageSuitability}
                  </span>

                  <button
                    onClick={() => onSelectRecipe(recipe)}
                    className="text-xs font-bold text-[#b85a22] hover:underline flex items-center gap-1"
                  >
                    <span>View Recipe</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
