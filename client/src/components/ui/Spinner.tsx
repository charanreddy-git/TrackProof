import { LogoMark } from "../Logo";

export function PageLoader() {
  return (
    <div className="flex min-h-[400px] items-center justify-center">
      <div className="flex flex-col items-center gap-3">
        <div className="animate-pulse-soft">
          <LogoMark size="lg" />
        </div>
        <p className="text-[13px] font-semibold text-surface-500">Getting things ready…</p>
      </div>
    </div>
  );
}
