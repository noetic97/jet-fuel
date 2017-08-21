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
