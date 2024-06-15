import React, { useState, useEffect } from 'react';
import RecipeList from '../RecipeDashboard/RecipeList';

const RecipeFavorite = () => {
  localStorage.setItem('back', '/RecipeFavorite')

  const [favorites, setFavorites] = useState([]);
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFavorites = async () => {
      try {
        const dburl = import.meta.env.VITE_FIREBASE_DB_URL;
        const localid = localStorage.getItem('localId');
        
        const idToken = localStorage.getItem('idToken');

        const favoritesURL = `${dburl}/favorites/${localid}/.json?auth=${idToken}`;

        const response = await fetch(favoritesURL);
        if (!response.ok) {
          throw new Error('Failed to fetch favorites');
        }

        const data = await response.json();
        // Map data to array of favorites
        const favoritesArray = data ? Object.entries(data).map(([key, value]) => ({ key, ...value })) : [];
        setFavorites(favoritesArray);
        setLoading(false); 
      } catch (error) {
        console.error('Error fetching favorites:', error);
      }
    };

    fetchFavorites();
  }, []);

  useEffect(() => {
    const fetchRecipeDetails = async () => {
      setLoading(true); // Set loading to true before fetching details

      const fetchedRecipes = await Promise.all(
        favorites.map(async (favorite) => {
          try {
            const response = await fetch(`https://www.themealdb.com/api/json/v1/1/lookup.php?i=${favorite.id}`);
            if (!response.ok) {
              throw new Error(`Failed to fetch recipe with ID ${favorite.id}`);
            }
            const data = await response.json();
            if (data.meals && data.meals.length > 0) {
              const fetchedRecipe = {
                id: data.meals[0].idMeal,
                image: data.meals[0].strMealThumb,
                title: data.meals[0].strMeal,
                description: data.meals[0].strInstructions,
              };
              return fetchedRecipe;
            } else {
              throw new Error(`Recipe with ID ${favorite.id} not found`);
            }
          } catch (error) {
            console.error('Error fetching recipe:', error);
            return null;
          }
        })
      );

      setRecipes(fetchedRecipes.filter(recipe => recipe !== null));
      setLoading(false); // Set loading to false once all recipes are fetched
    };

    if (favorites.length > 0) {
      fetchRecipeDetails();
    }
  }, [favorites]);

  return (
    <div id="body">
      <div id="search" className='flex justify-center w-full'>
        <label className="form-control w-full max-w-xs">
          <div className="label">
            <h1 className="text-5xl font-semibold">My Favorites</h1>
          </div>
        </label>
      </div>

      {loading ? (
        <div className="flex justify-center w-full mt-8">
          <span className="loading loading-spinner loading-lg"></span>
        </div>
      ) : (

        <div className='flex flex-col items-center px-5 min-h-screen pt-'>
          <div className='w-full max-w-7xl'>
            <div className="flex flex-wrap justify-center gap-4 py-5">

              <RecipeList recipes={recipes} loading={loading} />

            </div>

          </div>
        </div>
      )}
    </div>
  );
};

export default RecipeFavorite;
