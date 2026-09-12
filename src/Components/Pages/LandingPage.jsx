import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../useAuth';

export default function LandingPage() {
  const loggedIn = useAuth();
  const [featured, setFeatured] = useState([]);

  useEffect(() => {
    let cancelled = false;

    const fetchFeatured = async () => {
      const results = await Promise.all(
        Array.from({ length: 4 }, async () => {
          try {
            const res = await fetch('https://www.themealdb.com/api/json/v1/1/random.php');
            const data = await res.json();
            const meal = data?.meals?.[0];
            return meal
              ? { id: meal.idMeal, title: meal.strMeal, image: meal.strMealThumb }
              : null;
          } catch {
            return null;
          }
        })
      );
      if (!cancelled) {
        setFeatured(results.filter((meal) => meal !== null));
      }
    };

    fetchFeatured();
    return () => {
      cancelled = true;
    };
  }, []);

  const rotations = ['rotate-1', '-rotate-1', 'rotate-2', '-rotate-2'];

  return (
    <div>
      <section className="mx-auto w-full max-w-7xl px-4 pt-14 pb-10 sm:px-6 sm:pt-20 sm:pb-16">
        <div className="grid items-center gap-12 lg:grid-cols-2">
          <div>
            <p className="mb-4 inline-flex items-center gap-2 rounded-full border border-base-300 bg-base-200 px-3 py-1 text-xs font-semibold tracking-wide text-base-content/70 uppercase">
              <span className="h-1.5 w-1.5 rounded-full bg-primary"></span>
              Everyday recipes, simply found
            </p>
            <h1 className="font-display text-4xl leading-[1.1] font-semibold text-balance sm:text-5xl lg:text-6xl">
              Recipes that taste like home.
            </h1>
            <p className="mt-5 max-w-md text-lg leading-relaxed text-base-content/70">
              Search by name, browse from A to Z, or pick a category. Find the
              next dish worth cooking tonight.
            </p>
            <div className="mt-8 flex flex-wrap items-center gap-3">
              <Link
                to={loggedIn ? '/dashboard' : '/signup'}
                className="btn btn-primary px-7"
              >
                Start cooking
              </Link>
              <Link to="/categories" className="btn btn-outline btn-primary px-7">
                Browse categories
              </Link>
            </div>
            <p className="mt-6 text-sm text-base-content/50">
              Free to use &middot; No credit card &middot; Powered by TheMealDB
            </p>
          </div>

          {featured.length > 0 && (
            <div className="grid grid-cols-2 gap-4">
              {featured.map((meal, index) => (
                <Link
                  to={`/recipe/${meal.id}`}
                  key={meal.id}
                  className={`group ${
                    index % 2 === 0 ? 'translate-y-4' : index === 3 ? '-translate-y-2' : ''
                  }`}
                >
                  <div
                    className={`overflow-hidden rounded-xl border border-base-300 bg-base-100 shadow-card transition-transform duration-300 ${
                      rotations[index % rotations.length]
                    } group-hover:rotate-0`}
                  >
                    <div className="aspect-[4/3] overflow-hidden">
                      <img
                        src={meal.image}
                        alt={meal.title}
                        loading="lazy"
                        className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                      />
                    </div>
                    <div className="px-4 py-3">
                      <p className="font-display text-sm font-medium leading-snug group-hover:text-primary">
                        {meal.title}
                      </p>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>

      <section className="mx-auto w-full max-w-7xl px-4 pb-16 sm:px-6">
        <div className="grid gap-4 sm:grid-cols-3">
          {[
            {
              icon: 'search',
              title: 'Search by name',
              copy: 'Know what you crave? Type a keyword and get results in seconds.',
              to: '/search',
            },
            {
              icon: 'abc',
              title: 'Browse A to Z',
              copy: 'Explore the whole lineup one letter at a time and stumble on a favorite.',
              to: '/a-z',
            },
            {
              icon: 'category',
              title: 'Pick a category',
              copy: 'Beef, chicken, dessert, seafood and more — choose your mood and browse.',
              to: '/categories',
            },
          ].map((feature) => (
            <Link
              key={feature.title}
              to={feature.to}
              className="group rounded-xl border border-base-300 bg-base-100 p-6 shadow-card transition-colors hover:border-primary/40"
            >
              <span className="flex h-11 w-11 items-center justify-center rounded-lg bg-secondary text-secondary-content">
                <span className="material-symbols-outlined text-2xl">{feature.icon}</span>
              </span>
              <h3 className="font-display mt-4 text-lg font-semibold group-hover:text-primary">
                {feature.title}
              </h3>
              <p className="mt-1.5 text-sm leading-relaxed text-base-content/60">{feature.copy}</p>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}