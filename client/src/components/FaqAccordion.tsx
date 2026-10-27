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
  const [activeIndex, setActiveIndex] = useState<number | null>(0);
  const baseId = useId();

  return (
    <div className="space-y-3">
      {items.map((faq, index) => {
        const isOpen = activeIndex === index;
        const answerId = `${baseId}-answer-${index}`;

        return (
          <div
            key={faq.q}
            className={`overflow-hidden rounded-2xl border bg-white transition-colors ${
              isOpen ? "border-primary-200 shadow-card" : "border-surface-200"
            }`}
          >
            <button
              type="button"
              onClick={() => setActiveIndex(isOpen ? null : index)}
              aria-expanded={isOpen}
              aria-controls={answerId}
              className="flex min-h-14 w-full items-center justify-between gap-4 px-4 py-4 text-left sm:px-5"
            >
              <span className="text-[14.5px] font-bold leading-snug text-surface-950 sm:text-[15.5px]">
                {faq.q}
              </span>
              <span
                aria-hidden="true"
                className={`flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full transition-all duration-200 ${
                  isOpen
                    ? "rotate-180 bg-primary-800 text-white"
                    : "bg-surface-100 text-surface-600"
                }`}
              >
                <ChevronDownIcon size={16} />
              </span>
            </button>
            {isOpen && (
              <div
                id={answerId}
                className="border-t border-surface-100 px-4 pb-5 pt-3.5 text-[13.5px] leading-[1.7] text-surface-600 sm:px-5"
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
