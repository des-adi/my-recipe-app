require("dotenv").config();
const express = require("express");
const cors = require("cors");
const db = require("../db/database");
const recipeAPI = require("./recipe-api");
const app = express();


app.use(express.json());
app.use(cors());

//get recipes based on the searchTerm
app.get("/api/recipes/search", async(req,res) => {
    const searchTerm = req.query.searchTerm;
    const page = parseInt(req.query.page);
    const results = await recipeAPI.searchRecipes(searchTerm, page);
    console.log(results);
    res.json({
        answer: results,
    });
});

//get recipe summary
app.get("/api/recipes/:recipeID/summary", async(req,res) => {
    const recipeID = req.params.recipeID;
    const results = await recipeAPI.getRecipeSummary(recipeID);
    return res.json(results);

});

//add a favourite recipe
app.post("/api/recipes/favourite", async(req,res)=> {
    const recipeID = req.body.recipeID;
    try {
        const favouriteRecipe = await db.query("INSERT INTO favourite_recipes(recipeid) VALUES($1)",[recipeID]);
        return res.status(201).json(favouriteRecipe);
    } catch (err) {
        console.log(err);
        return res.status(500).json({error: "Something went wrong"});
    }
});

//get favourite recipes
app.get("/api/recipes/favourite", async(req,res) => {
    try {
        const favouriteRecipes = await db.query("SELECT * FROM favourite_recipes");
        const recipeIds = favouriteRecipes.rows.map((recipe) => {
            return recipe.recipeid;
        });
        const favourites = await recipeAPI.getFavouriteRecipeByIDs(recipeIds);
        return res.json(favourites);
        //console.log(recipeIds);
        //console.log(favouriteRecipes);
    } catch (error) {
        console.log(error);
    }
});

//delete favourite recipe
app.delete("/api/recipes/favourite", async(req,res) => {
    const recipeId = req.body.recipeid;
    try {
        const response = await db.query("DELETE FROM favourite_recipes WHERE recipeid = $1",[recipeId]);
        return res.status(201).json({
            status: "success",
        });
    } catch (err) {
        console.log(err);
    }
});


app.listen(5000, ()=>{
    console.log("server running on localhost:5000");
});