
exports.up = function(knex, Promise) {
  return Promise.all([
    knex.schema.table('folders', function(table) {
      table.dropColumn('title')
    })
  ]);
};

exports.down = function(knex, Promise) {
  return Promise.all([
    knex.schema.droptable('folders')
  ]);
};
