import React from 'react';

export default function EmptyState({
  icon: Icon,
  title,
  description,
  actionLabel,
  onAction,
  className = '',
}) {
  return (
    <div
      className={`rounded-2xl border border-dashed border-slate-300 bg-white/70 p-10 sm:p-14 text-center backdrop-blur-xs animate-fade-in ${className}`}
    >
      <div className="relative mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-tr from-brand-50 to-indigo-100 text-brand-600 shadow-sm border border-brand-200/50">
        {Icon ? <Icon className="h-7 w-7" /> : null}
      </div>
      <h3 className="text-base font-bold text-slate-900 tracking-tight font-display">{title}</h3>
      {description && (
        <p className="mt-1.5 max-w-sm mx-auto text-xs text-slate-500 leading-relaxed">
          {description}
        </p>
      )}
      {actionLabel && onAction && (
        <button
          onClick={onAction}
          className="mt-5 inline-flex items-center gap-1.5 rounded-xl bg-slate-900 px-4 py-2 text-xs font-bold text-white shadow-subtle hover:bg-slate-800 transition btn-shine"
        >
          {actionLabel}
        </button>
      )}
    </div>
  );
}
