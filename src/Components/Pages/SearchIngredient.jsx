import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export default function SearchIngredient() {
  localStorage.setItem('back', '/categories');
  const navigate = useNavigate();

  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    let cancelled = false;

    const loadCategoryImages = async (name) => {
      try {
        const res = await fetch(
          `https://www.themealdb.com/api/json/v1/1/filter.php?c=${name}`
        );
        const data = await res.json();
        const first = data?.meals?.[0];
        return first?.strMealThumb ?? null;
      } catch {
        return null;
      }
    };

    const fetchCategories = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await fetch(
          'https://www.themealdb.com/api/json/v1/1/list.php?c=list'
        );
        if (!response.ok) throw new Error('Failed to fetch categories');
        const data = await response.json();
        const list = data?.meals ?? [];
        const withImages = await Promise.all(
          list.map(async (meal) => ({
            id: meal.idCategory,
            name: meal.strCategory,
            image: await loadCategoryImages(meal.strCategory),
          }))
        );
        if (!cancelled) setCategories(withImages);
      } catch (error) {
        console.error('Error fetching categories:', error);
        setError('Failed to load categories. Please try again.');
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    fetchCategories();
    return () => {
      cancelled = true;
    };
  }, []);

  const filtered = categories.filter((category) =>
    category.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="mx-auto w-full max-w-7xl px-4 pt-10 pb-4 sm:px-6">
      <h1 className="font-display text-3xl font-semibold sm:text-4xl">Browse by category</h1>
      <p className="mt-2 text-base-content/60">
        Pick a category and step into a world of dishes built around it.
      </p>

      <div className="mt-6 sm:max-w-md">
        <label className="input input-bordered flex w-full items-center gap-2">
          <span className="material-symbols-outlined text-base-content/50">search</span>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Filter categories…"
            className="w-full border-none focus:outline-none"
          />
        </label>
      </div>

      {error ? (
        <p className="mt-8 text-error">{error}</p>
      ) : (
        <div className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
          {loading
            ? Array.from({ length: 10 }).map((_, index) => (
                <div
                  key={index}
                  className="animate-pulse overflow-hidden rounded-xl border border-base-300 bg-base-200"
                >
                  <div className="aspect-[4/3] bg-base-300"></div>
                  <div className="h-8 px-4 py-3"></div>
                </div>
              ))
            : filtered.map((category) => (
                <button
                  key={category.id}
                  type="button"
                  onClick={() => navigate('/category', { state: { name: category.name } })}
                  className="group cursor-pointer overflow-hidden rounded-xl border border-base-300 bg-base-100 text-left shadow-card transition-colors hover:border-primary/40"
                >
                  <div className="aspect-[4/3] overflow-hidden">
                    {category.image && (
                      <img
                        src={category.image}
                        alt={category.name}
                        loading="lazy"
                        className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                      />
                    )}
                  </div>
                  <div className="flex items-center justify-between px-4 py-3">
                    <span className="font-display text-base font-semibold group-hover:text-primary">
                      {category.name}
                    </span>
                    <span className="material-symbols-outlined text-lg text-base-content/40 group-hover:text-primary">
                      arrow_forward
                    </span>
                  </div>
                </button>
              ))}
        </div>
      )}
    </div>
  );
}