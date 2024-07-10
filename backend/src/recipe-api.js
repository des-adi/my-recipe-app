require("dotenv").config();
const axios = require('axios');
const apiKey = process.env.API_KEY ; 

const searchRecipes = async (searchTerm, page) => {
    if (!apiKey) {
        throw new Error("API key not found");
    }
    const url = `https://api.spoonacular.com/recipes/complexSearch`;

    const queryParams = {
        apiKey: apiKey,
        query: searchTerm,
        number: "10",
        offset: (page * 10).toString(),
    };

    try {
        const response = await axios.get(url, { params: queryParams });
        const resultsJSON = response.data;
        console.log(resultsJSON);
        return resultsJSON; // Return the result

    } catch (err) {
        console.log(err);
        return null; // or throw an error, depending on your use case
    }
};

const getRecipeSummary = async(recipeID) => {
    if (!apiKey) {
        throw new Error("API key not found");
    }
    const url = `https://api.spoonacular.com/recipes/${recipeID}/summary`;

    const params = {
        apiKey: apiKey,
    };

    try {
       const response = await axios.get(url, {params: params}) ;
       const resultsJSON = response.data;
       return resultsJSON;
    } catch (err) {
        console.log(err);
        return null;
    }
}

const getFavouriteRecipeByIDs = async(ids) => {
    if (!apiKey) {
        throw new Error("API key not found");
    }

    const url = `https://api.spoonacular.com/recipes/informationBulk`;
    const queryParams = {
        apiKey: apiKey,
        ids: ids.join(",")
    }
    try {
        const response = await axios.get(url, {params: queryParams});
        const resultsJSON = response.data;
        return resultsJSON;
    } catch (error) {
        console.log(error);
        return null;
    }
};
module.exports = {searchRecipes, getRecipeSummary, getFavouriteRecipeByIDs};