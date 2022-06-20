const pool = require('../db')

const getAllRecipe = ({ limit, offset, sortBy, sortOrder, search }) => {
  return new Promise((resolve, reject) => {
    pool.query(`SELECT recipes.*, assets.image AS photo, assets.video, users.name AS recipe_by FROM recipes INNER JOIN assets ON recipes.id = assets.id_recipe INNER JOIN users ON recipes.id_user = users.id WHERE title ILIKE '%${search}%' ORDER BY ${sortBy} ${sortOrder} LIMIT $1 OFFSET $2`, [limit, offset], (err, result) => {
      if (!err) {
        resolve(result)
      } else {
        reject(new Error(err))
      }
    })
  })
}

const getLikedRecipe = ({ limit, offset, sortBy, sortOrder, search, idUser }) => {
  console.log(idUser)
  console.log(typeof idUser)
  return new Promise((resolve, reject) => {
    pool.query(`SELECT liked.*, recipes.title, recipes.ingredients, assets.image AS photo, assets.video, users.name AS recipe_by FROM liked INNER JOIN recipes ON liked.id_recipe = recipes.id INNER JOIN assets ON liked.id_recipe = assets.id_recipe INNER JOIN users ON liked.id_user = users.id WHERE liked.id_user = ${idUser} AND title ILIKE '%${search}%' ORDER BY ${sortBy} ${sortOrder} LIMIT $1 OFFSET $2;`, [limit, offset], (err, result) => {
      if (!err) {
        resolve(result)
      } else {
        reject(new Error(err))
      }
    })
  })
}

const countRecipes = () => {
  return pool.query('SELECT COUNT(*) AS total FROM recipes')
}

const countLikedRecipes = (idUser) => {
  return pool.query(`SELECT COUNT(*) AS total FROM liked WHERE id_user = ${idUser};`)
}

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

const insertLikedRecipe = ({ idRecipe, idUser }) => {
  return new Promise((resolve, reject) => {
    pool.query('INSERT INTO liked(id_recipe, id_user)VALUES($1, $2)', [idRecipe, idUser], (err, result) => {
      if (!err) {
        resolve(result)
      } else {
        reject(new Error(err))
      }
    })
  })
}

const recipeDetail = (recipeID) => {
  return new Promise((resolve, reject) => {
    pool.query(`SELECT recipes.*, assets.image AS photo, assets.video, users.name AS recipe_by FROM recipes INNER JOIN assets ON recipes.id = assets.id_recipe INNER JOIN users ON recipes.id_user = users.id WHERE recipes.id = '${recipeID}';`, (error, result) => {
      if (!error) {
        resolve(result)
      } else {
        reject(error)
      }
    })
  })
}

const updateRecipeData = ({ title, ingredients, updatedAt }, recipeID, userID) => {
  return new Promise((resolve, reject) => {
    pool.query(`UPDATE recipes SET 
                title = COALESCE($1, title), 
                ingredients = COALESCE($2, ingredients),   
                updated_at = COALESCE($3, updated_at) 
                WHERE id = $4 AND id_user = $5;`, [title, ingredients, updatedAt, recipeID, userID], (err, result) => {
      if (!err) {
        resolve(result)
      } else {
        reject(new Error(err))
      }
    })
  })
}

const checkExisting = (recipeID) => {
  return pool.query(`SELECT COUNT(*) AS total FROM recipes WHERE id = '${recipeID}';`)
}

const checkLikedExisting = (recipeID, idUser) => {
  return pool.query(`SELECT COUNT(*) AS total FROM liked WHERE id_recipe = '${recipeID}' AND id_user = ${idUser};`)
}

const updateRecipeAssets = ({ photo, video, updatedAt }, recipeID) => {
  return new Promise((resolve, reject) => {
    pool.query(`UPDATE assets SET 
                image = COALESCE($1, image), 
                video = COALESCE($2, video),   
                updated_at = COALESCE($3, updated_at) 
                WHERE id_recipe = $4;`, [photo, video, updatedAt, recipeID], (err, result) => {
      if (!err) {
        resolve(result)
      } else {
        reject(new Error(err))
      }
    })
  })
}

const deleteRecipeData = (recipeID) => {
  return pool.query('DELETE FROM recipes WHERE id = $1', [recipeID])
}

const deleteRecipeAssets = (recipeID) => {
  return pool.query('DELETE FROM assets WHERE id_recipe = $1', [recipeID])
}

module.exports = {
  getAllRecipe,
  getLikedRecipe,
  countRecipes,
  countLikedRecipes,
  insertRecipeData,
  insertRecipeAssets,
  insertLikedRecipe,
  recipeDetail,
  updateRecipeData,
  updateRecipeAssets,
  checkExisting,
  checkLikedExisting,
  deleteRecipeData,
  deleteRecipeAssets
}
