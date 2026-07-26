import React, { useState } from "react";
import { ShieldAlert, HeartHandshake, PhoneCall, ExternalLink, MapPin, CheckSquare, Info, Sparkles, Copy, Check } from "lucide-react";
import { FOOD_RESOURCES } from "../data/communityResources";

export const EmergencyResourcesView: React.FC = () => {
  const [copiedText, setCopiedText] = useState("");

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    setCopiedText(label);
    setTimeout(() => setCopiedText(""), 2500);
  };

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Zero Stigma Compassionate Banner */}
      <div className="bg-gradient-to-r from-[#912d2b] to-[#b8423f] text-white p-6 sm:p-8 rounded-2xl shadow-md space-y-4">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/20 text-xs font-bold text-[#f7e09e]">
          <ShieldAlert className="w-4 h-4" />
          <span>Immediate Family Food Support Directory</span>
        </div>

        <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
          You are a loving parent, and asking for support is an act of care.
        </h2>

        <p className="text-xs sm:text-sm text-[#fce8e6] leading-relaxed max-w-3xl">
          Food banks, WIC clinics, SNAP benefits, and school meal programs exist specifically for families like yours. Every child has a right to be fed well. Here is how to access free food immediately with zero judgment.
        </p>

        {/* Urgent Hotline Bar */}
        <div className="pt-2 flex flex-wrap items-center gap-3 text-xs">
          <div className="px-4 py-2.5 rounded-xl bg-white text-[#912d2b] font-extrabold flex items-center gap-2 shadow-sm">
            <PhoneCall className="w-4 h-4" />
            <span>Call 2-1-1 (Free 24/7 Local Food & Shelter Line)</span>
          </div>

          <div className="px-4 py-2.5 rounded-xl bg-white/10 text-white font-semibold flex items-center gap-2 border border-white/20">
            <span>USDA Hunger Hotline: 1-866-3-HUNGRY</span>
          </div>
        </div>
      </div>

      {/* Program Resource Directory Cards */}
      <div className="space-y-5">
        <h3 className="text-lg font-extrabold text-[#2b2219] flex items-center gap-2 border-b border-[#e8ded1] pb-3">
          <HeartHandshake className="w-5 h-5 text-[#b85a22]" />
          <span>Primary Free Food Assistance Programs</span>
        </h3>

        <div className="grid md:grid-cols-2 gap-5">
          {FOOD_RESOURCES.map((resource) => (
            <div
              key={resource.id}
              className="bg-[#fffdfa] rounded-2xl border border-[#e8ded1] p-6 space-y-4 shadow-sm hover:shadow-md transition flex flex-col justify-between"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between gap-2 border-b border-[#e8ded1] pb-3">
                  <span className="text-xs font-bold uppercase tracking-wider text-[#b85a22] bg-[#f3e8dd] px-2.5 py-1 rounded-full">
                    {resource.name}
                  </span>
                  {resource.linkUrl && (
                    <a
                      href={resource.linkUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs font-bold text-[#436a52] hover:underline flex items-center gap-1"
                    >
                      <span>Official Site</span>
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                  )}
                </div>

                <h4 className="text-base font-extrabold text-[#2b2219]">
                  {resource.title}
                </h4>

                <p className="text-xs text-[#544538] leading-relaxed">
                  {resource.summary}
                </p>

                <div className="p-3 rounded-xl bg-[#f9f3ec] border border-[#e8ded1] text-xs space-y-1">
                  <span className="font-bold text-[#2b2219] block text-[11px]">Who Qualifies?</span>
                  <p className="text-[#6e5d50] leading-snug">{resource.eligibility}</p>
                </div>

                <div className="space-y-1 text-xs">
                  <span className="font-bold text-[#8a5b28] block text-[11px] uppercase">How To Access / Apply</span>
                  <ul className="space-y-1 text-[#2b2219]">
                    {resource.howToApply.map((step, idx) => (
                      <li key={idx} className="flex items-start gap-2">
                        <span className="text-[#b85a22] font-bold">•</span>
                        <span>{step}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Urgent Action Tip */}
              <div className="pt-3 border-t border-[#e8ded1] text-xs space-y-2">
                <div className="p-2.5 rounded-lg bg-[#fff8e7] border border-[#f2deaa] text-[#594211] font-medium text-[11px]">
                  <span className="font-bold text-[#916212]">Urgent Tip: </span>
                  {resource.urgentTips}
                </div>

                <div className="flex items-center justify-between text-xs text-[#2b2219] font-semibold pt-1">
                  <span className="truncate pr-2">Contact: {resource.contactInfo}</span>
                  <button
                    onClick={() => copyToClipboard(resource.contactInfo, resource.id)}
                    className="p-1.5 rounded-md hover:bg-[#f3e8dd] text-[#6e5d50] flex items-center gap-1 shrink-0 transition"
                    title="Copy contact info"
                  >
                    {copiedText === resource.id ? (
                      <Check className="w-4 h-4 text-[#436a52]" />
                    ) : (
                      <Copy className="w-4 h-4" />
                    )}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Action Checklist For Emergency Food Access */}
      <div className="bg-[#fffdfa] rounded-2xl border border-[#e8ded1] p-6 space-y-4 shadow-sm">
        <h3 className="text-base font-extrabold text-[#2b2219] flex items-center gap-2">
          <CheckSquare className="w-5 h-5 text-[#436a52]" />
          <span>Emergency Pantry Action Checklist (When Food is Running Very Low)</span>
        </h3>

        <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-3 text-xs text-[#2b2219]">
          <div className="p-3.5 rounded-xl bg-[#f9f3ec] border border-[#e8ded1] space-y-1">
            <span className="font-bold text-[#b85a22] block">1. Dial 2-1-1 Immediately</span>
            <p className="text-[#6e5d50]">Ask operator for nearest emergency food pantry open today, or mobile produce distribution locations.</p>
          </div>

          <div className="p-3.5 rounded-xl bg-[#f9f3ec] border border-[#e8ded1] space-y-1">
            <span className="font-bold text-[#b85a22] block">2. Text "FOOD" to 304-304</span>
            <p className="text-[#6e5d50]">USDA automated service that locates free summer and after-school meal sites for kids in your zip code.</p>
          </div>

          <div className="p-3.5 rounded-xl bg-[#f9f3ec] border border-[#e8ded1] space-y-1">
            <span className="font-bold text-[#b85a22] block">3. Ask for "Expedited SNAP"</span>
            <p className="text-[#6e5d50]">If you have under $100 in cash, state law requires SNAP applications to be processed in 7 days or less.</p>
          </div>
        </div>
      </div>
    </div>
  );
};
