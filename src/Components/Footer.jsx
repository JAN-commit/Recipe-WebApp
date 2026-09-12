import { version } from '../../package.json';

export default function Footer() {
  return (
    <footer className="mt-16 border-t border-base-300 bg-base-100">
      <div className="mx-auto w-full max-w-7xl px-5 py-10">
        <div className="flex flex-col items-start justify-between gap-6 sm:flex-row sm:items-center">
          <div>
            <div className="flex items-center gap-2">
              <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-content">
                <span className="material-symbols-outlined text-lg">restaurant</span>
              </span>
              <span className="font-display text-xl font-semibold">Kusina</span>
            </div>
            <p className="mt-2 max-w-sm text-sm text-base-content/60">
              Everyday recipes with an easy way to find the next dish worth cooking.
            </p>
          </div>
          <div className="text-sm text-base-content/60">
            <p className="font-medium text-base-content/80">Recipes served by TheMealDB</p>
            <p className="mt-1">
              &copy; {new Date().getFullYear()} Kusina. Made for the love of food. v{version}
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}