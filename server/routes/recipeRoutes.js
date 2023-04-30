const express = require("express");
const recipeController = require("../controllers/recipeController");
const router = express.Router();

router.get("/", recipeController.homepage);
router.get("/categories", recipeController.exploreCategories);
router.get("/recipe/:id", recipeController.exploreRecipe);
router.get("/categories/:id", recipeController.exploreCategoriesById);
router.post("/search", recipeController.searchRecipe);
router.get("/explore-latest", recipeController.exploreLatest);
router.get("/explore-random", recipeController.exploreRandom);
router.get("/submit-recipe", recipeController.submitRecipe);
router.post("/submit-recipe", recipeController.submitRecipeOnPost);

module.exports = router;
