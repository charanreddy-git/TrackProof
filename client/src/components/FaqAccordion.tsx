import { useState } from "react";
import { ChevronDownIcon } from "./Icons";

interface FaqItem {
  q: string;
  a: string;
}

interface FaqAccordionProps {
  items: FaqItem[];
}

export function FaqAccordion({ items }: FaqAccordionProps) {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  const toggle = (index: number) => {
    setActiveIndex(activeIndex === index ? null : index);
  };

  return (
    <div className="space-y-3">
      {items.map((faq, index) => {
        const isOpen = activeIndex === index;
        return (
          <div
            key={index}
            className="bg-white border border-surface-200/80 rounded-lg overflow-hidden transition-all duration-300 shadow-sm"
          >
            <button
              type="button"
              onClick={() => toggle(index)}
              className="w-full px-5 py-4 flex items-center justify-between text-left font-bold text-surface-900 hover:bg-surface-50 transition-colors text-xs cursor-pointer"
            >
              <span>{faq.q}</span>
              <ChevronDownIcon
                className={`w-4 h-4 text-surface-400 transition-transform duration-200 ${
                  isOpen ? "rotate-180" : ""
                }`}
              />
            </button>
            {isOpen && (
              <div className="px-5 pb-4 pt-1 text-[11.5px] text-surface-650 leading-relaxed border-t border-surface-100">
                {faq.a}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
