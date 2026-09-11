import Link from "next/link";

export default function NotFound() {
  return (
    <main className="mx-auto flex min-h-[70vh] max-w-md flex-col items-center justify-center px-4 text-center">
      <div className="paper-card w-full p-8">
        <div className="mb-3 text-5xl" aria-hidden>
          🌫️
        </div>
        <h1 className="mb-1 text-lg font-semibold text-ink">这里好像还没有路</h1>
        <p className="mb-5 text-sm text-muted">This place isn&apos;t on the map yet.</p>
        <Link
          href="/"
          className="inline-block rounded-card bg-moss px-5 py-2.5 text-sm font-medium text-paper transition-opacity hover:opacity-90"
        >
          回小屋 / Back home
        </Link>
      </div>
    </main>
  );
}
