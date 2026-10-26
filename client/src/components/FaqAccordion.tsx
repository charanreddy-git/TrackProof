import { useId, useState } from "react";
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
  const baseId = useId();

  return (
    <div className="space-y-3">
      {items.map((faq, index) => {
        const isOpen = activeIndex === index;
        const answerId = `${baseId}-answer-${index}`;

        return (
          <div
            key={faq.q}
            className="overflow-hidden rounded-xl border border-surface-200 bg-white"
          >
            <button
              type="button"
              onClick={() => setActiveIndex(isOpen ? null : index)}
              aria-expanded={isOpen}
              aria-controls={answerId}
              className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left text-[15px] font-semibold text-surface-900 transition-colors hover:bg-surface-50"
            >
              <span>{faq.q}</span>
              <ChevronDownIcon
                size={18}
                className={`flex-shrink-0 text-surface-500 transition-transform duration-200 ${
                  isOpen ? "rotate-180" : ""
                }`}
              />
            </button>
            {isOpen && (
              <div
                id={answerId}
                className="border-t border-surface-100 px-5 pb-5 pt-3 text-sm leading-relaxed text-surface-600"
              >
                {faq.a}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
