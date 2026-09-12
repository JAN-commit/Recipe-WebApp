import { useState } from 'react';
import RecipeList from '../RecipeDashboard/RecipeList';

export default function SearchLetter() {
  localStorage.setItem('back', '/a-z');

  const [selected, setSelected] = useState('');
  const [loading, setLoading] = useState(false);
  const [recipes, setRecipes] = useState([]);

  const handleSearch = async (letter) => {
    setSelected(letter);
    setLoading(true);
    try {
      const response = await fetch(
        `https://www.themealdb.com/api/json/v1/1/search.php?f=${letter}`
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
      setRecipes([]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto w-full max-w-7xl px-4 pt-10 pb-4 sm:px-6">
      <h1 className="font-display text-3xl font-semibold sm:text-4xl">Browse by letter</h1>
      <p className="mt-2 text-base-content/60">
        Choose a letter and see every recipe that starts with it.
      </p>

      <div className="mt-8 flex w-full max-w-3xl flex-wrap gap-2">
        {Array.from({ length: 26 }, (_, index) => {
          const letter = String.fromCharCode(65 + index);
          const isActive = selected === letter;
          return (
            <button
              key={letter}
              onClick={() => handleSearch(letter)}
              disabled={loading}
              className={`flex h-11 w-11 cursor-pointer items-center justify-center rounded-lg border text-sm font-semibold transition-colors ${
                isActive
                  ? 'border-primary bg-primary text-primary-content'
                  : 'border-base-300 bg-base-100 text-base-content/80 hover:border-primary/50 hover:text-primary'
              }`}
            >
              {letter}
            </button>
          );
        })}
      </div>

      {selected && !loading && (
        <p className="mt-6 text-sm text-base-content/60">
          {recipes.length > 0 ? (
            <>
              <span className="font-semibold text-primary">{recipes.length}</span> recipe
              {recipes.length > 1 ? 's' : ''} starting with “{selected}”
            </>
          ) : (
            <>No recipes start with “{selected}” yet.</>
          )}
        </p>
      )}

      <div className="mt-6">
        <RecipeList recipes={recipes} loading={loading} />
        {selected && !loading && recipes.length === 0 && (
          <div className="py-16 text-center">
            <span className="material-symbols-outlined text-5xl text-base-content/30">abc</span>
            <p className="mt-3 text-base-content/60">Nothing here yet. Try a different letter.</p>
          </div>
        )}
      </div>
    </div>
  );
}