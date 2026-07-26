import React, { useState, useEffect } from "react";
import { Header } from "./components/Header";
import { PantryStretchView } from "./components/PantryStretchView";
import { GroceryBudgetTracker } from "./components/GroceryBudgetTracker";
import { Family7DayPlanView } from "./components/Family7DayPlanView";
import { BudgetPlannerView } from "./components/BudgetPlannerView";
import { SubstitutionGuideView } from "./components/SubstitutionGuideView";
import { EmergencyResourcesView } from "./components/EmergencyResourcesView";
import { NourishAiChat } from "./components/NourishAiChat";
import { SavedRecipesModal } from "./components/SavedRecipesModal";
import { RecipeDetailModal } from "./components/RecipeDetailModal";
import { Recipe } from "./types";
import { Heart, ShieldCheck, PhoneCall, Sparkles } from "lucide-react";

export default function App() {
  const [activeTab, setActiveTab] = useState<string>("pantry");
  const [savedRecipes, setSavedRecipes] = useState<Recipe[]>(() => {
    try {
      const item = localStorage.getItem("nourish_kids_saved_recipes");
      return item ? JSON.parse(item) : [];
    } catch {
      return [];
    }
  });

  const [selectedRecipeDetail, setSelectedRecipeDetail] = useState<Recipe | null>(null);

  useEffect(() => {
    try {
      localStorage.setItem("nourish_kids_saved_recipes", JSON.stringify(savedRecipes));
    } catch (e) {
      console.error("Could not save to localStorage:", e);
    }
  }, [savedRecipes]);

  const toggleSaveRecipe = (recipe: Recipe) => {
    const exists = savedRecipes.some((r) => r.title === recipe.title);
    if (exists) {
      setSavedRecipes(savedRecipes.filter((r) => r.title !== recipe.title));
    } else {
      setSavedRecipes([...savedRecipes, recipe]);
    }
  };

  return (
    <div className="min-h-screen bg-[#f7f2eb] text-[#2b2219] font-sans flex flex-col justify-between selection:bg-[#f7e09e] selection:text-[#2b2219]">
      <div>
        {/* Navigation Bar */}
        <Header
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          savedCount={savedRecipes.length}
        />

        {/* Main Content Workspace */}
        <main className="max-w-6xl mx-auto px-4 sm:px-6 py-6 sm:py-10">
          {activeTab === "pantry" && (
            <PantryStretchView
              onSelectRecipe={(r) => setSelectedRecipeDetail(r)}
              savedRecipes={savedRecipes}
              onToggleSave={toggleSaveRecipe}
            />
          )}

          {activeTab === "tracker" && <GroceryBudgetTracker />}

          {activeTab === "family_7day" && <Family7DayPlanView />}

          {activeTab === "budget" && <BudgetPlannerView />}

          {activeTab === "substitutions" && <SubstitutionGuideView />}

          {activeTab === "resources" && <EmergencyResourcesView />}

          {activeTab === "ai_chat" && <NourishAiChat />}

          {activeTab === "saved" && (
            <SavedRecipesModal
              savedRecipes={savedRecipes}
              onSelectRecipe={(r) => setSelectedRecipeDetail(r)}
              onRemoveSave={toggleSaveRecipe}
              onClose={() => setActiveTab("pantry")}
            />
          )}
        </main>
      </div>

      {/* Recipe Detail Modal */}
      {selectedRecipeDetail && (
        <RecipeDetailModal
          recipe={selectedRecipeDetail}
          onClose={() => setSelectedRecipeDetail(null)}
          onToggleSave={toggleSaveRecipe}
          isSaved={savedRecipes.some((r) => r.title === selectedRecipeDetail.title)}
        />
      )}

      {/* Footer */}
      <footer className="mt-12 border-t border-[#e2d4c7] bg-[#ede3d5] py-8 text-xs text-[#6e5d50]">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-[#b85a22] text-white flex items-center justify-center font-bold">
              <Heart className="w-4 h-4" />
            </div>
            <div>
              <p className="font-extrabold text-[#2b2219]">Nourish Kids — Family Food & Meal Budget Assistant</p>
              <p className="text-[11px] text-[#8a7a6c]">Made with care for every parent, caregiver, and child. Powered by Gemini AI.</p>
            </div>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-4 text-[11px] font-semibold">
            <button
              onClick={() => setActiveTab("resources")}
              className="text-[#b85a22] hover:underline flex items-center gap-1"
            >
              <PhoneCall className="w-3.5 h-3.5" />
              <span>Free 24/7 Food Line: Dial 2-1-1</span>
            </button>
            <span>•</span>
            <button
              onClick={() => setActiveTab("substitutions")}
              className="hover:text-[#2b2219] transition"
            >
              Choking & Toddler Safety
            </button>
            <span>•</span>
            <button
              onClick={() => setActiveTab("budget")}
              className="hover:text-[#2b2219] transition"
            >
              $15/Wk Grocery Meal Plans
            </button>
          </div>
        </div>
      </footer>
    </div>
  );
}
