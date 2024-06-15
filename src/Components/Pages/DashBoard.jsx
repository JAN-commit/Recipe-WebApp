import React, { useState, useEffect } from 'react';
import RecipeList from '../RecipeDashboard/RecipeList';
import { useLocation, useNavigate } from 'react-router-dom';

export default function Dashboard() {
    localStorage.setItem('back', '/Dashboard')
    const navigate = useNavigate()
    const [recipes, setRecipes] = useState([]);
    const [loading, setLoading] = useState(true);






    useEffect(() => {
        const idToken = localStorage.getItem('idToken');

        // Check if idToken exists in localStorage
        if (idToken) {


            // Set interval to check expiry
            const interval = setInterval(() => {
                const currentTime = new Date();
                const storedExpiryTime = new Date(localStorage.getItem('expiryTime'));
                // const storedExpiryTime = new Date(10);

                if (currentTime >= storedExpiryTime) {
                    // Clear localStorage items and interval
                    localStorage.removeItem('expiresIn');
                    localStorage.removeItem('idToken');
                    localStorage.removeItem('localId');
                    localStorage.removeItem('expiryTime');
                    clearInterval(interval);

                    // Alert user and navigate to login page
                    // alert("Session Expired. Please Login Again");

                    navigate('/Dashboard');
                }
            }, 1000);

            // Clean up interval on component unmount
            return () => clearInterval(interval);
        } else {
            navigate('/Login');

        }
    }, []);

    
    const fetchRandomRecipe = async () => {
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
    };

    const fetchInitialRecipes = async () => {
        setLoading(true);
        const recipePromises = [];
        for (let i = 0; i < 8; i++) {
            recipePromises.push(fetchRandomRecipe());
        }

        try {
            const fetchedRecipes = await Promise.all(recipePromises);
            const filteredRecipes = fetchedRecipes.filter(recipe => recipe !== null);
            setRecipes(filteredRecipes);
        } catch (error) {
            console.error('Error fetching initial recipes:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchInitialRecipes();
    }, []);

    return (
        <div className='flex flex-col items-center px-5 min-h-screen pt-'>
            <div className='w-full max-w-7xl'>
                <div className="flex flex-wrap justify-center gap-4 py-5">
                    {loading ? (
                        <span className="loading loading-spinner loading-lg"></span>
                    ) : (
                        <RecipeList recipes={recipes} loading={loading} />
                    )}
                </div>
            </div>
        </div>
    );
}
