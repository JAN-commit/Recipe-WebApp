import PropTypes from 'prop-types';
import SingleRecipe from './SingleRecipe';

export default function RecipeList({ recipes, loading }) {
  if (loading) {
    return (
      <div className="flex w-full justify-center py-16">
        <span className="loading loading-spinner loading-lg text-primary"></span>
      </div>
    );
  }

  if (!recipes.length) {
    return null;
  }

  return (
    <div className="grid w-full grid-cols-2 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
      {recipes.map((recipe, index) => (
        <SingleRecipe key={recipe.id ?? index} recipe={recipe} />
      ))}
    </div>
  );
}

RecipeList.propTypes = {
  recipes: PropTypes.arrayOf(PropTypes.object).isRequired,
  loading: PropTypes.bool,
};