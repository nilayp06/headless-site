export default function Loading() {
  return (
    <main className="min-h-screen bg-white">
      <div className="w-full bg-white border-b border-gray-200 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-4">
            <div className="h-10 w-10 bg-gray-200 rounded-lg animate-pulse" />
            <div className="h-8 w-32 bg-gray-200 rounded animate-pulse" />
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 lg:gap-16">
          {/* Billing form skeleton */}
          <div className="lg:col-span-2">
            <div className="border border-gray-200 rounded-lg p-8 space-y-6">
              <div className="h-5 w-32 bg-gray-200 rounded animate-pulse" />
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {Array.from({ length: 8 }).map((_, i) => (
                  <div key={i} className="space-y-2">
                    <div className="h-4 w-24 bg-gray-200 rounded animate-pulse" />
                    <div className="h-10 w-full bg-gray-200 rounded animate-pulse" />
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Summary skeleton */}
          <div>
            <div className="border border-gray-200 rounded-lg p-8 space-y-6 bg-white">
              <div className="h-5 w-28 bg-gray-200 rounded animate-pulse" />

              <div className="space-y-3 max-h-64 overflow-hidden">
                {Array.from({ length: 3 }).map((_, i) => (
                  <div key={i} className="flex justify-between items-center py-2 border-b border-gray-200">
                    <div className="h-4 w-40 bg-gray-200 rounded" />
                    <div className="h-4 w-16 bg-gray-200 rounded" />
                  </div>
                ))}
              </div>

              <div className="space-y-4 py-6 border-y border-gray-200">
                <div className="flex justify-between">
                  <div className="h-4 w-20 bg-gray-200 rounded" />
                  <div className="h-4 w-16 bg-gray-200 rounded" />
                </div>
                <div className="flex justify-between">
                  <div className="h-4 w-20 bg-gray-200 rounded" />
                  <div className="h-4 w-16 bg-gray-200 rounded" />
                </div>
              </div>

              <div className="flex justify-between items-center">
                <div className="h-4 w-16 bg-gray-200 rounded" />
                <div className="h-4 w-20 bg-gray-200 rounded" />
              </div>

              <div className="h-11 w-full bg-gray-200 rounded-lg animate-pulse" />
              <div className="h-4 w-40 bg-gray-200 rounded mx-auto animate-pulse" />
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}
