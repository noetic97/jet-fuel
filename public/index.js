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

const getLinks = () => {
  fetch(`api/v1/links`)
    .then(res => res.json())
    .then(links => links.map((link) => {
        let id = link.folder_id
        appendLinks(links, id)
      }))
    .catch(err => displayError(err))
}

const displayError = (error) => {
  $('#error-display').append(`<div>ERROR: ${error}</div>`)
}

const checkUrl = (link) => {
  if (!link.shortURL) {
    return link.ogURL
  } else {
    return `/api/v1/links/${link.shortURL.substring(5)}`
  }
}

const folderWrapper = (folder) => `<div class="folder" id=${folder.id}>
                                     <p id=${folder.id}>${folder.title}</p>
                                     <img class="folder-img"
                                          id=${folder.id}
                                          src="./assets/wood-folder.ico"
                                          alt="wood folder">
                                      <article class="link-display hidden-display">
                                        <ul class="link-list" id=${folder.id}></ul>
                                      </article>
                                   </div>`;
const folderOption = (folder) => `<option value=${folder.id}>${folder.title}</option>`;
const linkWrapper = (link) => `<li id=${link.folder_id}><a href="${checkUrl(link)}">${link.description}:  ${link.shortURL}</a></li>`;

const appendFolders = (folders) => {
  $('.folder-display').append(folders.map(folderWrapper));
  $('#folder-select').append(folders.map(folderOption));
};

const appendLinks = (links, id) => {
  if (links.error) {
    return displayError('Please select a folder to add the link to.')
  }
  $('#error-display div').remove()
  const currentLinks = links.filter((link) => { 
    return parseInt(id) === link.folder_id})
  $('.link-list').append(currentLinks.map(linkWrapper));
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
      folderSelect.val(folderNamer.val())
      folderNamer.val('');
      folderNamer.hide()
      linkDescription.show()
      linkNamer.show()
      $('#error-display div').remove()
    } else {
      displayError(data.error)
    }
  })
  .catch(err => displayError(err))
}

const addLink = (e) => {
  e.preventDefault()

  const Url = linkNamer.val();
  const validUrl = validateUrl(Url)
  const folder_id = $('#folder-select').val()
  
  if (validUrl) {
    fetch(`/api/v1/links`, {
      method: 'POST',
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        description: linkDescription.val(),
        ogURL: Url,
        folder_id: folder_id,
      })
    })
    .then(res => res.json())
    .then(links => {
      appendLinks(links, folder_id)
      $('#error-display div').remove()
    })
    .catch(err => displayError(err))
  } else {
    displayError('That is not a valid URL.  Please try again.')
  }
  linkNamer.val('')
  linkDescription.val('')
}

const displayLinks = (e) => {
  const id = e.target.id;
  const loadedLinkId = $(`#${id}.link-list`)
  if (id === loadedLinkId.attr('id')) {
    $(`.folder-display #${id}`).find('.link-display').toggleClass('hidden-display');
  } else {
    fetch(`api/v1/folders/${id}/links`)
    .then(res => res.json())
    .then(links => appendLinks(links, id))
    .catch(err => displayError(err));
  }
}

const validateUrl = (url) => {
  const regValidate = /((?:https?\:\/\/|www\.)(?:[-a-z0-9]+\.)*[-a-z0-9]+.*)/i;
  
  if (!regValidate.test(url)) {
    return false;
  }
  return true;
}

// Page load
getFolders()
getLinks()
folderNamer.hide()
linkNamer.hide()
linkDescription.hide()

// Event Listeners
folderDisplay.on('click', '.folder', displayLinks)
folderSelect.on('change', toggleInputs)
folderNamer.on('change', addFolder)
linkNamer.on('change', addLink)
