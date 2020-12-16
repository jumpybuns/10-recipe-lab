const pool = require('../utils/pool');
const Log = require('./log');

module.exports = class Recipe {
  id;
  name;
  ingredients;
  directions;

  constructor(row) {
    this.id = row.id;
    this.name = row.name;
    this.ingredients = row.ingredients;
    this.directions = row.directions;
  }

  static async insert(recipe) {
    const { rows } = await pool.query(
      'INSERT into recipes (name, ingredients, directions) VALUES ($1, $2, $3) RETURNING *',
      [recipe.name, recipe.ingredients, recipe.directions]
    );

    if(!rows[0]) throw new Error('Recipe was not insert due to an error');
    else return new Recipe(rows[0]);
  }

  static async find() {
    const { rows } = await pool.query(
      'SELECT * FROM recipes'
    );

    if(!rows[0]) throw new Error('Could not find the recipes');
    else return rows.map(row => new Recipe(row));
  }

  static async findById(id) {
    const { rows } = await pool.query(`
      SELECT recipes.*,
      array_to_json(array_agg(logs.*))
      AS logs
      FROM recipes 
      JOIN logs
      ON recipes.id = logs.recipe_id
      WHERE id=$1
      GROUP BY recipes.id`,
    [id]
    );

    if(!rows[0]) throw new Error(`No recipe found ${id}`);
    else return {

      ...new Recipe(rows[0]),
      logs: rows[0].logs.map(log => new Log(log))
    };
  }

  static async update(id, { name, ingredients, directions }) {
    const { rows } = await pool.query(
      `UPDATE recipes
       SET name=$1,
           ingredients=$2,
           directions=$3
       WHERE id=$4
       RETURNING *
      `,
      [name, ingredients, directions, id]
    );
    if(!rows[0]) throw new Error(`Recipe not updated ${id}`);
    return new Recipe(rows[0]);
  }

  static async delete(id) {
    const { rows } = await pool.query(
      'DELETE FROM recipes WHERE id=$1 RETURNING *',
      [id]
    );
    if(!rows[0]) throw new Error(`Could not delete recipe ${id}`);
    return new Recipe(rows[0]);
  }
};
