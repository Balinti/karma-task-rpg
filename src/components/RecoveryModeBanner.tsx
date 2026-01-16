'use client';

interface RecoveryModeBannerProps {
  isActive: boolean;
}

export function RecoveryModeBanner({ isActive }: RecoveryModeBannerProps) {
  if (!isActive) return null;

  return (
    <div className="bg-amber-500/10 border border-amber-500/30 rounded-lg p-4 mb-6">
      <div className="flex items-start gap-3">
        <span className="text-2xl">🌱</span>
        <div>
          <h3 className="font-medium text-amber-300">Recovery Mode Active</h3>
          <p className="text-sm text-amber-200/70 mt-1">
            We noticed you missed a couple of days. That&apos;s okay! Today we&apos;re showing you
            shorter MVW (Minimum Viable Work) tasks to help you get back on track gently.
          </p>
          <p className="text-xs text-amber-200/50 mt-2">
            Complete any task today to exit recovery mode.
          </p>
        </div>
      </div>
    </div>
  );
}
