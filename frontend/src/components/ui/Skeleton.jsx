import React from 'react';

export default function Skeleton({ className = '', style = {} }) {
  return <div className={`skeleton ${className}`} style={style} />;
}

export function EventCardSkeleton() {
  return (
    <div className="rounded-2xl border border-slate-200/90 bg-white p-5 shadow-subtle flex flex-col justify-between h-[390px] animate-fade-in">
      <div>
        <Skeleton className="h-40 w-full rounded-xl mb-4" />
        <div className="flex justify-between items-center mb-2">
          <Skeleton className="h-4 w-24 rounded-full" />
          <Skeleton className="h-4 w-20 rounded-full" />
        </div>
        <Skeleton className="h-6 w-3/4 rounded-lg mb-2" />
        <Skeleton className="h-3.5 w-1/2 rounded mb-4" />
        <div className="flex gap-2">
          <Skeleton className="h-5 w-16 rounded-md" />
          <Skeleton className="h-5 w-20 rounded-md" />
          <Skeleton className="h-5 w-14 rounded-md" />
        </div>
      </div>
      <div className="pt-3 border-t border-slate-100 flex gap-2">
        <Skeleton className="h-9 flex-1 rounded-xl" />
        <Skeleton className="h-9 w-24 rounded-xl" />
      </div>
    </div>
  );
}

export function TeamCardSkeleton() {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-subtle flex flex-col justify-between h-[300px] animate-fade-in">
      <div>
        <div className="flex justify-between items-center mb-3">
          <Skeleton className="h-5 w-36 rounded-lg" />
          <Skeleton className="h-5 w-24 rounded-full" />
        </div>
        <div className="flex items-center gap-2 mb-3">
          <Skeleton className="h-7 w-7 rounded-full" />
          <Skeleton className="h-4 w-32 rounded" />
        </div>
        <Skeleton className="h-14 w-full rounded-xl mb-3" />
        <div className="flex gap-1.5">
          <Skeleton className="h-5 w-20 rounded-md" />
          <Skeleton className="h-5 w-24 rounded-md" />
        </div>
      </div>
      <div className="pt-3 border-t border-slate-100 flex justify-between items-center">
        <Skeleton className="h-4 w-24 rounded" />
        <Skeleton className="h-8 w-28 rounded-lg" />
      </div>
    </div>
  );
}

export function TravelCardSkeleton() {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-subtle flex flex-col justify-between h-[280px] animate-fade-in">
      <div>
        <div className="flex justify-between items-center mb-3">
          <Skeleton className="h-6 w-44 rounded-lg" />
          <Skeleton className="h-5 w-20 rounded-full" />
        </div>
        <Skeleton className="h-4 w-36 rounded mb-3" />
        <Skeleton className="h-14 w-full rounded-xl mb-3" />
        <Skeleton className="h-7 w-full rounded-lg" />
      </div>
      <div className="pt-3 border-t border-slate-100 flex justify-between items-center">
        <Skeleton className="h-4 w-28 rounded" />
        <Skeleton className="h-8 w-32 rounded-lg" />
      </div>
    </div>
  );
}
