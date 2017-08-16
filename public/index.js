const folderSubmit = $('.folder-submit');
const folderNamer = $('.folder-namer');

folderSubmit.click((e) => {
  e.preventDefault();
  console.log('suh dude');
})

folderNamer.change((e) => {
  console.log(e.target.value);
  e.target.value = '';
})
