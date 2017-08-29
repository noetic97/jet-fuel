const folderSubmit = $('.folder-submit');
const folderNamer = $('.folder-namer');
const linkNamer = $('.link-input')
const linkDescription = $('.description-input')
const folderSelect = $('select')


const getFolders = () => {
  fetch('api/v1/folders')
  .then(res => res.json())
  .then(folders => appendFolders(folders))
  .catch(err => displayError(err))
}

const displayError = (error) => {
  $('#error-display').append(`<div>ERROR: ${error}</div>`)
}

const folderWrapper = (folder) => `<div class="folder" id="${folder.id}">
                                     <p id="folder-title">${folder.title}</p>
                                     <img class="folder-img"
                                          src="./assets/wood-folder.ico"
                                          alt="wood folder">
                                   </div>`;
const folderOption = (folder) => `<option value=${folder.id}>${folder.title}</option>`;


const appendFolders = (folders) => {
  $('.folder-display').append(folders.map(folderWrapper));
  $('#folder-select').append(folders.map(folderOption));
};

folderSubmit.click((e) => {
  e.preventDefault();
});

folderSelect.change((e) => {
  if (e.target.value === 'Add a new folder') {
    folderNamer.show()
    linkDescription.hide()
    linkNamer.hide()
  } else {
    folderNamer.hide()
  }
  if (e.target.value !== 'Add a new folder' && e.target.value !== 'Select a folder') {
    linkDescription.show()
    linkNamer.show()
  }
});

folderNamer.change((e) => {
  fetch('/api/v1/folders', {
    method: 'POST',
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({ title: folderNamer.val() })
  })
  .then(res => res.json())
  .then((data) => {
    const folderArray = []
    if (!data.error) {
      folderArray.push(data)
      appendFolders(data)
      folderNamer.val('');
      folderNamer.hide()
      linkDescription.show()
      linkNamer.show()
    } else {
      displayError(data.error)
    }
  })
  .catch(err => displayError(err))

})

linkNamer.change((e) => {
  const folder_id = $('#folder-select').val()
  fetch('/api/v1/links', {
    method: 'POST',
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
       description: linkDescription.val(),
       ogURL: linkNamer.val(),
       folder_id: folder_id,
    })
  })
  .then(res => res.json())
  .then(data => {

    console.log(data)
  })
  linkNamer.val('')
  linkDescription.val('')
})

// Page load
getFolders()
folderNamer.hide()
linkNamer.hide()
linkDescription.hide()
