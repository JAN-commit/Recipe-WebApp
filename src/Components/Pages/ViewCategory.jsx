import { useState, useEffect } from 'react';
import RecipeList from '../RecipeDashboard/RecipeList';
import { useLocation, useNavigate } from 'react-router-dom';

export default function ViewCategory() {
  localStorage.setItem('back', '/categories');

  const navigate = useNavigate();
  const location = useLocation();
  const name = location.state?.name ?? '';

  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchRecipes = async (categoryName) => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(
        `https://www.themealdb.com/api/json/v1/1/filter.php?c=${categoryName}`
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
      } else {
        setRecipes([]);
      }
    } catch (error) {
      console.error('Error fetching recipes:', error);
      setError('Failed to load recipes. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (name) {
      fetchRecipes(name);
    }
  }, [name]);

  return (
    <div className="mx-auto w-full max-w-7xl px-4 pt-10 pb-4 sm:px-6">
      <button
        type="button"
        onClick={() => navigate('/categories')}
        className="mb-6 inline-flex cursor-pointer items-center gap-1 text-sm font-medium text-base-content/60 transition-colors hover:text-primary"
      >
        <span className="material-symbols-outlined text-lg">arrow_back</span>
        All categories
      </button>

      {name ? (
        <>
          <h1 className="font-display text-3xl font-semibold sm:text-4xl">{name}</h1>
          <p className="mt-2 text-base-content/60">
            {loading
              ? 'Loading recipes…'
              : `${recipes.length} recipe${recipes.length === 1 ? '' : 's'} in this category`}
          </p>
        </>
      ) : (
        <h1 className="font-display text-3xl font-semibold sm:text-4xl">Category</h1>
      )}

      {error && <p className="mt-8 text-error">{error}</p>}
      {!name && !error && (
        <div className="py-16 text-center">
          <span className="material-symbols-outlined text-5xl text-base-content/30">category</span>
          <p className="mt-3 text-base-content/60">
            Pick a category from the page before to see its recipes.
          </p>
        </div>
      )}

      <div className="mt-6">
        <RecipeList recipes={recipes} loading={loading} />
        {name && !loading && recipes.length === 0 && !error && (
          <div className="py-16 text-center">
            <p className="text-base-content/60">No recipes found in this category.</p>
          </div>
        )}
      </div>
    </div>
  );
}