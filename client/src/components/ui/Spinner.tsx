import { LogoMark } from "../Logo";

export function PageLoader() {
  return (
    <div className="flex items-center justify-center min-h-[400px]">
      <div className="flex flex-col items-center gap-3">
        <div className="animate-pulse-soft">
          <LogoMark size="lg" />
        </div>
        <p className="text-sm text-surface-400 font-medium tracking-wide">Loading…</p>
      </div>
    </div>
  );
}
