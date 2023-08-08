import { async } from 'regenerator-runtime';
import { API_URL, RES_PER_PAGE, KEY } from './config.js';
import { AJAX } from './helpers.js';

/* The code is exporting an object named `state` that contains the current state of the application. It
includes properties for `recipe`, `search`, and `bookmarks`. */
export const state = {
  recipe: {},
  search: {
    query: '',
    results: [],
    page: 1,
    resultsPerPage: RES_PER_PAGE,
  },
  bookmarks: [],
};

/**
 * The function creates a recipe object by extracting specific properties from the input data.
 * @param data - The `data` parameter is an object that contains the recipe data.
 * @returns The function `createRecipeObject` returns an object with the following properties:
 */
const createRecipeObject = function (data) {
  const { recipe } = data.data;
  return {
    id: recipe.id,
    title: recipe.title,
    publisher: recipe.publisher,
    sourceUrl: recipe.source_url,
    image: recipe.image_url,
    servings: recipe.servings,
    cookingTime: recipe.cooking_time,
    ingredients: recipe.ingredients,
    ...(recipe.key && { key: recipe.key }),
  };
};


/**
 * The `loadRecipe` function loads a recipe from an API, creates a recipe object, checks if the recipe
 * is bookmarked, and logs the recipe object.
 * @param id - The `id` parameter is the unique identifier of the recipe that you want to load. It is
 * used to make a request to the API to fetch the recipe data.
 */
export const loadRecipe = async function (id) {
  try {
    const data = await AJAX(`${API_URL}${id}?key=${KEY}`);
    state.recipe = createRecipeObject(data);

    if (state.bookmarks.some(bookmark => bookmark.id === id))
      state.recipe.bookmarked = true;
    else state.recipe.bookmarked = false;

    console.log(state.recipe);
  } catch (err) {
    // Temp error handling
    console.error(`${err} 💥💥💥💥`);
    throw err;
  }
};

/**
 * The function `loadSearchResults` is an asynchronous function that takes a query as a parameter,
 * updates the state with the query, makes an AJAX request to an API using the query and a key, and
 * then updates the state with the search results.
 * @param query - The `query` parameter is a string that represents the search query for the API
 * request. It is used to search for recipes based on a specific keyword or term.
 */
export const loadSearchResults = async function (query) {
  try {
    state.search.query = query;

    const data = await AJAX(`${API_URL}?search=${query}&key=${KEY}`);
    console.log(data);

    state.search.results = data.data.recipes.map(rec => {
      return {
        id: rec.id,
        title: rec.title,
        publisher: rec.publisher,
        image: rec.image_url,
        ...(rec.key && { key: rec.key }),
      };
    });
    state.search.page = 1;
  } catch (err) {
    console.error(`${err} 💥💥💥💥`);
    throw err;
  }
};


/**
 * The function returns a specific page of search results based on the current page number.
 * @param [page] - The `page` parameter is used to specify the page number of the search results to
 * retrieve. It has a default value of `state.search.page`, which means if no value is provided for
 * `page`, it will use the current page number stored in the `state.search.page` variable.
 * @returns a portion of the search results array based on the current page and the number of results
 * per page.
 */
export const getSearchResultsPage = function (page = state.search.page) {
  state.search.page = page;

  const start = (page - 1) * state.search.resultsPerPage; // 0
  const end = page * state.search.resultsPerPage; // 9

  return state.search.results.slice(start, end);
};


/**
 * The function updates the quantity of ingredients based on the new number of servings and updates the
 * number of servings in the recipe.
 */
export const updateServings = function (newServings) {
  state.recipe.ingredients.forEach(ing => {
    ing.quantity = (ing.quantity * newServings) / state.recipe.servings;
    // newQt = oldQt * newServings / oldServings // 2 * 8 / 4 = 4
  });

  state.recipe.servings = newServings;
};

const persistBookmarks = function () {
  localStorage.setItem('bookmarks', JSON.stringify(state.bookmarks));
};


/**
 * The addBookmark function adds a recipe to the bookmarks list and marks the current recipe as
 * bookmarked.
 * @param recipe - The `recipe` parameter is an object that represents a recipe. It likely has
 * properties such as `id`, `name`, `ingredients`, `instructions`, etc.
 */
export const addBookmark = function (recipe) {
  // Add bookmark
  state.bookmarks.push(recipe);

  // Mark current recipe as bookmarked
  if (recipe.id === state.recipe.id) state.recipe.bookmarked = true;

  persistBookmarks();
};


/**
 * The `deleteBookmark` function deletes a bookmark from the `state.bookmarks` array and updates the
 * `state.recipe.bookmarked` property if necessary.
 * @param id - The `id` parameter is the unique identifier of the bookmark that needs to be deleted.
 */
export const deleteBookmark = function (id) {
  // Delete bookmark
  const index = state.bookmarks.findIndex(el => el.id === id);
  state.bookmarks.splice(index, 1);

  // Mark current recipe as NOT bookmarked
  if (id === state.recipe.id) state.recipe.bookmarked = false;

  persistBookmarks();
};


/**
 * The code initializes a bookmarks storage using the localStorage API in JavaScript and provides a
 * function to clear the bookmarks.
 */
const init = function () {
  const storage = localStorage.getItem('bookmarks');
  if (storage) state.bookmarks = JSON.parse(storage);
};
init();

const clearBookmarks = function () {
  localStorage.clear('bookmarks');
};
// clearBookmarks();

/**
 * The `uploadRecipe` function takes a new recipe object as input, filters and formats the ingredients,
 * and then sends the recipe data to an API for uploading.
 * @param newRecipe - The `newRecipe` parameter is an object that contains the details of a recipe. It
 * has the following properties:
 */
export const uploadRecipe = async function (newRecipe) {
  try {
    const ingredients = Object.entries(newRecipe)
      .filter(entry => entry[0].startsWith('ingredient') && entry[1] !== '')
      .map(ing => {
        const ingArr = ing[1].split(',').map(el => el.trim());
        // const ingArr = ing[1].replaceAll(' ', '').split(',');
        if (ingArr.length !== 3)
          throw new Error(
            'Wrong ingredient fromat! Please use the correct format :)'
          );

        const [quantity, unit, description] = ingArr;

        return { quantity: quantity ? +quantity : null, unit, description };
      });

    const recipe = {
      title: newRecipe.title,
      source_url: newRecipe.sourceUrl,
      image_url: newRecipe.image,
      publisher: newRecipe.publisher,
      cooking_time: +newRecipe.cookingTime,
      servings: +newRecipe.servings,
      ingredients,
    };

    const data = await AJAX(`${API_URL}?key=${KEY}`, recipe);
    state.recipe = createRecipeObject(data);
    addBookmark(state.recipe);
  } catch (err) {
    throw err;
  }
};