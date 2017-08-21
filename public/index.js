const folderSubmit = $('.folder-submit');
const folderNamer = $('.folder-namer');
const linkNamer = $('.link-input')
const linkDescription = $('.description-input')
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
  $('#error-display').append(`<div>error</div>`)
}

const appendFolders = (data) => {
  $('.folder-display').append(data.map((folder) => {
    return `<div class="folder" id="${folder.id}"><p class="folder-title">${folder.title}</p><button class="folder-button"><img class="folder-img" src="./assets/wood-folder.ico" alt="opening and closing folder"></button></div>`
  }))
};

folderSubmit.click((e) => {
  e.preventDefault();
  folderNamer.val('');
  linkNamer.val('');
  linkDescription.val('');
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
})

linkNamer.change((e) => {
  const folder_id = $('#folder')
  fetch('/api/v1/links', {
    method: 'POST',
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
       description: linkDescription.val(),
       ogURL: linkNamer.val(),
       folder_id: 35,
    })
  })
  .then(res => res.json())
  .then(data => console.log(data))
})

deleteFolder.click((e) => {
  fetch('/api/vi/folders:id', {
    method: 'DELETE',
  })
  .then(res => {
    return res.json()
  })
})

$('.folder').click((e) => {

})

// Page load
getFolders()
