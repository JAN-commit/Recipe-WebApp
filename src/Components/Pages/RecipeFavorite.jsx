import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import RecipeList from '../RecipeDashboard/RecipeList';

const RecipeFavorite = () => {
  localStorage.setItem('back', '/favorites');

  const [favorites, setFavorites] = useState([]);
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    const fetchFavorites = async () => {
      try {
        const dburl = (import.meta.env.VITE_FIREBASE_DB_URL ?? '').replace(/\/+$/, '');
        const localid = localStorage.getItem('localId');
        const idToken = localStorage.getItem('idToken');
        const favoritesURL = `${dburl}/favorites/${localid}/.json?auth=${idToken}`;

        const response = await fetch(favoritesURL);
        if (!response.ok) {
          throw new Error('Failed to fetch favorites');
        }

        const data = await response.json();
        const favoritesArray = data
          ? Object.entries(data).map(([key, value]) => ({ key, ...value }))
          : [];
        if (!cancelled) {
          setFavorites(favoritesArray);
          setLoading(false);
        }
      } catch (error) {
        console.error('Error fetching favorites:', error);
        if (!cancelled) setLoading(false);
      }
    };

    fetchFavorites();
    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    let cancelled = false;

    const fetchRecipeDetails = async () => {
      setLoading(true);
      const fetchedRecipes = await Promise.all(
        favorites.map(async (favorite) => {
          try {
            const response = await fetch(
              `https://www.themealdb.com/api/json/v1/1/lookup.php?i=${favorite.id}`
            );
            const data = await response.json();
            if (data.meals && data.meals.length > 0) {
              return {
                id: data.meals[0].idMeal,
                image: data.meals[0].strMealThumb,
                title: data.meals[0].strMeal,
                description: data.meals[0].strInstructions,
              };
            }
            return null;
          } catch (error) {
            console.error('Error fetching recipe:', error);
            return null;
          }
        })
      );

      if (!cancelled) {
        setRecipes(fetchedRecipes.filter((recipe) => recipe !== null));
        setLoading(false);
      }
    };

    if (favorites.length > 0) {
      fetchRecipeDetails();
    }
  }, [favorites]);

  return (
    <div className="mx-auto w-full max-w-7xl px-4 pt-10 pb-4 sm:px-6">
      <h1 className="font-display text-3xl font-semibold sm:text-4xl">My favorites</h1>
      <p className="mt-2 text-base-content/60">
        The dishes you saved for later, all in one place.
      </p>

      <div className="mt-8">
        {loading ? (
          <div className="flex w-full justify-center py-16">
            <span className="loading loading-spinner loading-lg text-primary"></span>
          </div>
        ) : recipes.length > 0 ? (
          <RecipeList recipes={recipes} loading={false} />
        ) : (
          <div className="py-20 text-center">
            <span className="material-symbols-outlined text-6xl text-base-content/25">
              favorite
            </span>
            <p className="mt-4 font-display text-xl font-semibold text-base-content/80">
              No favorites yet
            </p>
            <p className="mx-auto mt-1 max-w-sm text-base-content/60">
              Tap the heart on any recipe and it will show up right here.
            </p>
            <Link to="/dashboard" className="btn btn-primary mt-6">
              Find something to cook
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default RecipeFavorite;