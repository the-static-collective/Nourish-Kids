import React from "react";
import { HeartHandshake, Sparkles, ShoppingBag, ShieldAlert, Bot, Bookmark, ArrowRight, Utensils } from "lucide-react";

interface HeaderProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  savedCount: number;
}

export const Header: React.FC<HeaderProps> = ({ activeTab, setActiveTab, savedCount }) => {
  return (
    <header className="sticky top-0 z-40 bg-[#fffdfa]/90 backdrop-blur-md border-b border-[#e8ded1]">
      {/* Top Emergency Care Banner */}
      <div className="bg-[#5b7352] text-white py-1.5 px-4 text-xs sm:text-sm font-medium flex items-center justify-between flex-wrap gap-2">
        <div className="flex items-center gap-2">
          <HeartHandshake className="w-4 h-4 shrink-0 text-[#f7e09e]" />
          <span>Every parent deserves a full pantry. Free food resources, SNAP & WIC guides available below.</span>
        </div>
        <button
          onClick={() => setActiveTab("resources")}
          className="underline decoration-1 underline-offset-2 hover:text-[#f7e09e] transition flex items-center gap-1 text-xs font-semibold"
        >
          <span>Find Relief Resources</span>
          <ArrowRight className="w-3 h-3" />
        </button>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3.5 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        {/* Brand logo & tagline */}
        <div className="flex items-center justify-between">
          <div
            onClick={() => setActiveTab("pantry")}
            className="flex items-center gap-3 cursor-pointer group"
          >
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#d97736] to-[#b85a22] flex items-center justify-center text-white shadow-sm group-hover:scale-105 transition-transform">
              <Utensils className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl font-bold tracking-tight text-[#2b2219]">Nourish Kids</h1>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-[#f3e3d3] text-[#91461b]">
                  Family Food Assistant
                </span>
              </div>
              <p className="text-xs text-[#6e5d50]">Stretching pantries • Nourishing growing kids with zero judgment</p>
            </div>
          </div>

          {/* Mobile Saved Items Quick Pill */}
          <button
            onClick={() => setActiveTab("saved")}
            className="md:hidden flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-[#d2c2b2] bg-[#f9f3ec] text-xs font-semibold text-[#4a3b2c]"
          >
            <Bookmark className="w-3.5 h-3.5 text-[#b85a22]" />
            <span>Saved ({savedCount})</span>
          </button>
        </div>

        {/* Primary Navigation Tabs */}
        <nav className="flex items-center gap-1.5 overflow-x-auto pb-1 md:pb-0 scrollbar-none text-xs sm:text-sm font-semibold">
          <button
            onClick={() => setActiveTab("pantry")}
            className={`flex items-center gap-2 px-3 py-2 rounded-xl transition whitespace-nowrap ${
              activeTab === "pantry"
                ? "bg-[#2b2219] text-[#fffdfa] shadow-sm"
                : "text-[#544538] hover:bg-[#f3e8dd]"
            }`}
          >
            <Sparkles className={`w-4 h-4 ${activeTab === "pantry" ? "text-[#f7e09e]" : "text-[#b85a22]"}`} />
            <span>Pantry Miracle</span>
          </button>

          <button
            onClick={() => setActiveTab("tracker")}
            className={`flex items-center gap-2 px-3 py-2 rounded-xl transition whitespace-nowrap ${
              activeTab === "tracker"
                ? "bg-[#2b2219] text-[#fffdfa] shadow-sm"
                : "text-[#544538] hover:bg-[#f3e8dd]"
            }`}
          >
            <ShoppingBag className="w-4 h-4 text-[#436a52]" />
            <span>Grocery Tracker</span>
          </button>

          <button
            onClick={() => setActiveTab("family_7day")}
            className={`flex items-center gap-2 px-3 py-2 rounded-xl transition whitespace-nowrap ${
              activeTab === "family_7day"
                ? "bg-[#2b2219] text-[#fffdfa] shadow-sm"
                : "text-[#544538] hover:bg-[#f3e8dd]"
            }`}
          >
            <Utensils className="w-4 h-4 text-[#b85a22]" />
            <span>7-Day Meal Plan</span>
          </button>

          <button
            onClick={() => setActiveTab("budget")}
            className={`flex items-center gap-2 px-3 py-2 rounded-xl transition whitespace-nowrap ${
              activeTab === "budget"
                ? "bg-[#2b2219] text-[#fffdfa] shadow-sm"
                : "text-[#544538] hover:bg-[#f3e8dd]"
            }`}
          >
            <span>$15/Wk Plans</span>
          </button>

          <button
            onClick={() => setActiveTab("substitutions")}
            className={`flex items-center gap-2 px-3 py-2 rounded-xl transition whitespace-nowrap ${
              activeTab === "substitutions"
                ? "bg-[#2b2219] text-[#fffdfa] shadow-sm"
                : "text-[#544538] hover:bg-[#f3e8dd]"
            }`}
          >
            <span>Substitutions</span>
          </button>

          <button
            onClick={() => setActiveTab("resources")}
            className={`flex items-center gap-2 px-3 py-2 rounded-xl transition whitespace-nowrap ${
              activeTab === "resources"
                ? "bg-[#2b2219] text-[#fffdfa] shadow-sm"
                : "text-[#544538] hover:bg-[#f3e8dd]"
            }`}
          >
            <ShieldAlert className="w-4 h-4 text-[#c0392b]" />
            <span>2-1-1 Food Help</span>
          </button>

          <button
            onClick={() => setActiveTab("ai_chat")}
            className={`flex items-center gap-2 px-3 py-2 rounded-xl transition whitespace-nowrap ${
              activeTab === "ai_chat"
                ? "bg-[#b85a22] text-[#fffdfa] shadow-sm"
                : "text-[#b85a22] bg-[#f7ebe1] hover:bg-[#f2dec4]"
            }`}
          >
            <Bot className="w-4 h-4" />
            <span>Ask AI</span>
          </button>

          <button
            onClick={() => setActiveTab("saved")}
            className={`hidden md:flex items-center gap-2 px-3 py-2 rounded-xl transition whitespace-nowrap border ${
              activeTab === "saved"
                ? "bg-[#2b2219] text-[#fffdfa] border-[#2b2219]"
                : "bg-[#f9f3ec] text-[#4a3b2c] border-[#d2c2b2] hover:bg-[#f1e6da]"
            }`}
          >
            <Bookmark className="w-4 h-4 text-[#b85a22]" />
            <span>Saved ({savedCount})</span>
          </button>
        </nav>
      </div>
    </header>
  );
};
