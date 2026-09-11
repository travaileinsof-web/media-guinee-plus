type SkeletonBlockProps = {
  className?: string;
};

function SkeletonBlock({ className = '' }: SkeletonBlockProps) {
  return <div className={`animate-pulse rounded-lg bg-gray-200/80 ${className}`} />;
}

export function AdminPageSkeleton() {
  return (
    <div className="space-y-8" aria-label="Chargement de la page" role="status">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="space-y-3">
          <SkeletonBlock className="h-8 w-56" />
          <SkeletonBlock className="h-4 w-80 max-w-full" />
        </div>
        <SkeletonBlock className="h-10 w-36" />
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
        {[1, 2, 3, 4].map((item) => (
          <div key={item} className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
            <div className="flex items-start justify-between">
              <SkeletonBlock className="h-12 w-12 rounded-xl" />
              <SkeletonBlock className="h-6 w-14" />
            </div>
            <SkeletonBlock className="mt-6 h-9 w-20" />
            <SkeletonBlock className="mt-2 h-4 w-28" />
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm lg:col-span-2">
          <SkeletonBlock className="h-5 w-48" />
          <SkeletonBlock className="mt-8 h-[260px] w-full rounded-xl" />
        </div>
        <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
          <SkeletonBlock className="h-5 w-56" />
          <SkeletonBlock className="mt-8 h-[260px] w-full rounded-xl" />
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm lg:col-span-2">
          <SkeletonBlock className="h-5 w-44" />
          <div className="mt-7 space-y-5">
            {[1, 2, 3, 4].map((item) => (
              <div key={item} className="flex items-center gap-4">
                <SkeletonBlock className="h-10 w-10 shrink-0 rounded-full" />
                <div className="flex-1 space-y-2">
                  <SkeletonBlock className="h-4 w-3/4" />
                  <SkeletonBlock className="h-3 w-24" />
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
          <SkeletonBlock className="h-5 w-36" />
          <div className="mt-7 space-y-3">
            {[1, 2, 3].map((item) => (
              <SkeletonBlock key={item} className="h-14 w-full rounded-xl" />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export function AdminDashboardSkeleton() {
  return <AdminPageSkeleton />;
}
