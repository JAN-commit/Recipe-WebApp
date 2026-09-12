import { useState } from 'react';
import PropTypes from 'prop-types';

const ingredientType = PropTypes.shape({
  name: PropTypes.string,
  measure: PropTypes.string,
});

function parseSteps(text) {
  const raw = text ? text.trim() : '';
  if (!raw) return [];

  const lines = raw
    .split(/\r?\n+/)
    .map((line) => line.trim())
    .filter((line) => line.length > 0);

  // Whole-line markers: "1", "2.", "STEP 1", ...
  const isMarkerLine = (line) => /^(?:step\s*)?\d{1,2}\s*[-.:)]?\s*$/i.test(line);

  const hasMarkers = lines.some(
    (line) =>
      isMarkerLine(line) || /^step\s*\d+/i.test(line) || /^\d{1,2}\s*[-.:)]\s+/i.test(line)
  );

  // No markers at all: plain prose, one step per sentence.
  if (!hasMarkers) {
    return raw
      .split(/(?<=[.!?])\s+/)
      .map((sentence) => sentence.trim())
      .filter((sentence) => sentence.length > 0)
      .map((body) => ({ title: '', body }));
  }

  const steps = [];
  let current = null;
  const pushCurrent = () => {
    if (current) steps.push(current);
    current = null;
  };

  for (const line of lines) {
    if (isMarkerLine(line)) {
      pushCurrent();
      current = { title: '', bodyLines: [] };
      continue;
    }

    // Inline markers with content on the same line: "STEP 1 Do this", "1. Do this"
    const stepWord = line.match(/^step\s*\d+\s*[:.]?\s*(.*)$/i);
    const numbered = line.match(/^\d{1,2}\s*[-.:)]\s+(.*)$/);
    const inline = stepWord ? stepWord[1] : numbered ? numbered[1] : null;
    if (inline !== null) {
      pushCurrent();
      current = { title: '', bodyLines: [] };
      if (inline.trim()) current.bodyLines.push(inline.trim());
      continue;
    }

    if (!current) current = { title: '', bodyLines: [] };
    current.bodyLines.push(line);
  }
  pushCurrent();

  // Pull lead-in titles out of each step: short header lines
  // ("Preparation") and "Title: rest" openers ("Make the burgers: ...").
  return steps
    .map((step) => {
      let { title, bodyLines } = step;
      if (!title && bodyLines.length > 1) {
        const [first, ...rest] = bodyLines;
        if (first.length <= 45 && !/[.!?]$/.test(first)) {
          title = first.replace(/:$/, '');
          bodyLines = rest;
        }
      }
      if (!title && bodyLines.length === 1) {
        const titled = bodyLines[0].match(/^([^:.!?]{3,45})(?<!\d):\s+(.+)$/);
        if (titled) {
          title = titled[1];
          bodyLines = [titled[2]];
        }
      }
      return { title, body: bodyLines.join(' ') };
    })
    .filter((step) => step.title || step.body);
}

export default function Meal({ recipe, addFavorites, removeFavorites, isFavorite }) {
  const userlogin = localStorage.getItem('idToken');
  const steps = parseSteps(recipe.description);
  const [checked, setChecked] = useState(() =>
    (recipe.ingredients ?? []).map(() => false)
  );

  const toggle = (index) =>
    setChecked((prev) => prev.map((value, i) => (i === index ? !value : value)));

  return (
    <article className="mx-auto w-full max-w-4xl px-4 pt-8 pb-4 sm:px-6">
      <header className="text-center">
        <h1 className="font-display text-3xl leading-tight font-semibold text-balance sm:text-4xl lg:text-5xl">
          {recipe.title}
        </h1>
        <div className="mt-3 inline-flex items-center gap-2 rounded-full border border-base-300 bg-base-200 px-3 py-1 text-xs font-semibold tracking-wide text-base-content/70 uppercase">
          <span className="material-symbols-outlined text-sm">public</span>
          {recipe.area || 'Recipe'}
        </div>
      </header>

      <div className="mt-8 overflow-hidden rounded-xl border border-base-300">
        <img
          src={recipe.image}
          alt={recipe.title}
          className="aspect-[16/10] w-full object-cover"
        />
      </div>

      <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
        {userlogin && (
          <button
            type="button"
            onClick={() => (isFavorite ? removeFavorites(recipe.id) : addFavorites(recipe))}
            className={`btn ${isFavorite ? 'btn-outline btn-primary' : 'btn-primary'}`}
          >
            <span
              className={`material-symbols-outlined text-lg ${isFavorite ? 'material-symbols-filled' : ''}`}
            >
              {isFavorite ? 'favorite' : 'favorite_border'}
            </span>
            {isFavorite ? 'Saved to favorites' : 'Save to favorites'}
          </button>
        )}
        {recipe.youtube && (
          <a
            href={recipe.youtube}
            target="_blank"
            rel="noopener noreferrer"
            className="btn btn-outline"
          >
            <span className="material-symbols-outlined text-lg">play_circle</span>
            Watch video
          </a>
        )}
        {recipe.source && (
          <a
            href={recipe.source}
            target="_blank"
            rel="noopener noreferrer"
            className="btn btn-ghost"
          >
            View source
          </a>
        )}
      </div>

      <div className="mt-12 grid gap-10 lg:grid-cols-[minmax(0,1.4fr)_minmax(0,1fr)]">
        <section>
          <h2 className="font-display text-2xl font-semibold">How to make it</h2>
          <div className="mt-5 space-y-6">
            {steps.map((step, index) => (
              <div key={index} className="flex gap-4">
                <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-primary/40 bg-primary/10 font-display text-sm font-semibold text-primary">
                  {index + 1}
                </span>
                <div>
                  {step.title && (
                    <p className="font-display font-semibold">{step.title}</p>
                  )}
                  {step.body && (
                    <p
                      className={`leading-relaxed text-base-content/80 ${
                        step.title ? 'mt-1' : ''
                      }`}
                    >
                      {step.body}
                    </p>
                  )}
                </div>
              </div>
            ))}
            {steps.length === 0 && (
              <p className="text-sm text-base-content/50">
                No instructions available for this recipe.
              </p>
            )}
          </div>
        </section>

        <aside>
          <div className="rounded-xl border border-base-300 bg-base-100 shadow-card">
            <div className="flex items-center gap-2 border-b border-base-300 px-5 py-4">
              <span className="material-symbols-outlined text-xl text-secondary">shopping_basket</span>
              <h2 className="font-display text-xl font-semibold">Ingredients</h2>
            </div>
            <ul className="px-5 py-4">
              {(recipe.ingredients ?? []).map((ingredient, index) => (
                <li key={`${ingredient.name}-${index}`}>
                  <label className="flex cursor-pointer items-start gap-3 py-1.5">
                    <input
                      type="checkbox"
                      checked={checked[index] ?? false}
                      onChange={() => toggle(index)}
                      className="checkbox checkbox-secondary checkbox-sm mt-0.5"
                    />
                    <span
                      className={`text-sm leading-relaxed ${
                        checked[index] ? 'text-base-content/40 line-through' : 'text-base-content/80'
                      }`}
                    >
                      <span className="font-medium">{ingredient.measure}</span>{' '}
                      {ingredient.name}
                    </span>
                  </label>
                </li>
              ))}
              {(recipe.ingredients ?? []).length === 0 && (
                <li className="text-sm text-base-content/50">No ingredient list available.</li>
              )}
            </ul>
          </div>
        </aside>
      </div>
    </article>
  );
}

Meal.propTypes = {
  recipe: PropTypes.shape({
    id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    title: PropTypes.string,
    image: PropTypes.string,
    description: PropTypes.string,
    area: PropTypes.string,
    youtube: PropTypes.string,
    source: PropTypes.string,
    ingredients: PropTypes.arrayOf(ingredientType),
  }),
  addFavorites: PropTypes.func,
  removeFavorites: PropTypes.func,
  isFavorite: PropTypes.bool,
};