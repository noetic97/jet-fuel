
exports.seed = function(knex, Promise) {
  // Deletes ALL existing entries
  return knex('links').del()
    .then(() => knex('folders').del())
    .then(() => {
      return Promise.all([
        knex('folders').insert([{
          id: 1,
          title: 'Favorites',
        },
        {
          id: 2,
          title: 'Secrets'
        }])
        .then(folder => {
          return knex('links').insert([
            {
              id: 1,
              description: 'github',
              ogURL: 'https://github.com/noetic97',
              shortURL: 'https://ghno97',
              folder_id: 1
            },
            {
              id: 2,
              description: 'personal site',
              ogURL: 'http://joeheitkamp.com/',
              shortURL: 'http://jhYEah',
              folder_id: 1
            },
            {
              id: 3,
              description: 'secret site',
              ogURL: 'http://secretsarefun.com/',
              shortURL: 'http://SCRt56',
              folder_id: 2
            },
            {
              id: 4,
              description: 'Shhhhhhh!!!!',
              ogURL: 'http://somanysecrets.com/',
              shortURL: 'http://nleh97',
              folder_id: 2
            }
          ])
        })
        .catch(err => console.log('ERROR: ', err))
      ]);
    });
};
