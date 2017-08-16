
exports.up = function(knex, Promise) {
  return Promise.all([
    knex.schema.createTable('folders', function(table) {
      table.increments('id').primary();
      table.string('title');

      table.timestamps(true, true);
    }),

    knex.schema.createTable('links', function(table) {
      table.increments('id').primary();
      table.string('description');
      table.string('ogURL');
      table.string('shortURL');
      table.integer('folder_id').unsigned();
      table.foreign('folder_id').references('folders.id');

      table.timestamps(true, true);
    })
  ]);
};

exports.down = function(knex, Promise) {
  return Promise.all([
    knex.schema.droptable('links'),
    knex.schema.droptable('folders')
  ]);
};
