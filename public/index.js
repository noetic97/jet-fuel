const folderSubmit = $('.folder-submit');
const folderNamer = $('.folder-namer');
const deleteLink =$('.delete-link')
const deleteFolder =$('.delete-folder')

folderSubmit.click((e) => {
  e.preventDefault();
})

folderNamer.change((e) => {
  fetch('/api/v1/folders', {
    method: 'POST',
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({ title: folderNamer.val() })
  })
  .then(res => res.json())
  .then(data => console.log(data.title))
  folderNamer.val('');
})

deleteFolder.click((e) => {
  fetch('/api/vi/folders:id', {
    method: 'DELETE',
  })
  .then(res => {
    console.log(res, 'not json')
    console.log(res.json(), 'json')
    return res.json()
  })
})


// app.delete('/api/v1/folders/:id', (req, res) => {
//   const { id } = req.params;
//
//   database('folders').where({ id }).del()
//     .then(res => {
//       console.log(res[0].id);
//       const { folder_id } = res[0].id
//       return database('links').where({ folder_id }).del()
//     })
//     .catch(err => res.status(404).json({ err: `The folder with id ${id} was not found` }));
// });
//
// app.delete('/api/v1/links/:id', (req, res) => {
//   const { id } = req.params;
//
//   database('links').where({ id }).del()
//   .then(res => res.status(200).json())
//   .catch(err => res.status(404).json({ error: err }))
// });
