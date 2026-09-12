import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Meal from '../RecipeDashboard/Meal';

export default function RecipeSingleView() {
  const { id } = useParams();
  const [recipe, setRecipe] = useState(null);
  const [isFavorite, setIsFavorite] = useState(false);
  const [favorites, setFavorites] = useState([]);
  const [favError, setFavError] = useState(null);
  const navigate = useNavigate();

  const userlogin = localStorage.getItem('idToken');
  const idToken = localStorage.getItem('idToken');
  const localid = localStorage.getItem('localId');
  const dburl = (import.meta.env.VITE_FIREBASE_DB_URL ?? '').replace(/\/+$/, '');
  const favoritesURL = `${dburl}/favorites/${localid}.json?auth=${idToken}`;

  useEffect(() => {
    const fetchRecipeById = async () => {
      try {
        const response = await fetch(
          `https://www.themealdb.com/api/json/v1/1/lookup.php?i=${id}`
        );
        if (!response.ok) {
          throw new Error('Failed to fetch recipe');
        }
        const data = await response.json();
        const meal = data.meals[0];

        const ingredients = [];
        for (let i = 1; i <= 20; i++) {
          const name = meal[`strIngredient${i}`];
          const measure = meal[`strMeasure${i}`];
          if (name && name.trim()) {
            ingredients.push({ name: name.trim(), measure: (measure ?? '').trim() });
          }
        }

        setRecipe({
          id: meal.idMeal,
          image: meal.strMealThumb,
          title: meal.strMeal,
          description: meal.strInstructions,
          youtube: meal.strYoutube,
          source: meal.strSource,
          area: meal.strArea,
          ingredients: ingredients,
        });
      } catch (error) {
        console.error('Error fetching recipe:', error);
      }
    };

    const fetchFavorites = async () => {
      try {
        const response = await fetch(favoritesURL);
        if (!response.ok) {
          throw new Error('Failed to fetch favorites');
        }
        const data = await response.json();

        const favoritesArray = data
          ? Object.entries(data).map((entry) => ({ key: entry[0], ...entry[1] }))
          : [];

        setFavorites(favoritesArray);
        setIsFavorite(favoritesArray.some((fav) => fav.id === id));
      } catch (error) {
        console.error('Error fetching favorites:', error);
      }
    };

    if (id) {
      fetchRecipeById();
      if (userlogin) {
        fetchFavorites();
      }
    }
  }, [id, favoritesURL, userlogin]);

  if (!recipe) {
    return (
      <div className="flex w-full justify-center py-24">
        <span className="loading loading-spinner loading-lg text-primary"></span>
      </div>
    );
  }

  const backbutton = () => {
    const back = localStorage.getItem('back');
    navigate(back || '/dashboard');
  };

  const addFavorites = (recipeToAdd) => {
    const userData = {
      id: recipeToAdd.id,
      title: recipeToAdd.title,
    };
    fetch(favoritesURL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(userData)
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error('Network response was not ok.');
        }
        return response.json();
      })
      .then((data) => {
        setFavorites((prev) => [...prev, { key: data.name, ...userData }]);
        setIsFavorite(true);
        setFavError(null);
      })
      .catch((error) => {
        console.error('Error adding data:', error);
        setFavError('Could not save to favorites. Check the database rules, then try again.');
      });
  };

  const removeFavorites = (idToRemove) => {
    const favoriteToRemove = favorites.find((fav) => fav.id === idToRemove);
    if (!favoriteToRemove) {
      setFavError('Could not find that favorite. Refresh the page and try again.');
      return;
    }
    fetch(`${dburl}/favorites/${localid}/${favoriteToRemove.key}.json?auth=${idToken}`, {
      method: 'DELETE'
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error('Network response was not ok.');
        }
        setFavorites((prev) => prev.filter((fav) => fav.id !== idToRemove));
        setIsFavorite(false);
        setFavError(null);
      })
      .catch((error) => {
        console.error('Error removing data:', error);
        setFavError('Could not remove from favorites. Please try again.');
      });
  };

  return (
    <div>
      {userlogin && (
        <div className="mx-auto flex w-full max-w-4xl justify-start px-4 sm:px-6">
          <button
            type="button"
            onClick={backbutton}
            className="mt-6 flex w-fit cursor-pointer items-center gap-1 rounded-lg px-4 py-2 text-sm font-medium text-base-content/60 transition-colors hover:text-primary"
          >
            <span className="material-symbols-outlined text-lg">arrow_back</span>
            Back
          </button>
        </div>
      )}
      {favError && (
        <div className="mx-auto mt-6 flex w-full max-w-4xl items-center justify-between gap-3 rounded-xl border border-error/30 bg-error/5 px-4 py-3 text-sm text-error">
          <span className="flex items-center gap-2 px-1">
            <span className="material-symbols-outlined text-lg">error</span>
            {favError}
          </span>
          <button
            type="button"
            onClick={() => setFavError(null)}
            className="flex h-8 w-8 shrink-0 cursor-pointer items-center justify-center rounded-lg hover:bg-error/10"
            aria-label="Dismiss"
          >
            <span className="material-symbols-outlined text-lg">close</span>
          </button>
        </div>
      )}
      <Meal
        recipe={recipe}
        addFavorites={addFavorites}
        removeFavorites={removeFavorites}
        isFavorite={isFavorite}
      />
    </div>
  );
}