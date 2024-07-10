import React, { useEffect, useRef, useState } from 'react'
import './App.css'
import { getFavouriteRecipes, searchRecipe, addFavRecipe, deleteFavRecipe } from './api';
import RecipeCard from './components/RecipeCard';
import RecipeModal from './components/RecipeModal';
import { AiOutlineSearch } from 'react-icons/ai';

const App = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [recipes, setRecipes] = useState([]);
  const pageNumber = useRef(1);
  const [selectedRecipe, setSelectedRecipe] = useState(undefined);
  const [selectedTab, setSelectedTab] = useState('');
  const [favouriteRecipes, setFavouriteRecipes] = useState([]);
  const [fetchedFavouriteRecipes, setFetchedFavouriteRecipes] = useState(false);

  useEffect(() => {
    const fetchFavouriteRecipes = async () => {
      try {
        const favouriteRecipes = await getFavouriteRecipes();
        setFavouriteRecipes(favouriteRecipes);
        setFetchedFavouriteRecipes(true);
      } catch (err) {
        console.log(err);
      }
    };
    if (!fetchedFavouriteRecipes) {
      fetchFavouriteRecipes();
    }
  }, [fetchedFavouriteRecipes]);

  //event handlers
  const handleSearchSubmit = async (e) => {
    e.preventDefault();
    try {
      const recipes = await searchRecipe(searchTerm, 1);
      console.log(recipes.answer.results);
      setRecipes(recipes.answer.results);
      pageNumber.current = 1;
    } catch (err) {
      console.log(err);
    }
  }

  const handleView = async () => {
    const newPage = pageNumber.current + 1;
    try {
      const nextRecipes = await searchRecipe(searchTerm, newPage);
      setRecipes([...recipes, ...nextRecipes.answer.results]);
      pageNumber.current = newPage;
    } catch (err) {
      console.log(err);
    }
  }

  const addFavouriteRecipe = async (recipe) => {
    try {
      await addFavRecipe(recipe);
      setFavouriteRecipes([...favouriteRecipes, recipe]);
    } catch (err) {
      console.log(err);
    }
  }

  const deleteFavouriteRecipe = async (recipe) => {
    try {
      await deleteFavRecipe(recipe);
      const updatedFavouriteRecipes = favouriteRecipes.filter((favRecipe) => recipe.id !==favRecipe.id);
      setFavouriteRecipes(updatedFavouriteRecipes);
    } catch (err) {
      console.log(err);
    }
  }


  return (
    <div className='app-container'>
      <div className="header">
        <img src="/hero-image.jpg" />
        <div className="title">My Recipe App</div>
      </div>
      <div className="tabs">
        <h1 className={selectedTab === 'search' ? "tab-active" : " "} onClick={() => setSelectedTab("search")}>Recipe Search</h1>
        <h1 className={selectedTab === 'favourites' ? "tab-active" : " "} onClick={() => setSelectedTab("favourites")} >Favourites</h1>
      </div>
      {selectedTab === 'search' && (
        <>
          <form onSubmit={(e) => handleSearchSubmit(e)}>
            <input type='text' required placeholder='Enter the search term' value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)}></input>
            <button type='submit'><AiOutlineSearch size={40} /></button>
          </form>
          <div className='recipe-grid'>
          {recipes.length > 0 && recipes.map((recipe) => {
            const isFavourite = favouriteRecipes.some((favRecipe) => recipe.id === favRecipe.id);
            return (
              <RecipeCard
                key={recipe.id}
                recipe={recipe}
                onClick={() => setSelectedRecipe(recipe)}
                onFavouriteButtonClick={isFavourite ? deleteFavouriteRecipe : addFavouriteRecipe}
                isFavourite={isFavourite}
              />
            );
          })}
          </div>

          <button onClick={handleView} className="view-more-button">View More</button>
        </>
      )}

      {selectedTab === 'favourites' &&
        <div className='recipe-grid'>
          {favouriteRecipes.map((recipe) => {
            return (
              <RecipeCard recipe={recipe} onClick={() => setSelectedRecipe(recipe)} onFavouriteButtonClick={deleteFavouriteRecipe} isFavourite={true} />
            );
          })}
        </div>
      }

      {selectedRecipe ? <RecipeModal recipeID={selectedRecipe.id.toString()} onClose={() => setSelectedRecipe(undefined)} /> : null}
    </div>
  )
}

export default App;
