export default function OrderDetailsLoading() {
  return (
    <div className="container mx-auto py-8 px-4">
      <div className="h-8 w-48 bg-gray-200 rounded mb-6 animate-pulse"></div>

      {/* Profile section skeleton */}
      <div className="flex items-center justify-between p-4 bg-white rounded-lg shadow-sm mb-4">
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 rounded-full bg-gray-200 animate-pulse"></div>
          <div>
            <div className="h-5 w-32 bg-gray-200 rounded animate-pulse mb-2"></div>
            <div className="h-4 w-24 bg-gray-200 rounded animate-pulse"></div>
          </div>
        </div>
        <div className="flex gap-2">
          <div className="h-10 w-24 bg-gray-200 rounded animate-pulse"></div>
          <div className="h-10 w-20 bg-gray-200 rounded animate-pulse"></div>
        </div>
      </div>

      {/* Financial summary skeleton */}
      <div className="grid grid-cols-4 gap-4 my-4 bg-gray-50 p-4 rounded-lg">
        {Array(4).fill(0).map((_, index) => (
          <div key={index} className="flex flex-col">
            <div className="h-4 w-24 bg-gray-200 rounded animate-pulse mb-2"></div>
            <div className="h-6 w-16 bg-gray-200 rounded animate-pulse"></div>
          </div>
        ))}
      </div>

      {/* Main content skeleton */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-white rounded-lg shadow-sm p-4 h-96 animate-pulse">
          <div className="h-6 w-32 bg-gray-200 rounded mb-6"></div>
          {Array(4).fill(0).map((_, index) => (
            <div key={index} className="flex gap-3 mb-4">
              <div className="w-6 h-6 rounded-full bg-gray-200"></div>
              <div className="flex-1">
                <div className="h-5 w-full bg-gray-200 rounded mb-2"></div>
                <div className="h-4 w-1/2 bg-gray-200 rounded"></div>
              </div>
            </div>
          ))}
        </div>

        <div>
          <div className="bg-white rounded-lg shadow-sm p-4 mb-4 animate-pulse">
            <div className="h-6 w-24 bg-gray-200 rounded mb-6"></div>
            {Array(3).fill(0).map((_, index) => (
              <div key={index} className="flex justify-between py-2 border-b border-gray-100">
                <div className="h-4 w-24 bg-gray-200 rounded"></div>
                <div className="h-4 w-32 bg-gray-200 rounded"></div>
              </div>
            ))}
          </div>

          <div className="bg-white rounded-lg shadow-sm p-4 animate-pulse">
            <div className="h-6 w-24 bg-gray-200 rounded mb-6"></div>
            {Array(2).fill(0).map((_, index) => (
              <div key={index} className="flex justify-between items-center p-3 border border-gray-200 rounded-lg mb-3">
                <div className="flex items-center gap-3">
                  <div className="h-8 w-8 bg-gray-200 rounded"></div>
                  <div>
                    <div className="h-5 w-32 bg-gray-200 rounded mb-2"></div>
                    <div className="h-3 w-24 bg-gray-200 rounded"></div>
                  </div>
                </div>
                <div className="h-5 w-20 bg-gray-200 rounded"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
} 