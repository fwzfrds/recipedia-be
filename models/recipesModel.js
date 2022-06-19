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

module.exports = {
  insertRecipeData,
  insertRecipeAssets
}
