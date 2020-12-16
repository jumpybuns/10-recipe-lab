const pool = require('../utils/pool');

module.exports = class Log {
  id;
  recipeId;
  dateOfEvent;
  notes;
  rating;

  constructor(row) {
    this.id = String(row.id);
    this.recipeId = String(row.recipe_id);
    this.dateOfEvent = row.date_of_event;
    this.notes = row.notes;
    this.rating = row.rating;
  }

  static async insert(log) {
    const { rows } = await pool.query(
      'INSERT into logs (recipe_id, date_of_event, notes, rating) VALUES ($1, $2, $3, $4) RETURNING *',
      [log.recipeId, log.dateOfEvent, log.notes, log.rating]
    );

    if(!rows[0]) throw new Error('log was not inserted');
    else return new Log(rows[0]);
  }

  static async find() {
    const { rows } = await pool.query(
      'SELECT * FROM logs'
    );

    if(!rows[0]) throw new Error('Could not find the logs');
    else return rows.map(row => new Log(row));
  }

  static async findById(id) {
    const { rows } = await pool.query(
      'SELECT * FROM logs WHERE id=$1',
      [id]
    );

    if(!rows[0]) throw new Error(`No log found ${id}`);
    else return new Log(rows[0]);
  }

  static async update(id, log) {
    const { rows } = await pool.query(`
      UPDATE logs
       SET 
           date_of_event=$1,
           notes=$2,
           rating=$3
       WHERE id=$4
       RETURNING *
      `,
    [log.dateOfEvent, log.notes, log.rating, id]
    );
    if(!rows[0]) throw new Error(`log not updated ${id}`);
    return new Log(rows[0]);
  }

  static async delete(id) {
    const { rows } = await pool.query(
      'DELETE FROM logs WHERE id=$1 RETURNING *', 
      [id]
    );
    if(!rows[0]) throw new Error(`Could not delete log ${id}`);
    return new Log(rows[0]);
  }
};
