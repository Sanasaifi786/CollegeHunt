import { create } from "zustand";
import { persist } from "zustand/middleware";
import { CollegeCard } from "@/types";

interface CompareStore {
  selectedColleges: CollegeCard[];
  addCollege: (college: CollegeCard) => boolean;
  removeCollege: (id: string) => void;
  clearColleges: () => void;
  isComparing: (id: string) => boolean;
}

export const useCompareStore = create<CompareStore>()(
  persist(
    (set, get) => ({
      selectedColleges: [],
      addCollege: (college) => {
        const { selectedColleges } = get();
        if (selectedColleges.length >= 4) {
          return false;
        }
        if (selectedColleges.some((c) => c.id === college.id || c.slug === college.slug)) {
          return false;
        }
        set({ selectedColleges: [...selectedColleges, college] });
        return true;
      },
      removeCollege: (id) => {
        set({
          selectedColleges: get().selectedColleges.filter((c) => c.id !== id && c.slug !== id),
        });
      },
      clearColleges: () => set({ selectedColleges: [] }),
      isComparing: (id) => {
        return get().selectedColleges.some((c) => c.id === id || c.slug === id);
      },
    }),
    {
      name: "collegehunt-compare-storage",
    }
  )
);
