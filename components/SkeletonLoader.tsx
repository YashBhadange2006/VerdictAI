import React from 'react';

export const SkeletonLoader: React.FC = () => {
  return (
    <div className="grid grid-cols-1 gap-6 h-full overflow-hidden">
      {[1, 2, 3].map((i) => (
        <div key={i} className="bg-slate-800/30 border border-slate-700/50 rounded-2xl p-6 relative overflow-hidden">
          {/* Header Skeleton */}
          <div className="flex items-center gap-4 mb-6">
            <div className="w-10 h-10 rounded-xl bg-slate-700/50 animate-pulse"></div>
            <div className="h-6 w-1/3 bg-slate-700/50 rounded-lg animate-pulse"></div>
            <div className="ml-auto h-5 w-16 bg-slate-800 rounded-md animate-pulse"></div>
          </div>
          
          {/* Content Skeletons */}
          <div className="space-y-4">
            <div className="h-4 w-full bg-slate-700/30 rounded animate-pulse"></div>
            <div className="h-4 w-5/6 bg-slate-700/30 rounded animate-pulse"></div>
            <div className="h-4 w-4/6 bg-slate-700/30 rounded animate-pulse"></div>
          </div>

          {/* Footer/Highlight Skeleton */}
          <div className="mt-6 p-4 rounded-xl bg-slate-800/50 border border-slate-700/30">
             <div className="h-10 w-full bg-slate-700/20 rounded-lg animate-pulse"></div>
          </div>
        </div>
      ))}
    </div>
  );
};