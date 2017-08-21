const folderSubmit = $('.folder-submit');
const folderNamer = $('.folder-namer');
const deleteLink = $('.delete-link')
const deleteFolder = $('.delete-folder')
const folderSelect = $('.folder-button')


const getFolders = () => {
  fetch('api/v1/folders')
  .then(res => res.json())
  .then(data => appendFolders(data))
  .catch(err => displayError(err))
}

const displayError = (error) => {
  console.log(error);
  $('#error-display').append(`<div>error</div>`)
}

const appendFolders = (data) => {
  $('.folder-display').append(data.map((folder) =>
      `<div>
        <p class="folder-title">${folder.title}</p>
        <button class="folder-button">
          <img class="folder-img"
               src="./assets/wood-folder.ico"
               alt="opening and closing folder">
        </button>
      </div>`
    ))
}



folderSubmit.click((e) => {
  e.preventDefault();
  console.log(e);
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
  .then(data => {
    const folderArray = []
    folderArray.push(data)
    appendFolders(folderArray)
  })
  .catch(err => displayError(err))
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

$('.folder-image').click(() => {
  console.log('hi');
  console.log(e);
})

// Page load
getFolders()
