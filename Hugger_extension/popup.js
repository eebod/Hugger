// GLOBALS for easy swap out for repo user
const GOOGLE_SHEET_VIEW = 'https://docs.google.com/spreadsheets/d/1CxqrWuTxWWBQjOYARS-dscviporwcoPacoK8jv-uSbg'; // Ensure to set appropriate sheet view
const GOOGLE_SHEET_APPSCRIPT_ENDPOINT = 'https://script.google.com/macros/s/AKfycbwLNBbULG_x5wMQJwE4-QgSqdiR97Pr3M_32R7OtASfKvaX17yzZxCvgzxsa9voVrud/exec'; // After deploying and authorizing appscript in googlesheet, copy url and replace

// Perform action when loaded
document.addEventListener('DOMContentLoaded', async () => {
  await loadPagechange();

  const view = document.getElementById('view');
  view.addEventListener('click', ()=>{
    goToPage(GOOGLE_SHEET_VIEW);
  })

  const save = document.getElementById('save');
  save.addEventListener('click', async () => {
    try {
      save.textContent = 'saving...';

      const tab = await getActiveTab();
      const userURL = tab.url;
      await saveToSheet(userURL,save)
    } catch (error) {
      showError(error.message)
    }
  })
})


// Check if on a valid LinkedIn page
async function loadPagechange() {
  const tab = await getActiveTab();
  const isLinkedInProfile = tab.url.includes('linkedin.com/in/');

  if (isLinkedInProfile) {
    enable(); // enable buttons click

    chrome.tabs.query({ active: true, currentWindow: true}, (tabs)=>{
      chrome.tabs.sendMessage(tabs[0].id, { action: 'getMinProfile' }, (response)=>{
        if(!response) return showError('An error occured, please close and try again!');
        if(!response.sts) return showError('An error occured, please close and try again!');

        const { img, name } = response.data;
        fillProfile(img, name);
      });
    })

  } else {
    showError(); // Show page mismatch error
  }
}


async function saveToSheet(url, saveEl){
  try {
    const response = await fetch(GOOGLE_SHEET_APPSCRIPT_ENDPOINT, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({url}),
      redirect: 'follow',
      mode: 'no-cors',
    });

    saveEl.textContent = 'Saved';

    setTimeout(()=>{
      saveEl.textContent = 'Save to sheet'
    }, 4000)
  } catch (error) {
    console.error(error);
    throw new Error('Error saving to Google Sheet. Please try again!');
  }
}


async function getActiveTab() {
    const tabs = await chrome.tabs.query({
      active: true,  
      currentWindow: true
    });
    return tabs[0];
}


// To hide the error
function hideError() {
  const errorContainer = document.getElementById('errorContainer');
  errorContainer.classList.add('hidden');
}


// To show the error
function showError(message) {
  const errorContainer = document.getElementById('errorContainer');

  if(message){
    const errorCtx = document.getElementById('errorCtx');
    errorCtx.textContent = message;
  }
  
  errorContainer.classList.remove('hidden');
}


// Remove disability
function enable(){
  const save = document.getElementById('save');
  save.removeAttribute('disabled');
}

function goToPage(url){
  return window.open(url, 'blank');
}

function fillProfile(profileImg, profileName){
  const image = document.getElementById('profileImage');
  const name = document.getElementById('profileName');

  image.setAttribute('src', profileImg);
  name.textContent = profileName
}