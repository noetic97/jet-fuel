
exports.up = function(knex, Promise) {
  return Promise.all([
    knex.schema.table('folders', function(table) {
      table.integer('test_id');
    })
  ]);
};

exports.down = function(knex, Promise) {
  return Promise.all([
   knex.schema.table('folders', function(table) {
     table.dropColumn('test_id');
   })
 ]);
};
