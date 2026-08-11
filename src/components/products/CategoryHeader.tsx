export function CategoryHeader({ title, description }: { title: string; description: string }) {
  return (
    <div className="mx-auto max-w-3xl px-4 pb-10 pt-14 text-center sm:px-6 lg:px-8">
      <h1 className="font-display text-3xl font-bold text-white sm:text-4xl">{title}</h1>
      <p className="mt-3 text-base text-slate-400">{description}</p>
    </div>
  );
}
