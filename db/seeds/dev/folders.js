
exports.seed = function(knex, Promise) {
  // Deletes ALL existing entries
  return knex('links').del()
    .then(() => knex('folders').del())
    .then(() => {
      return Promise.all([
        knex('folders').insert({
          title: 'Favorites'
        }, 'id')
        .then(folder => {
          return knex('links').insert([
            {
              description: 'github',
              ogURL: 'https://github.com/noetic97',
              shortURL: 'https://ghno97',
              folder_id: folder[0]
            },
            {
              description: 'personal site',
              ogURL: 'http://joeheitkamp.com/',
              shortURL: 'http://jhYEah',
              folder_id: folder[0]
            }
          ])
        })
        .catch(err => console.log('ERROR: ', err))
      ]);
    });
};
