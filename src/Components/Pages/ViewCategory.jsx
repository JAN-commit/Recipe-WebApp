import React, { useState, useEffect } from 'react';
import RecipeList from '../RecipeDashboard/RecipeList';
import { useLocation, useNavigate } from 'react-router-dom';

export default function ViewCategory({ category }) {
    localStorage.setItem('back', '/SearchIngredient')

    const navigate = useNavigate()

    const location = useLocation();
    const { name } = location.state;

    const [recipes, setRecipes] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const fetchRecipes = async () => {
        setLoading(true);
        setError(null);
        try {
            const response = await fetch(`https://www.themealdb.com/api/json/v1/1/filter.php?c=${name}`);
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
            setError('Failed to fetch recipes');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchRecipes();
    }, [category]);

    return (
        <div id="body">
            <button className='ml-3 top-20 btn bg-neutral py-0 px-5 mb-2'
                onClick={
                    () => { navigate('/SearchIngredient') }
                }
            >Back</button>

            
            <div className='flex flex-col items-center px-5 min-h-screen pt-5'>
                <div className='w-full max-w-7xl'>
                    {error && (
                        <div className="text-center text-red-500">{error}</div>
                    )}
                    <div className="flex flex-wrap justify-center gap-4 py-5">
                        <RecipeList recipes={recipes} loading={loading} />
                    </div>
                </div>
            </div>
        </div>
    );
}
