import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import Meal from '../RecipeDashboard/Meal';

export default function RecipeSingleView() {
    const location = useLocation();
    // const { id } = location.state;
    const { id } = useParams();
    const [recipe, setRecipe] = useState(null);
    const [isFavorite, setIsFavorite] = useState(false);
    const [favorites, setFavorites] = useState([]);
    const navigate = useNavigate();

    // check if the user login
    const userlogin = localStorage.getItem('idToken')
    const idToken = localStorage.getItem('idToken')


    const localid = localStorage.getItem('localId');
    const dburl = import.meta.env.VITE_FIREBASE_DB_URL;
    const favoritesURL = `${dburl}/favorites/${localid}.json?auth=${idToken}`;

    useEffect(() => {
        const fetchRecipeById = async () => {
            try {
                const response = await fetch(`https://www.themealdb.com/api/json/v1/1/lookup.php?i=${id}`);
                if (!response.ok) {
                    throw new Error('Failed to fetch recipe');
                }
                const data = await response.json();
                const fetchedRecipe = {
                    id: data.meals[0].idMeal,
                    image: data.meals[0].strMealThumb,
                    title: data.meals[0].strMeal,
                    description: data.meals[0].strInstructions,
                    youtube: data.meals[0].strYoutube,
                    source: data.meals[0].strSource,
                    area: data.meals[0].strArea
                };
                setRecipe(fetchedRecipe);
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

                const favoritesArray = data ? Object.entries(data).map(function (entry) {
                    const key = entry[0];
                    const value = entry[1];
                    return { key: key, ...value };
                }) : [];

                setFavorites(favoritesArray);
                setIsFavorite(favoritesArray.some(fav => fav.id === id));
            } catch (error) {
                console.error('Error fetching favorites:', error);
            }
        };

        if (id) {
            fetchRecipeById();
            fetchFavorites();
        }
    }, [id, favoritesURL]);

    if (!recipe) {
        return (
            <div className="flex justify-center w-full">
                <span className="loading loading-spinner loading-lg"></span>
            </div>
        );
    }

    const backbutton = function () {
        const back = localStorage.getItem('back');
        navigate(back);
    };

    const addFavorites = function (recipe) {
        const userData = {
            id: recipe.id,
            title: recipe.title,
        };
        try {
            fetch(favoritesURL, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(userData)
            })
                .then(response => {
                    if (!response.ok) {
                        throw new Error('Network response was not ok.');
                    }
                    return response.json();
                })
                .then(data => {
                    console.log("Data successfully added:", data);
                    setFavorites(prevFavorites => [...prevFavorites, { key: data.name, ...userData }]);
                    setIsFavorite(true);
                })
                .catch(error => {
                    console.error("Error adding data:", error);
                });
        } catch (error) {
            console.error("Error adding data:", error);
        }
    };

    const removeFavorites = function (idToRemove) {
        const favoriteToRemove = favorites.find(function (fav) {
            return fav.id === idToRemove;
        });

        try {
            fetch(`${dburl}/favorites/${localid}/${favoriteToRemove.key}.json?auth=${idToken}`, {


                method: 'DELETE',
            })
                .then(response => {
                    if (!response.ok) {
                        throw new Error('Network response was not ok.');
                    }
                    setFavorites(prevFavorites => {
                        return prevFavorites.filter(function (fav) {
                            return fav.id !== idToRemove;
                        });
                    });
                    setIsFavorite(false);
                })
                .catch(error => {
                    console.error("Error removing data:", error);
                });
        } catch (error) {
            console.error("Error removing data:", error);
        }
    };

    return (
        <div className="p-4">
            {userlogin && (
                <button className="btn bg-neutral py-0 px-5 mb-2" onClick={backbutton}>Back</button>
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
