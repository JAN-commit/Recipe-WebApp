import React from 'react'

export default function Meal({ recipe, addFavorites, removeFavorites, isFavorite }) {

  const userlogin = localStorage.getItem('idToken')
  return (
    <div id="body">


      <div className="flex flex-col items-center mt-8">
        <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4">{recipe.title}</h1>
        <div className="w-full max-w-3xl mb-4 flex justify-center ">
          <img
            src={recipe.image}
            alt={recipe.title}
            className="w-[22rem] h-[22rem] rounded-lg shadow-lg "
          />
        </div>
        <div className="w-full max-w-3xl flex justify-between mb-4">
          {recipe.area && (
            <div className="flex space-x-2">
              <button className="btn btn-neutral">{recipe.area}</button>
            </div>
          )}
          <div>

            {userlogin && (
              <div>
                {isFavorite ? (
                  <button className="btn btn-neutral" onClick={() => removeFavorites(recipe.id)}>
                    Remove from Favorites
                  </button>
                ) : (
                  <button className="btn btn-neutral" onClick={() => addFavorites(recipe)}>
                    Add to Favorites
                  </button>
                )}

              </div>
            )}

          </div>
        </div>
        <div className="w-full max-w-3xl text-center">
          <h2 className="text-2xl md:text-3xl lg:text-4xl font-semibold mb-4">Instructions</h2>
          <p className="mb-4 text-justify">{recipe.description}</p>
          <div className="flex justify-center space-x-4 mb-4">
            {recipe.youtube && (
              <a href={recipe.youtube} target="_blank" rel="noopener noreferrer">
                <button className="btn btn-error">Watch on YouTube</button>
              </a>
            )}
            {recipe.source && (
              <a href={recipe.source} target="_blank" rel="noopener noreferrer">
                <button className="btn btn-info">View Source</button>
              </a>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
