const pool = require('../utils/pool');

module.exports = class Recipe {
  id;
  name;
  directions;

  constructor(row) {
    this.id = row.id;
    this.name = row.name;
    this.directions = row.directions;
  }

  static async insert(recipe) {
    const { rows } = await pool.query(
      'INSERT into recipes (name, directions) VALUES ($1, $2) RETURNING *',
      [recipe.name, recipe.directions]
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
    const { rows } = await pool.query(
      'SELECT * FROM recipes WHERE id=$1',
      [id]
    );

    if(!rows[0]) throw new Error(`No recipe found ${id}`);
    else return new Recipe(rows[0]);
  }

  static async update(id, recipe) {
    const { rows } = await pool.query(
      `UPDATE recipes
       SET name=$1,
           directions=$2
       WHERE id=$3
       RETURNING *
      `,
      [recipe.name, recipe.directions, id]
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
