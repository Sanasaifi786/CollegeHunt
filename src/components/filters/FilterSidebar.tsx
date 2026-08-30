"use client";

import { useState } from "react";
import { Filter, RotateCcw } from "lucide-react";
import { CollegeType } from "@/types";

interface FilterSidebarProps {
  selectedType: string[];
  onTypeChange: (types: string[]) => void;
  selectedState: string;
  onStateChange: (state: string) => void;
  selectedAccreditation: string[];
  onAccreditationChange: (acc: string[]) => void;
  maxFees: number;
  onMaxFeesChange: (fees: number) => void;
  onReset: () => void;
}

export default function FilterSidebar({
  selectedType,
  onTypeChange,
  selectedState,
  onStateChange,
  selectedAccreditation,
  onAccreditationChange,
  maxFees,
  onMaxFeesChange,
  onReset,
}: FilterSidebarProps) {
  const institutionTypes: { label: string; value: CollegeType }[] = [
    { label: "Public / Govt", value: "GOVERNMENT" },
    { label: "Private", value: "PRIVATE" },
    { label: "Deemed University", value: "DEEMED" },
    { label: "Autonomous", value: "AUTONOMOUS" },
  ];

  const accredOptions = ["A++", "A+", "A", "B++"];

  const states = [
    "All States",
    "Maharashtra",
    "Delhi",
    "Tamil Nadu",
    "Karnataka",
    "Uttar Pradesh",
    "Telangana",
    "West Bengal",
    "Rajasthan",
  ];

  const handleTypeToggle = (val: string) => {
    if (selectedType.includes(val)) {
      onTypeChange(selectedType.filter((t) => t !== val));
    } else {
      onTypeChange([...selectedType, val]);
    }
  };

  const handleAccredToggle = (val: string) => {
    if (selectedAccreditation.includes(val)) {
      onAccreditationChange(selectedAccreditation.filter((a) => a !== val));
    } else {
      onAccreditationChange([...selectedAccreditation, val]);
    }
  };

  return (
    <div className="w-full rounded-2xl border border-slate-200/90 bg-white p-5 shadow-xs">
      <div className="flex items-center justify-between border-b border-slate-100 pb-4">
        <div className="flex items-center gap-2">
          <Filter className="h-4 w-4 text-blue-600" />
          <h2 className="text-sm font-bold text-slate-900">Refine Search</h2>
        </div>
        <button
          onClick={onReset}
          className="flex items-center gap-1 text-xs font-medium text-slate-400 hover:text-blue-600 transition"
        >
          <RotateCcw className="h-3 w-3" />
          <span>Reset</span>
        </button>
      </div>

      <div className="mt-5 space-y-6">
        {/* Institution Type */}
        <div>
          <label className="text-xs font-semibold uppercase tracking-wider text-slate-500">
            Institution Type
          </label>
          <div className="mt-3 space-y-2">
            {institutionTypes.map((type) => {
              const isChecked = selectedType.includes(type.value);
              return (
                <label
                  key={type.value}
                  className="flex items-center gap-2.5 text-xs text-slate-700 cursor-pointer hover:text-slate-900"
                >
                  <input
                    type="checkbox"
                    checked={isChecked}
                    onChange={() => handleTypeToggle(type.value)}
                    className="h-4 w-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500/20"
                  />
                  <span>{type.label}</span>
                </label>
              );
            })}
          </div>
        </div>

        {/* State / Location */}
        <div>
          <label className="text-xs font-semibold uppercase tracking-wider text-slate-500">
            State / Region
          </label>
          <div className="mt-2">
            <select
              value={selectedState}
              onChange={(e) => onStateChange(e.target.value)}
              className="w-full rounded-xl border border-slate-200 bg-slate-50/50 p-2 text-xs text-slate-800 outline-none transition focus:border-blue-500 focus:bg-white"
            >
              {states.map((s) => (
                <option key={s} value={s === "All States" ? "" : s}>
                  {s}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Max Annual Fees */}
        <div>
          <div className="flex items-center justify-between text-xs">
            <label className="font-semibold uppercase tracking-wider text-slate-500">
              Max Tuition / Fees
            </label>
            <span className="font-bold text-blue-600">
              {maxFees >= 500000 ? "Any Fees" : `₹${(maxFees / 100000).toFixed(1)} Lakh`}
            </span>
          </div>
          <input
            type="range"
            min={50000}
            max={500000}
            step={25000}
            value={maxFees}
            onChange={(e) => onMaxFeesChange(Number(e.target.value))}
            className="mt-2.5 w-full accent-blue-600 cursor-pointer"
          />
          <div className="flex justify-between text-[10px] text-slate-400 mt-1">
            <span>₹50K</span>
            <span>₹2.5L</span>
            <span>₹5L+</span>
          </div>
        </div>

        {/* NAAC Accreditation */}
        <div>
          <label className="text-xs font-semibold uppercase tracking-wider text-slate-500">
            NAAC Grade
          </label>
          <div className="mt-2.5 flex flex-wrap gap-2">
            {accredOptions.map((acc) => {
              const isSelected = selectedAccreditation.includes(acc);
              return (
                <button
                  key={acc}
                  type="button"
                  onClick={() => handleAccredToggle(acc)}
                  className={`rounded-lg px-2.5 py-1 text-xs font-semibold transition ${
                    isSelected
                      ? "bg-blue-600 text-white shadow-xs"
                      : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                  }`}
                >
                  {acc}
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}