import React from 'react';
import SingleRecipe from './SingleRecipe';

export default function RecipeList({ recipes, loading }) {
    return (
        <div className="grid grid-cols-2 gap-4 w-full sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
            {loading ? (
                <div className="flex justify-center items-center w-full h-full">
                    <span className="loading loading-spinner loading-lg"></span>
                </div>
            ) : (
                recipes.map((recipe, index) => (
                    <SingleRecipe key={index} recipe={recipe} />
                ))
            )}
        </div>
    );
}
