export function CategoryDefinition({ children }: { children: string }) {
  return (
    <div className="glass-card mx-auto mb-10 max-w-3xl px-6 py-4 text-center text-sm text-slate-400">
      {children}
    </div>
  );
}
