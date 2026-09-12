import { useState } from 'react';
import RecipeList from '../RecipeDashboard/RecipeList';

export default function SearchRecipe() {
  localStorage.setItem('back', '/search');
  const [search, setSearch] = useState('');
  const [submitted, setSubmitted] = useState('');
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleSearch = async (e) => {
    e.preventDefault();
    const query = search.trim();
    if (!query) return;
    setLoading(true);
    try {
      const response = await fetch(
        `https://www.themealdb.com/api/json/v1/1/search.php?s=${query}`
      );
      if (!response.ok) {
        throw new Error('Failed to fetch recipes');
      }
      const data = await response.json();
      if (data.meals) {
        const newRecipes = data.meals.map((meal) => ({
          id: meal.idMeal,
          image: meal.strMealThumb,
          title: meal.strMeal,
        }));
        setRecipes(newRecipes);
        setSubmitted(query);
      } else {
        setRecipes([]);
        setSubmitted(query);
      }
    } catch (error) {
      console.error('Error fetching recipes:', error);
      setRecipes([]);
      setSubmitted(query);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto w-full max-w-7xl px-4 pt-10 pb-4 sm:px-6">
      <h1 className="font-display text-3xl font-semibold sm:text-4xl">Find a recipe</h1>
      <p className="mt-2 text-base-content/60">
        Type a keyword below — try “chicken”, “salad”, or a dish you love.
      </p>

      <form
        onSubmit={handleSearch}
        className="mt-6 flex flex-col gap-3 sm:max-w-xl sm:flex-row"
      >
        <label className="input input-bordered flex w-full items-center gap-2">
          <span className="material-symbols-outlined text-base-content/50">search</span>
          <input
            type="search"
            placeholder="Search by keyword…"
            className="w-full border-none focus:outline-none"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </label>
        <button type="submit" className="btn btn-primary sm:px-8" disabled={loading}>
          {loading ? <span className="loading loading-spinner loading-xs"></span> : 'Search'}
        </button>
      </form>

      {submitted && !loading && (
        <p className="mt-6 text-sm text-base-content/60">
          {recipes.length > 0 ? (
            <>
              <span className="font-semibold text-primary">{recipes.length}</span> recipe
              {recipes.length > 1 ? 's' : ''} found for “<span className="font-medium">{submitted}</span>”
            </>
          ) : (
            <>No recipes found for “{submitted}”. Try another keyword.</>
          )}
        </p>
      )}

      <div className="mt-6">
        <RecipeList recipes={recipes} loading={loading} />
        {submitted && !loading && recipes.length === 0 && (
          <div className="py-16 text-center">
            <span className="material-symbols-outlined text-5xl text-base-content/30">search_off</span>
            <p className="mt-3 text-base-content/60">Nothing matched your search.</p>
          </div>
        )}
      </div>
    </div>
  );
}