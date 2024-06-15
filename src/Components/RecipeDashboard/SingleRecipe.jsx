import React from 'react';
import { useNavigate } from 'react-router-dom';

export default function SingleRecipe({ recipe }) {
    const navigate = useNavigate();

    return (
        <div className="p-3 cursor-pointer" onClick={() => { navigate(`/RecipeSingleView/${recipe.id}`); }}>
            <div className="card bg-base-100 shadow-xl dark:bg-base-900">
                <figure className="flex items-center justify-center">
                    <img src={recipe.image} alt={recipe.title} className="max-h-full max-w-full" />
                </figure>
                <div className="card-body p-4">
                    <h2 className="card-title text-lg dark:text-white">{recipe.title}</h2>
                </div>

            </div>
        </div>
    );
}
