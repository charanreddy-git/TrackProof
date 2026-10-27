import { CameraIcon, CheckIcon, MapPinIcon, ShieldCheckIcon } from "./Icons";

function SiteSketch() {
  return (
    <svg
      viewBox="0 0 240 160"
      className="h-full w-full"
      role="img"
      aria-label="Illustration of a house and compound wall"
    >
      <rect width="240" height="160" fill="#e9f5ec" />
      <circle cx="204" cy="34" r="18" fill="#ffe566" />
      <path d="M0 118Q70 104 126 114T240 108V160H0Z" fill="#9fd4b1" />
      <path d="M0 132Q80 120 154 130T240 126V160H0Z" fill="#6fbb8b" />
      <rect x="68" y="72" width="102" height="54" rx="2" fill="#fffbf2" stroke="#0f4a30" strokeWidth="2" />
      <path d="M58 74 119 28l62 46Z" fill="#ffc400" stroke="#0f4a30" strokeWidth="2" />
      <rect x="110" y="94" width="22" height="32" rx="1" fill="#0f4a30" />
      <rect x="82" y="83" width="19" height="16" rx="1" fill="#d6f0df" stroke="#0f4a30" strokeWidth="1.4" />
      <rect x="141" y="83" width="19" height="16" rx="1" fill="#d6f0df" stroke="#0f4a30" strokeWidth="1.4" />
      <path d="M82 91h19M91.5 83v16M141 91h19M150.5 83v16" stroke="#0f4a30" strokeWidth="1" />
      <path d="M54 126V101h13v25M177 126v-25h13v25" fill="#ffe566" stroke="#0f4a30" strokeWidth="1.4" />
      <path d="M20 132h202" stroke="#0f4a30" strokeWidth="2.5" />
      <path d="M0 139h240" stroke="#ffffff" strokeWidth="2" strokeDasharray="10 8" />
      <circle cx="45" cy="102" r="14" fill="#218f5c" opacity=".9" />
      <rect x="43.5" y="102" width="3" height="26" rx="1.5" fill="#218f5c" />
    </svg>
  );
}

function SiteMap() {
  return (
    <svg
      viewBox="0 0 480 260"
      className="h-full w-full"
      role="img"
      aria-label="Illustration of the property location on a map"
    >
      <rect width="480" height="260" fill="#fff6e5" />
      <g stroke="#eee2cf" strokeWidth="1">
        {Array.from({ length: 15 }).map((_, i) => (
          <path key={`v${i}`} d={`M${i * 34} 0V260`} />
        ))}
        {Array.from({ length: 8 }).map((_, i) => (
          <path key={`h${i}`} d={`M0 ${i * 34}H480`} />
        ))}
      </g>
      <path d="M-20 206C92 186 140 190 238 162S402 124 500 134" fill="none" stroke="#ffffff" strokeWidth="26" />
      <path d="M-20 206C92 186 140 190 238 162S402 124 500 134" fill="none" stroke="#d8c4a8" strokeWidth="1.2" strokeDasharray="5 5" />
      <path d="M280-20C273 44 300 80 296 132S270 218 286 280" fill="none" stroke="#ffffff" strokeWidth="18" />
      <path d="M280-20C273 44 300 80 296 132S270 218 286 280" fill="none" stroke="#d8c4a8" strokeWidth="1.2" strokeDasharray="5 5" />
      <g fill="#eee2cf" stroke="#d8c4a8" strokeWidth="1">
        <rect x="105" y="62" width="80" height="50" rx="4" />
        <rect x="330" y="54" width="75" height="52" rx="4" />
        <rect x="66" y="216" width="75" height="36" rx="4" />
      </g>
      <g fill="#d6f0df" stroke="#ade1c1" strokeWidth="1">
        <rect x="210" y="202" width="62" height="40" rx="4" />
        <rect x="365" y="188" width="68" height="56" rx="4" />
      </g>
      <rect x="206" y="80" width="92" height="78" rx="6" fill="#ffe566" stroke="#0f4a30" strokeWidth="2.5" />
      <rect x="206" y="80" width="92" height="78" rx="6" fill="url(#plotHatch)" />
      <defs>
        <pattern id="plotHatch" width="8" height="8" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
          <line x1="0" y1="0" x2="0" y2="8" stroke="#0f4a30" strokeOpacity=".16" />
        </pattern>
      </defs>
      <circle cx="253" cy="119" r="32" fill="#218f5c" fillOpacity=".1" stroke="#218f5c" strokeDasharray="3 4" />
      <path d="M253 91c-11 0-20 9-20 20 0 15 20 34 20 34s20-19 20-34c0-11-9-20-20-20Z" fill="#0f4a30" />
      <circle cx="253" cy="111" r="6.5" fill="#ffc400" />
      <g fill="#0f4a30" fontFamily="Plus Jakarta Sans, sans-serif">
        <text x="18" y="26" fontSize="10" fontWeight="700">Property pin</text>
        <text x="340" y="246" fontSize="8.5" fontWeight="600" fill="#6b604f">12.9719, 77.6412</text>
      </g>
    </svg>
  );
}

const CHECKS = [
  ["Boundary wall", "Intact"],
  ["Road access", "Car-friendly"],
  ["Water meter", "Present"],
  ["Occupancy", "Vacant"],
] as const;

export function SampleDossier() {
  return (
    <article className="relative overflow-hidden rounded-3xl border border-surface-200 bg-white shadow-elevated">
      <div className="flex items-center justify-between gap-3 bg-primary-900 px-4 py-3.5 text-white sm:px-5">
        <div className="flex items-center gap-2.5">
          <span className="flex h-8 w-8 items-center justify-center rounded-full bg-white/10">
            <ShieldCheckIcon size={16} className="text-accent-300" />
          </span>
          <div>
            <p className="text-[12.5px] font-bold leading-none">Visit proof</p>
            <p className="mt-1 text-[10.5px] font-medium text-primary-200">GPS-verified photo</p>
          </div>
        </div>
        <span className="rounded-full bg-accent-400 px-2.5 py-1 text-[10px] font-bold text-primary-950">
          Sample
        </span>
      </div>

      <div className="p-4 sm:p-5">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <p className="text-[11.5px] font-semibold text-surface-500">Today · 11:42 am</p>
            <h3 className="mt-1 text-[1.35rem] font-extrabold tracking-[-0.025em] text-surface-950 sm:text-[1.5rem]">
              Plot 42, Kompally
            </h3>
            <p className="mt-1 flex items-center gap-1.5 text-[12px] font-medium text-surface-500">
              <MapPinIcon size={13} className="flex-shrink-0 text-primary-600" />
              Medchal–Malkajgiri, Hyderabad
            </p>
          </div>
          <span className="inline-flex items-center gap-1.5 rounded-full bg-accent-50 px-3 py-1.5 text-[11px] font-bold text-accent-800 ring-1 ring-accent-200">
            <span className="h-1.5 w-1.5 rounded-full bg-accent-500" />
            Proof ready
          </span>
        </div>

        <div className="mt-3.5 overflow-hidden rounded-2xl border border-surface-200">
          <div className="aspect-[16/8] sm:aspect-[16/7]">
            <SiteMap />
          </div>
        </div>

        <div className="mt-3.5 grid gap-3 sm:grid-cols-[0.95fr_1.05fr]">
          <div className="overflow-hidden rounded-2xl border border-surface-200">
            <div className="aspect-[4/3]">
              <SiteSketch />
            </div>
            <div className="flex items-center gap-1.5 border-t border-surface-200 bg-surface-50 px-2.5 py-2 text-[10.5px] font-semibold text-surface-600">
              <CameraIcon size={12} className="text-primary-600" />
              Proof photo · just now
            </div>
          </div>

          <div className="rounded-2xl bg-surface-50 p-3">
            <div className="flex items-center justify-between border-b border-surface-200 pb-1.5">
              <p className="text-[11.5px] font-bold text-surface-700">What was checked</p>
              <p className="text-[10.5px] font-semibold text-primary-700">4 of 4</p>
            </div>
            <ul>
              {CHECKS.map(([label, value]) => (
                <li
                  key={label}
                  className="flex items-center justify-between gap-2 border-b border-surface-200/70 py-1.5 text-[11px] last:border-0"
                >
                  <span className="flex items-center gap-1.5 font-semibold text-surface-800">
                    <CheckIcon size={11} className="flex-shrink-0 text-primary-600" />
                    {label}
                  </span>
                  <span className="text-right text-[10px] font-medium text-surface-500">{value}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-3.5 flex flex-wrap items-center justify-between gap-2 rounded-2xl bg-primary-50 px-3 py-2.5">
          <p className="text-[10.5px] font-semibold text-primary-800">23 m from pin · ±4 m accuracy</p>
          <p className="flex items-center gap-1 text-[10.5px] font-semibold text-primary-700">
            <ShieldCheckIcon size={12} />
            Checked by server
          </p>
        </div>
      </div>
    </article>
  );
}
