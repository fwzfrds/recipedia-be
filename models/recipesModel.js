const pool = require('../db')

const insertRecipeData = ({ id, idUser, title, ingredients }) => {
  return new Promise((resolve, reject) => {
    pool.query('INSERT INTO recipes(id, id_user, title, ingredients)VALUES($1, $2, $3, $4)', [id, idUser, title, ingredients], (err, result) => {
      if (!err) {
        resolve(result)
      } else {
        reject(new Error(err))
      }
    })
  })
}

const insertRecipeAssets = ({ idRecipe, photo, video }) => {
  return new Promise((resolve, reject) => {
    pool.query('INSERT INTO assets(id_recipe, image, video)VALUES($1, $2, $3)', [idRecipe, photo, video], (err, result) => {
      if (!err) {
        resolve(result)
      } else {
        reject(new Error(err))
      }
    })
  })
}

// const getProductById = (id) => {
//     console.log(id)
//     return pool.query('SELECT products.*, categories.name AS name_category FROM products INNER JOIN categories ON products.id_category = categories.id WHERE products.id = $1', [id])
//   }

const recipeDetail = (recipeID) => {
  return new Promise((resolve, reject) => {
    pool.query(`SELECT recipes.*, assets.image AS photo, assets.video FROM recipes INNER JOIN assets ON recipes.id = assets.id_recipe WHERE recipes.id = '${recipeID}';`, (error, result) => {
      if (!error) {
        resolve(result)
      } else {
        reject(error)
      }
    })
  })
}

module.exports = {
  insertRecipeData,
  insertRecipeAssets,
  recipeDetail
}
