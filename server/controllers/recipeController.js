require("../models/database");
const Category = require("../models/Category");
const Recipe = require("../models/Recipe");

exports.homepage = async (req, res) => {
  try {
    const limitNumber = 5;
    const categories = await Category.find({}).limit(limitNumber);

    const latest = await Recipe.find({}).sort({ _id: -1 }).limit(limitNumber);
    const thai = await Recipe.find({ category: "Thai" }).limit(limitNumber);
    const american = await Recipe.find({ category: "American" }).limit(
      limitNumber
    );
    const spanish = await Recipe.find({ category: "Spanish" }).limit(
      limitNumber
    );
    const chinesse = await Recipe.find({ category: "Chinese" }).limit(
      limitNumber
    );
    const mexican = await Recipe.find({ category: "Mexican" }).limit(
      limitNumber
    );
    const food = { latest, thai, american, spanish, chinesse, mexican };
    res.render("index", { title: "Cooking Blog - الرئيسية", categories, food });
  } catch (error) {
    res.status(500).send({ message: error.message || "Somthing went wrorng!" });
  }
};

exports.exploreCategories = async (req, res) => {
  try {
    const limitNumber = 20;
    const categories = await Category.find({}).limit(limitNumber);

    res.render("categories", {
      title: "Cooking Blog - Categories",
      categories,
    });
  } catch (error) {
    res.status(500).send({ message: error.message || "Somthing went wrorng!" });
  }
};

exports.exploreRecipe = async (req, res) => {
  try {
    const recipeId = req.params.id;
    const recipe = await Recipe.findById(recipeId);

    res.render("recipe", {
      title: "Cooking Blog - Recipe page",
      recipe,
    });
  } catch (error) {
    res.status(500).send({ message: error.message || "Somthing went wrorng!" });
  }
};

exports.exploreCategoriesById = async (req, res) => {
  try {
    const categoryId = req.params.id;
    const limitNumber = 20;
    const categoryById = await Recipe.find({ category: categoryId }).limit(
      limitNumber
    );
    res.render("categories", {
      title: "Cooking Blog - Categories",
      categoryById,
    });
  } catch (error) {
    res.status(500).send({ message: error.message || "Somthing went wrorng!" });
  }
};

exports.searchRecipe = async (req, res) => {
  try {
    const searchTerm = req.body.searchTerm;
    const recipe = await Recipe.find({
      $text: { $search: searchTerm, $diacriticSensitive: true },
    });
    res.render("search", { title: "Cooking Blog - Search...", recipe });
  } catch (error) {
    res.status(500).send({ message: error.message || "Somthing went wrorng!" });
  }
};

exports.exploreLatest = async (req, res) => {
  try {
    const limitNumber = 20;
    const recipe = await Recipe.find({}).sort({ _id: -1 }).limit(limitNumber);
    res.render("explore-latest", {
      title: "Cooking Blog - Latest Recipies",
      recipe,
    });
  } catch (error) {
    res.status(500).send({ message: error.message || "Somthing went wrorng!" });
  }
};

exports.exploreRandom = async (req, res) => {
  try {
    const count = await Recipe.find().countDocuments();
    const random = Math.floor(Math.random() * count);

    const recipe = await Recipe.findOne({}).skip(random).exec();
    res.render("explore-random", {
      title: "Cooking Blog - Latest Recipies",
      recipe,
    });
  } catch (error) {
    res.status(500).send({ message: error.message || "Somthing went wrorng!" });
  }
};

exports.submitRecipe = async (req, res) => {
  const infoErrorsObj = req.flash("infoErrors");
  const infoSubmitObj = req.flash("infoSubmit");
  res.render("submit-recipe", {
    title: "Cooking Blog - Submit Recipe",
    infoErrorsObj,
    infoSubmitObj,
  });
};

exports.submitRecipeOnPost = async (req, res) => {
  try {
    let imageUploadFile;
    let uploadPath;
    let newImageName;

    if (!req.files || Object.keys(req.files).length === 0) {
      console.log("No Files where uploaded.");
    } else {
      imageUploadFile = req.files.image;
      newImageName = Date.now() + imageUploadFile.name;

      uploadPath =
        require("path").resolve("./") + "/public/uploads/" + newImageName;

      imageUploadFile.mv(uploadPath, function (err) {
        if (err) return res.satus(500).send(err);
      });
    }

    const newRecipe = new Recipe({
      name: req.body.name,
      description: req.body.description,
      email: req.body.email,
      ingredients: req.body.ingredients,
      category: req.body.category,
      image: newImageName,
    });
    await newRecipe.save();
    req.flash("infoSubmit", "Recipe has been added");
    res.redirect("/submit-recipe");
  } catch (error) {
    req.flash("infoErrors", error);
    res.redirect("/submit-recipe");
  }
};

// exports.updateRecipe = async (req, res) => {
//   try {
//     const res = await Recipe.updateOne(
//       { name: "New Recipe" },
//       { name: "New Recipe Updated" }
//     );
//     res.n;
//     res.nModified;
//   } catch (error) {
//     console.log({ message: error });
//   }
// };

// const insertDummyRecipeData = async () => {
//   try {
//     await Recipe.insertMany([
//       {
//         name: "Recipe Name Goes Here",
//         description: `Recipe Description Goes Here`,
//         email: "recipeemail@raddy.co.uk",
//         ingredients: [
//           "1 level teaspoon baking powder",
//           "1 level teaspoon cayenne pepper",
//           "1 level teaspoon hot smoked paprika",
//         ],
//         category: "American",
//         image: "southern-friend-chicken.jpg",
//       },
//       {
//         name: "Recipe Name Goes Here",
//         description: `Recipe Description Goes Here`,
//         email: "recipeemail@raddy.co.uk",
//         ingredients: [
//           "1 level teaspoon baking powder",
//           "1 level teaspoon cayenne pepper",
//           "1 level teaspoon hot smoked paprika",
//         ],
//         category: "American",
//         image: "southern-friend-chicken.jpg",
//       },
//     ]);
//   } catch (error) {
//     console.log(error);
//   }
// };
