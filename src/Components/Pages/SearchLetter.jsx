import React, { useState, useEffect } from 'react';
import RecipeList from '../RecipeDashboard/RecipeList';

export default function SearchLetter() {
  localStorage.setItem('back', '/SearchLetter')

  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(false);
  const [recipes, setRecipes] = useState([]);

  const handleLetterClick = async (letter) => {
    setSearch(letter);
    await handleSearch(letter);
  };

  const handleSearch = async (letter) => {
    try {
      setLoading(true);
      const response = await fetch(`https://www.themealdb.com/api/json/v1/1/search.php?f=${letter}`);

      if (!response.ok) {
        throw new Error('Failed to fetch recipes');
      }

      const data = await response.json();
      if (data.meals) {
        const newRecipes = data.meals.map(meal => ({
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

  const handleChange = (event) => {
    setSearch(event.target.value);
  };

  return (
    <div className=''>
        <div className="label mb-3 p-5">
          <h1 className="text-4xl font-semibold text-center">Select letter</h1>
        </div>
    <div id="body" className="flex flex-col items-center min-h-screen px-5 pt-">
      <div id="letters" className="w-full max-w-3xl mt-10">
        <div className="flex flex-wrap justify-center gap-4">
          {Array.from({ length: 26 }, (_, index) => (
            <button
              key={index}
              onClick={() => handleLetterClick(String.fromCharCode(65 + index))}
              className="btn btn-secondary flex items-center w-10 h-10 sm:w-12 sm:h-14 md:w-15 md:h-15"
            >{String.fromCharCode(65 + index)}
            </button>
          ))}
        </div>
      </div>

      <div className="flex flex-wrap justify-center gap-4 py-5">
        {loading ? (
          <span className="loading loading-spinner loading-lg"></span>
        ) : (
          <div className="flex flex-wrap justify-center gap-4 py-5">
            <RecipeList recipes={recipes} loading={loading} />
          </div>
        )}
      </div>

    </div>
          </div>
  );
}
