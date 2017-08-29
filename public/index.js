const folderSubmit = $('.folder-submit');
const folderNamer = $('.folder-namer');
const linkNamer = $('.link-input')
const linkDescription = $('.description-input')
const folderSelect = $('select')
const folderDisplay = $('.folder-display')

const getFolders = () => {
  fetch('/api/v1/folders')
  .then(res => res.json())
  .then(folders => appendFolders(folders))
  .catch(err => displayError(err))
}

const displayError = (error) => {
  $('#error-display').append(`<div>ERROR: ${error}</div>`)
}

const folderWrapper = (folder) => `<div class="folder" id=${folder.id}>
                                     <p id=${folder.id}>${folder.title}</p>
                                     <img class="folder-img"
                                          id=${folder.id}
                                          src="./assets/wood-folder.ico"
                                          alt="wood folder">
                                   </div>`;
const folderOption = (folder) => `<option value=${folder.id}>${folder.title}</option>`;
const linkWrapper = (link) => `<li id=${link.folder_id}>${link.description}: ${link.ogURL}</li>`;


const appendFolders = (folders) => {
  $('.folder-display').append(folders.map(folderWrapper));
  $('#folder-select').append(folders.map(folderOption));
};

const appendLinks = (links) => {
  $('.link-list').append(links.map(linkWrapper));
}

folderSubmit.click((e) => {
  e.preventDefault();
});


const toggleInputs = (e) => {
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
}

const addFolder = (e) => {
  e.preventDefault()
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
}

const addLink = (e) => {
  e.preventDefault()
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
  .then(links => {
    const linkArray = []
    linkArray.push(links)
    appendLinks(linkArray)
  })
  .catch(err => displayError(err))
  linkNamer.val('')
  linkDescription.val('')
}


const displayLinks = (e) => {
  const id = e.target.id;
  fetch(`api/v1/folders/${id}/links`)
    .then(res => res.json())
    .then(links => appendLinks(links))
    .catch(err => displayError(err))
    $('.folder-display').find('.link-display').toggleClass('hidden-display');
}

// Page load
getFolders()
folderNamer.hide()
linkNamer.hide()
linkDescription.hide()

// Event Listeners
folderDisplay.on('click', '.folder', displayLinks)
folderSelect.on('change', toggleInputs)
folderNamer.on('change', addFolder)
linkNamer.on('change', addLink)
