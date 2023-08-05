import * as model from './model.js'
import recipeView from './views/recipeView.js';
import searchView from './views/searchView.js';
import resultsView from './views/resultsView.js';
import paginationView from './views/paginationView.js';

import 'core-js/stable';
import 'regenerator-runtime/runtime';
import { async } from 'regenerator-runtime';

// if (module.hot) {
//   module.hot.accept();
// };

const controlRecipes = async function () {
  try {
    const id = window.location.hash.slice(1);

    if (!id) return;
    recipeView.renderSpinner();

    // Loading recipe
    await model.loadRecipe(id);

    // Rendering recipe
    recipeView.render(model.state.recipe);
  } catch (err) {
    recipeView.renderError()
  }
};
// # challange refactor button to fuction called generateBtn to achieve DRY

const controlSearchResults = async function () {
  try {
    resultsView.renderSpinner();

    // 1) Get search query
    const query = searchView.getQuery();
    if (!query) return;

    // 2) Load search results
    await model.loadSearchResults(query);

    // 3) Render results
    resultsView.render(model.getSearchResultsPage());
  
    // 4) Render initial pagination buttons
    paginationView.render(model.state.search);
  } catch (err) {
    console.log(err);
  }
};

const constrolPagination = function (gotToPage) {
      // 1) New Render results
    resultsView.render(model.getSearchResultsPage(gotToPage));
  
    // 2) Render new initial pagination buttons
    paginationView.render(model.state.search);
} 

const controlServings = function (newServings) {
  // update the recipe servings (in state)
  model.updateServings(newServings);
  // Update the recipe view
  recipeView.render(model.state.recipe);
}

const init = function () {
  recipeView.addHandlerRender(controlRecipes);
  recipeView.addHandlerUpdateServings(controlServings);
  searchView.addHandlerSearch(controlSearchResults);
  paginationView.addHanderCick(constrolPagination);
  
};

init();
