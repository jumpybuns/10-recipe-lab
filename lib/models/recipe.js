const pool = require('../utils/pool');

module.exports = class Log {
  id;
  logId;
  dateOfEvent;
  notes;
  rating;

  constructor(row) {
    this.id = row.id;
    this.recipeId = row.recipeId;
    this.dateOfEvent = row.dateOfEvent;
    this.notes = row.notes;
    this.rating = row.rating;
  }

  static async insert(log) {
    const { rows } = await pool.query(
      'INSERT into logs (recipeId, dateOfEvent, notes, rating) VALUES ($1, $2, $3, $4) RETURNING *',
      [log.recipeId, log.dateOfEvent, log.notes, log.rating]
    );

    if(!rows[0]) throw new Error('log was not insert due to an error');
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
    const { rows } = await pool.query(
      `UPDATE logs
       SET recipeId=$1,
           dateOfEvent=$2,
           notes=$3,
           rating=$4
       WHERE id=$5
       RETURNING *
      `,
      [log.recipeId, log.dateOfEvent, log.notes, log.rating, id]
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
