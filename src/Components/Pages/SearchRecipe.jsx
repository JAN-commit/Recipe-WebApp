import React, { useState } from 'react';
import RecipeList from '../RecipeDashboard/RecipeList';

export default function SearchRecipe() {
    localStorage.setItem('back', '/SearchRecipe')
    const [search, setSearch] = useState('');
    const [recipes, setRecipes] = useState([]);
    const [loading, setLoading] = useState(false);

    const handleSearch = async () => {
        if (!search.trim()) return; // Prevent empty searches
        setLoading(true);
        try {
            const response = await fetch(`https://www.themealdb.com/api/json/v1/1/search.php?s=${search}`);
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
        <div id="body">
            <div className="p-5">
                <h1 className="text-4xl font-semibold">Find Recipe</h1>
            </div>
            <div id="search" className='flex justify-center w-full'>
                <label className="form-control w-full max-w-xs">
                    <input
                        type="search"
                        placeholder="Recipe keyword"
                        className="input input-bordered w-full max-w-xs"
                        value={search}
                        onChange={handleChange}
                    />
                    <button
                        className="btn btn-primary mt-2"
                        onClick={handleSearch}
                        disabled={loading}
                    >
                        Search
                    </button>
                </label>
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
    );
}