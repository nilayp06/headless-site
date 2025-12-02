export default function Loading() {
  return (
    <main className="min-h-screen bg-white">
      <div className="w-full bg-white border-b border-gray-200 py-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="h-8 w-56 bg-gray-200 rounded animate-pulse" />
          <div className="mt-4 h-4 w-72 bg-gray-200 rounded animate-pulse" />
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
        <div className="space-y-8">
          <div className="h-20 w-full bg-gray-100 border border-gray-200 rounded-lg animate-pulse" />

          <div className="border border-gray-200 rounded-lg p-6 space-y-4">
            <div className="h-4 w-32 bg-gray-200 rounded animate-pulse" />
            <div className="h-4 w-64 bg-gray-200 rounded animate-pulse" />
            <div className="h-4 w-40 bg-gray-200 rounded animate-pulse" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="h-32 bg-gray-100 border border-gray-200 rounded-lg animate-pulse" />
            <div className="h-32 bg-gray-100 border border-gray-200 rounded-lg animate-pulse" />
          </div>
        </div>
      </div>
    </main>
  )
}
