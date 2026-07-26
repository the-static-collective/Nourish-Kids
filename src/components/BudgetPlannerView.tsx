import React, { useState } from "react";
import { ShoppingBag, Calendar, Lightbulb, CheckCircle2, DollarSign, TrendingDown, Layers, ArrowRight } from "lucide-react";
import { BUDGET_MEAL_PLANS } from "../data/communityResources";
import { BudgetMealPlan } from "../types";

export const BudgetPlannerView: React.FC = () => {
  const [selectedPlanId, setSelectedPlanId] = useState<string>("plan-15-week");
  const activePlan: BudgetMealPlan = BUDGET_MEAL_PLANS.find((p) => p.id === selectedPlanId) || BUDGET_MEAL_PLANS[0];

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Hero Header */}
      <div className="bg-[#2b2219] text-[#fffdfa] p-6 sm:p-8 rounded-2xl shadow-md space-y-3">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#436a52] text-xs font-bold text-[#e3eedb]">
          <ShoppingBag className="w-3.5 h-3.5" />
          <span>Micro-Budget Meal Planner & Grocery Maximizer</span>
        </div>

        <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
          Feeding a child for $15 - $28 per week
        </h2>

        <p className="text-xs sm:text-sm text-[#d1c2b5] leading-relaxed max-w-2xl">
          High-yield staples (oats, eggs, peanut butter, lentils, frozen produce) engineered into full 7-day menus with zero food waste. Every dollar delivers maximum protein, iron, and kid-friendly energy.
        </p>
      </div>

      {/* Plan Switcher Tabs */}
      <div className="flex flex-col sm:flex-row gap-3">
        {BUDGET_MEAL_PLANS.map((plan) => {
          const isSel = plan.id === selectedPlanId;
          return (
            <button
              key={plan.id}
              onClick={() => setSelectedPlanId(plan.id)}
              className={`flex-1 p-5 rounded-2xl border text-left transition flex items-center justify-between gap-4 ${
                isSel
                  ? "bg-[#fffdfa] border-[#b85a22] ring-2 ring-[#b85a22]/20 shadow-md"
                  : "bg-[#f9f3ec] border-[#e8ded1] text-[#6e5d50] hover:bg-[#f1e6da]"
              }`}
            >
              <div>
                <span className="text-xs font-bold text-[#b85a22] uppercase tracking-wider block">
                  {plan.targetAge}
                </span>
                <span className="text-xl font-extrabold text-[#2b2219]">
                  {plan.weeklyBudget}
                </span>
                <p className="text-xs text-[#6e5d50] mt-0.5">7 Days • 21 Meals + 7 Snacks</p>
              </div>

              <div
                className={`w-6 h-6 rounded-full border-2 flex items-center justify-center shrink-0 ${
                  isSel ? "border-[#b85a22] bg-[#b85a22] text-white" : "border-[#d2c2b2]"
                }`}
              >
                {isSel && <CheckCircle2 className="w-4 h-4" />}
              </div>
            </button>
          );
        })}
      </div>

      {/* Grocery Shopping List & Yield */}
      <div className="bg-[#fffdfa] rounded-2xl border border-[#e8ded1] p-6 space-y-4 shadow-sm">
        <div className="flex items-center justify-between border-b border-[#e8ded1] pb-3">
          <div>
            <h3 className="text-base font-extrabold text-[#2b2219] flex items-center gap-2">
              <ShoppingBag className="w-5 h-5 text-[#436a52]" />
              <span>Target Grocery List ({activePlan.weeklyBudget})</span>
            </h3>
            <p className="text-xs text-[#6e5d50]">Store-brand or EBT/SNAP estimated prices</p>
          </div>
          <span className="text-xs font-bold px-3 py-1 rounded-full bg-[#e3eedb] text-[#2c5333]">
            {activePlan.weeklyGroceries.length} Key Staples
          </span>
        </div>

        <div className="grid sm:grid-cols-2 md:grid-cols-4 gap-3">
          {activePlan.weeklyGroceries.map((item, idx) => (
            <div
              key={idx}
              className="p-3.5 rounded-xl bg-[#f9f3ec] border border-[#e8ded1] space-y-1 text-xs"
            >
              <div className="flex items-center justify-between font-bold text-[#2b2219]">
                <span className="truncate pr-1">{item.item}</span>
                <span className="text-[#436a52] shrink-0">{item.estCost}</span>
              </div>
              <p className="text-[11px] text-[#8a7a6c] leading-tight">
                Yields: <span className="font-semibold text-[#544538]">{item.yieldMeals}</span>
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* 7-Day Menu Breakdown */}
      <div className="bg-[#fffdfa] rounded-2xl border border-[#e8ded1] p-6 space-y-5 shadow-sm">
        <div className="flex items-center gap-2 border-b border-[#e8ded1] pb-3 text-base font-extrabold text-[#2b2219]">
          <Calendar className="w-5 h-5 text-[#b85a22]" />
          <span>7-Day Kid Menu Plan</span>
        </div>

        <div className="space-y-3">
          {activePlan.dailyMenu.map((m, i) => (
            <div
              key={i}
              className="p-4 rounded-xl bg-[#f9f3ec] border border-[#e8ded1] flex flex-col md:flex-row md:items-center justify-between gap-3 text-xs"
            >
              <div className="md:w-28 font-bold text-[#8a5b28] uppercase tracking-wider text-sm">
                {m.day}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-4 gap-2 flex-1 text-[#2b2219]">
                <div className="p-2 rounded-lg bg-white border border-[#e8ded1]">
                  <span className="text-[10px] font-bold uppercase text-[#8a7a6c] block">Breakfast</span>
                  <span className="font-semibold">{m.breakfast}</span>
                </div>

                <div className="p-2 rounded-lg bg-white border border-[#e8ded1]">
                  <span className="text-[10px] font-bold uppercase text-[#8a7a6c] block">Lunch</span>
                  <span className="font-semibold">{m.lunch}</span>
                </div>

                <div className="p-2 rounded-lg bg-white border border-[#e8ded1]">
                  <span className="text-[10px] font-bold uppercase text-[#8a7a6c] block">Dinner</span>
                  <span className="font-semibold">{m.dinner}</span>
                </div>

                <div className="p-2 rounded-lg bg-white border border-[#e8ded1]">
                  <span className="text-[10px] font-bold uppercase text-[#8a7a6c] block">Snack</span>
                  <span className="font-semibold text-[#8a5b28]">{m.snack}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Pro Stretch Strategies */}
      <div className="bg-[#fff8e7] rounded-2xl border border-[#f2deaa] p-6 space-y-4 text-xs text-[#594211]">
        <div className="flex items-center gap-2 text-sm font-extrabold text-[#916212]">
          <Lightbulb className="w-5 h-5 shrink-0" />
          <span>Pro Pantry Stretch Hacks for Families</span>
        </div>

        <ul className="grid sm:grid-cols-3 gap-4">
          {activePlan.stretchProTips.map((tip, idx) => (
            <li key={idx} className="p-3.5 rounded-xl bg-white/80 border border-[#f2deaa] leading-relaxed space-y-1">
              <span className="font-bold text-[#8a5b28] block">Hack #{idx + 1}</span>
              <p>{tip}</p>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};
