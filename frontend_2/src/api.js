
export const searchRecipe = async (searchTerm, page) => {
    const baseURL = new URL("http://localhost:5000/api/recipes/search");
    baseURL.searchParams.append("searchTerm", searchTerm);
    baseURL.searchParams.append("page", String(page));

    try{
    const response = await fetch(baseURL);
    if(!response.ok){
        throw new Error(`HTTP error status: ${response.status}`);
    }

    return response.json();
} catch(err){
    console.log(err);
}
};

export const getSummary = async (recipeID) => {
    const url = `http://localhost:5000/api/recipes/${recipeID}/summary`;
    const response = await fetch(url);

    if(!response.ok){
        throw new Error(`HTTP error ! Status: ${response.status}`);
    }
    return response.json();
};

export const getFavouriteRecipes = async () => {
    const url = `http://localhost:5000/api/recipes/favourite`;
    const response = await fetch(url);

    if(!response.ok){
        throw new Error(`HTTP error ! Status: ${response.status}`);
    }
    return response.json();

}; 

export const addFavRecipe = async(recipe) => {
    const url = `http://localhost:5000/api/recipes/favourite`;
    const body = {
        recipeID: recipe.id,
    };
    const response = await fetch(url, {
        method: "POST",
        headers: {
            "Content-type": "application/json"
        },
        body: JSON.stringify(body)

    });

    if(!response.ok){
        throw new Error(`HTTP error ! Status: ${response.status}`);
    }
};

export const deleteFavRecipe = async(recipe) => {
    const url = `http://localhost:5000/api/recipes/favourite`;
    const body = {
        recipeid: recipe.id,
    };
    const response = await fetch(url, {
        method: "DELETE",
        headers: {
            "Content-type": "application/json"
        },
        body: JSON.stringify(body)
    });
    if(!response.ok){
        throw new Error(`HTTP error ! Status: ${response.status}`);
    }
};
