import React, { useState } from "react";
import { Utensils, ShieldCheck, Heart, Sparkles, Check, ChevronRight, AlertCircle, RefreshCw } from "lucide-react";
import { COMMON_SUBSTITUTIONS } from "../data/pantryData";

export const SubstitutionGuideView: React.FC = () => {
  const [activeCategory, setActiveCategory] = useState<"substitutions" | "picky_hacks" | "safety">("substitutions");

  const pickyHacks = [
    {
      title: "Golden Cheese Sauce Trick (Hidden Veggies)",
      issue: "Child refuses green or orange vegetables on the plate.",
      solution: "Boil carrots, butternut squash, or cauliflower until extremely soft. Blend or mash until completely smooth, then stir directly into melted mac & cheese or pasta sauce. The yellow/orange color blends invisibly with cheddar cheese!",
      kidReaction: "Kids love the familiar golden color and rich creamy mouthfeel."
    },
    {
      title: "The Taco Lentil Disguise (Meat Stretcher / Meat-Free)",
      issue: "Ground beef or meat is too expensive or running low.",
      solution: "Cook brown or green lentils with a packet of taco seasoning, garlic powder, and a splash of tomato paste/sauce. Mix 50/50 with ground beef or serve 100% lentil taco meat in quesadillas or rice bowls.",
      kidReaction: "Lentils mimic the exact size and chew of taco ground meat."
    },
    {
      title: "Banana & Oat Pancakes (No Flour, No Refined Sugar)",
      issue: "Out of flour or sugar, or want a high-protein soft breakfast.",
      solution: "Mash 1 ripe banana, 1 egg, and 1/2 cup oats. Cook small silver-dollar discs in a skillet. Serve with applesauce dip.",
      kidReaction: "Sweet, soft, easy to pick up with toddler fingers!"
    },
    {
      title: "Smoothie Ice Pops (Leftover Fruit & Yogurt)",
      issue: "Fruit or spinach is getting soft or going to waste.",
      solution: "Blend soft fruit, yogurt/milk, and a small handful of spinach (or canned peaches). Pour into popsicle molds, ice cube trays, or small plastic cups with wooden spoons. Freeze solid.",
      kidReaction: "Feels like a special dessert or frozen treat!"
    }
  ];

  const safetyGuidelines = [
    {
      age: "Toddlers (1-3 Years)",
      rule: "Choking Hazard Prevention",
      details: "Cut round foods (grapes, hot dogs, cherry tomatoes, banana coins) LENGTHWISE into thin strips, then quarter. Never serve whole nuts or hard raw carrots.",
      action: "Mash beans, flake tuna finely, steam carrots soft."
    },
    {
      age: "Infants (6-12 Months)",
      rule: "Sodium & Honey Limits",
      details: "Never give honey to babies under 12 months (botulism risk). Rinse canned beans and vegetables to wash away excess sodium.",
      action: "Use plain oats cooked in water or breastmilk/formula."
    },
    {
      age: "All Young Children",
      rule: "Temperature Checking",
      details: "Microwaved foods (mugs, oatmeal, mac & cheese) heat unevenly. Hot spots at the bottom can burn delicate tongues.",
      action: "Stir thoroughly and test food on the inside of your wrist before serving."
    }
  ];

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Header */}
      <div className="bg-[#fffdfa] rounded-2xl border border-[#e8ded1] p-6 sm:p-8 space-y-4 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#e8ded1] pb-4">
          <div>
            <span className="text-xs font-bold text-[#b85a22] uppercase tracking-wider block">
              Kitchen Wisdom & Safety
            </span>
            <h2 className="text-2xl font-extrabold text-[#2b2219]">
              Emergency Substitutions & Picky Eater Magic
            </h2>
            <p className="text-xs text-[#6e5d50] mt-1">
              Smart swaps when you're out of ingredients, plus hidden nutrition hacks and toddler safety rules.
            </p>
          </div>

          <div className="flex rounded-xl bg-[#f9f3ec] p-1 border border-[#e8ded1] text-xs font-semibold">
            <button
              onClick={() => setActiveCategory("substitutions")}
              className={`px-3 py-2 rounded-lg transition ${
                activeCategory === "substitutions"
                  ? "bg-[#2b2219] text-[#fffdfa] shadow-sm"
                  : "text-[#6e5d50] hover:text-[#2b2219]"
              }`}
            >
              Missing Item Swaps
            </button>
            <button
              onClick={() => setActiveCategory("picky_hacks")}
              className={`px-3 py-2 rounded-lg transition ${
                activeCategory === "picky_hacks"
                  ? "bg-[#2b2219] text-[#fffdfa] shadow-sm"
                  : "text-[#6e5d50] hover:text-[#2b2219]"
              }`}
            >
              Picky Eater Hacks
            </button>
            <button
              onClick={() => setActiveCategory("safety")}
              className={`px-3 py-2 rounded-lg transition ${
                activeCategory === "safety"
                  ? "bg-[#2b2219] text-[#fffdfa] shadow-sm"
                  : "text-[#6e5d50] hover:text-[#2b2219]"
              }`}
            >
              Toddler Safety
            </button>
          </div>
        </div>

        {/* Tab 1: Missing Item Substitutions */}
        {activeCategory === "substitutions" && (
          <div className="space-y-4 pt-2">
            <p className="text-xs text-[#544538] font-medium">
              Don't have milk, eggs, or fresh meat? You can still make complete, delicious meals for your kids with these proven emergency swaps:
            </p>

            <div className="grid md:grid-cols-2 gap-4">
              {COMMON_SUBSTITUTIONS.map((rule, idx) => (
                <div
                  key={idx}
                  className="bg-[#f9f3ec] rounded-xl border border-[#e8ded1] p-5 space-y-3"
                >
                  <div className="flex items-center justify-between border-b border-[#e2d4c7] pb-2">
                    <h3 className="font-extrabold text-sm text-[#2b2219] flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-[#b85a22]" />
                      <span>Missing: {rule.missingItem}</span>
                    </h3>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-[#e8ded1] text-[#6e5d50]">
                      Best for: {rule.bestFor}
                    </span>
                  </div>

                  <div className="space-y-1.5 text-xs">
                    <p className="font-bold text-[#8a5b28]">Use Any Of These Instead:</p>
                    <ul className="space-y-1 text-[#2b2219]">
                      {rule.substitutes.map((s, i) => (
                        <li key={i} className="flex gap-2 items-start">
                          <Check className="w-3.5 h-3.5 text-[#436a52] shrink-0 mt-0.5" />
                          <span>{s}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {rule.kidSafetyTip && (
                    <div className="p-2.5 rounded-lg bg-[#fff8e7] border border-[#f2deaa] text-[11px] text-[#594211]">
                      <span className="font-bold">Kid Tip: </span>
                      {rule.kidSafetyTip}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Tab 2: Picky Eater Hacks */}
        {activeCategory === "picky_hacks" && (
          <div className="space-y-4 pt-2">
            <p className="text-xs text-[#544538] font-medium">
              Nourishing picky eaters without power struggles or wasted food:
            </p>

            <div className="grid md:grid-cols-2 gap-4">
              {pickyHacks.map((hack, idx) => (
                <div
                  key={idx}
                  className="bg-[#f9f3ec] rounded-xl border border-[#e8ded1] p-5 space-y-3"
                >
                  <div className="flex items-center gap-2 font-extrabold text-sm text-[#2b2219]">
                    <Sparkles className="w-4 h-4 text-[#b85a22]" />
                    <span>{hack.title}</span>
                  </div>

                  <div className="space-y-2 text-xs text-[#2b2219]">
                    <div>
                      <span className="font-bold text-[#8a7a6c] block uppercase text-[10px]">The Challenge</span>
                      <p className="text-[#544538]">{hack.issue}</p>
                    </div>

                    <div>
                      <span className="font-bold text-[#436a52] block uppercase text-[10px]">The Simple Hack</span>
                      <p className="font-medium text-[#2b2219] bg-white p-2.5 rounded-lg border border-[#e8ded1] leading-relaxed">
                        {hack.solution}
                      </p>
                    </div>

                    <div className="p-2 rounded-lg bg-[#e3eedb] text-[#2c5333] font-semibold text-[11px]">
                      Why it works: {hack.kidReaction}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Tab 3: Toddler Safety & Choking Prevention */}
        {activeCategory === "safety" && (
          <div className="space-y-4 pt-2">
            <div className="p-4 rounded-xl bg-[#f0f7ed] border border-[#c4e2bd] text-xs text-[#214028] flex items-center gap-3">
              <ShieldCheck className="w-5 h-5 text-[#436a52] shrink-0" />
              <p className="font-medium">
                Feeding young toddlers safely is as important as what they eat. Here are non-negotiable safety rules for small children:
              </p>
            </div>

            <div className="space-y-3">
              {safetyGuidelines.map((item, idx) => (
                <div
                  key={idx}
                  className="p-4 rounded-xl bg-[#f9f3ec] border border-[#e8ded1] text-xs space-y-1.5"
                >
                  <div className="flex items-center justify-between font-bold text-[#2b2219]">
                    <span className="text-sm text-[#b85a22]">{item.age} — {item.rule}</span>
                  </div>
                  <p className="text-[#544538] leading-relaxed">{item.details}</p>
                  <p className="font-semibold text-[#436a52] bg-white p-2 rounded-lg border border-[#e8ded1]">
                    Key Action: {item.action}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
