
exports.up = function(knex, Promise) {
  return Promise.all([
    knex.schema.table('folders', function(table) {
      table.string('title').unique();
    })
  ]);
};

exports.down = function(knex, Promise) {
  return Promise.all([
    knex.schema.droptable('folders')
  ]);
};
