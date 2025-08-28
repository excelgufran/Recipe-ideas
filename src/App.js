import React, { useState } from 'react';
import './styles.css';

function App() {
  const [ingredient, setIngredient] = useState('');
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [modalRecipe, setModalRecipe] = useState(null);

  // Function to handle the search form submission
  const handleSearch = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setRecipes([]);

    try {
      const response = await fetch(
        `https://www.themealdb.com/api/json/v1/1/filter.php?i=${ingredient}`
      );
      const data = await response.json();
      if (data.meals) {
        setRecipes(data.meals);
      } else {
        setError("No recipes found. Try again!");
      }
    } catch (err) {
      setError("An error occurred while fetching recipes.");
    } finally {
      setLoading(false);
    }
  };

  // Function to fetch and display detailed recipe information in the modal
  const fetchRecipeDetails = async (id) => {
    try {
      const response = await fetch(
        `https://www.themealdb.com/api/json/v1/1/lookup.php?i=${id}`
      );
      const data = await response.json();
      setModalRecipe(data.meals[0]);
    } catch (err) {
      console.error("Failed to fetch recipe details:", err);
    }
  };

  const closeModal = () => {
    setModalRecipe(null);
  };

  // JSX to render the UI
  return (
    <div>
      {/* Header */}
      <header className="header">
        <h1>Recipe Ideas</h1>
        <p className="subtitle">Find meals with the ingredients you have</p>
      </header>

      {/* Search Form */}
      <section className="search-section">
        <form onSubmit={handleSearch}>
          <input
            type="text"
            placeholder="Enter an ingredient (e.g., chicken)"
            value={ingredient}
            onChange={(e) => setIngredient(e.target.value)}
            required
          />
          <button type="submit">Search</button>
        </form>
      </section>

      {/* Conditional Rendering */}
      {loading && <div className="loader">Loading recipes...</div>}
      {error && <div className="error">{error}</div>}

      {/* Recipe Results */}
      <section className="recipe-list">
        {recipes.map(recipe => (
          <div key={recipe.idMeal} className="recipe-card" onClick={() => fetchRecipeDetails(recipe.idMeal)}>
            <img src={recipe.strMealThumb} alt={recipe.strMeal} />
            <h3>{recipe.strMeal}</h3>
          </div>
        ))}
      </section>

      {/* Modal for Recipe Details */}
      {modalRecipe && (
        <div className="modal" onClick={closeModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <span className="close-btn" onClick={closeModal}>&times;</span>
            <h2 id="recipe-title">{modalRecipe.strMeal}</h2>
            <img src={modalRecipe.strMealThumb} alt={modalRecipe.strMeal} />
            <ul id="recipe-ingredients">
              {Object.keys(modalRecipe).filter(key => key.startsWith('strIngredient') && modalRecipe[key]).map((key, index) => (
                <li key={index}>
                  {modalRecipe[key]} - {modalRecipe[`strMeasure${key.slice(13)}`]}
                </li>
              ))}
            </ul>
            <div>
  <h3>Instructions:</h3>
  <ol>
    {modalRecipe.strInstructions
      .split(/\d+\./) // Split the text by a number followed by a period (e.g., "1.", "2.")
      .filter(step => step.trim() !== "") // Remove any empty strings from the resulting array
      .map((step, index) => (
        <li key={index}>
          {step.trim()}
        </li>
      ))}
  </ol>
</div>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;