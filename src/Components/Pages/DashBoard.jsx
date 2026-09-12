import { useState, useEffect, useCallback } from 'react';
import RecipeList from '../RecipeDashboard/RecipeList';
import { useNavigate } from 'react-router-dom';

export default function Dashboard() {
  localStorage.setItem('back', '/dashboard');
  const navigate = useNavigate();
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const idToken = localStorage.getItem('idToken');

    if (idToken) {
      const interval = setInterval(() => {
        const currentTime = new Date();
        const storedExpiryTime = new Date(localStorage.getItem('expiryTime'));

        if (currentTime >= storedExpiryTime) {
          localStorage.removeItem('expiresIn');
          localStorage.removeItem('idToken');
          localStorage.removeItem('localId');
          localStorage.removeItem('expiryTime');
          clearInterval(interval);
          window.dispatchEvent(new Event('authchange'));
          navigate('/login');
        }
      }, 1000);

      return () => clearInterval(interval);
    } else {
      navigate('/login');
    }
  }, [navigate]);

  const fetchRandomRecipe = useCallback(async () => {
    try {
      const response = await fetch('https://www.themealdb.com/api/json/v1/1/random.php');
      if (!response.ok) {
        throw new Error('Failed to fetch random recipe');
      }
      const data = await response.json();
      const newRecipe = {
        id: data.meals[0].idMeal,
        image: data.meals[0].strMealThumb,
        title: data.meals[0].strMeal,
      };
      return newRecipe;
    } catch (error) {
      console.error('Error fetching recipe:', error);
      return null;
    }
  }, []);

  const fetchInitialRecipes = useCallback(async () => {
    setLoading(true);
    const recipePromises = [];
    for (let i = 0; i < 8; i++) {
      recipePromises.push(fetchRandomRecipe());
    }

    try {
      const fetchedRecipes = await Promise.all(recipePromises);
      const filteredRecipes = fetchedRecipes.filter((recipe) => recipe !== null);
      setRecipes(filteredRecipes);
    } catch (error) {
      console.error('Error fetching initial recipes:', error);
    } finally {
      setLoading(false);
    }
  }, [fetchRandomRecipe]);

  useEffect(() => {
    fetchInitialRecipes();
  }, [fetchInitialRecipes]);

  return (
    <div className="mx-auto w-full max-w-7xl px-4 pt-10 pb-4 sm:px-6">
      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="font-display text-3xl font-semibold sm:text-4xl">
            What will you cook today?
          </h1>
          <p className="mt-2 text-base-content/60">
            A fresh set of recipes picked at random — swipe through and see what catches your eye.
          </p>
        </div>
        <button
          type="button"
          className="btn btn-outline btn-primary"
          onClick={fetchInitialRecipes}
          disabled={loading}
        >
          <span className="material-symbols-outlined text-lg">shuffle</span>
          {loading ? 'Refreshing…' : 'Shuffle recipes'}
        </button>
      </div>

      <RecipeList recipes={recipes} loading={loading} />
    </div>
  );
}