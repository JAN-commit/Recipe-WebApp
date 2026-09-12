import PropTypes from 'prop-types';
import { useNavigate } from 'react-router-dom';

export default function SingleRecipe({ recipe }) {
  const navigate = useNavigate();

  return (
    <div
      onClick={() => navigate(`/recipe/${recipe.id}`)}
      className="group cursor-pointer"
      role="link"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'Enter') navigate(`/recipe/${recipe.id}`);
      }}
    >
      <div className="overflow-hidden rounded-xl border border-base-300 bg-base-100 shadow-card transition-colors group-hover:border-primary/40">
        <div className="aspect-[4/3] overflow-hidden">
          <img
            src={recipe.image}
            alt={recipe.title}
            loading="lazy"
            className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
          />
        </div>
        <div className="px-4 py-3">
          <h3 className="font-display text-base leading-snug font-semibold text-balance transition-colors group-hover:text-primary">
            {recipe.title}
          </h3>
        </div>
      </div>
    </div>
  );
}

SingleRecipe.propTypes = {
  recipe: PropTypes.shape({
    id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
    image: PropTypes.string,
    title: PropTypes.string,
  }).isRequired,
};