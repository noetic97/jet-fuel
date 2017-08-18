const folderSubmit = $('.folder-submit');
const folderNamer = $('.folder-namer');

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
