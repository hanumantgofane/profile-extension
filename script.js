window.onload = function () {
  let profiles = [];
  const urlInput = document.getElementById('url')
  const saveProfileButton = document.getElementById('saveProfile')
  const saveTabButton = document.getElementById('saveTab')
  const deleteAllButton = document.getElementById('deleteAll')

  function showMessage(message, type) {
    const messageElement = document.getElementById('message')
    if (messageElement) {
      messageElement.innerHTML = `<span class="${type}">${message}</span>`

      setTimeout(() => {
        messageElement.innerHTML = ''
      }, 5000);
    }
  }

  function saveDataToLocalStorage(profiles) {
    localStorage.setItem('profiles', JSON.stringify(profiles))
  }

  function getDataFromLocalStorage() {
    const profilesData = localStorage.getItem('profiles')

    if (profilesData) {
      profiles = JSON.parse(profilesData);
    }
  }

  function init() {
    getDataFromLocalStorage();
    renderProfiles();
  }

  function renderProfiles() {
    const profilesElement = document.getElementById('profiles-data')
    if (profilesElement) {
      let profilesList = '';

      for (let i = 0; i < profiles.length; i++) {
        const profile = profiles[i];

        profilesList += `
          <li class="profile-item">
            <a class="profile-url" href="${profile.url}" target="_blank">${profile.url}</a> <button class="btn-delete">X</button>
            <input type="hidden" value="${profile.id}" />
          </li>
        `
      }

      if (profilesList.length > 0) {
        profilesElement.innerHTML = `<ul class="profiles-list">${profilesList}</ul>`
        const deleteButtons = document.getElementsByClassName('btn-delete');

        for (let i = 0; i < deleteButtons.length; i++) {
          deleteButtons[i].addEventListener('click', deleteProfileListener)
        }
      } else {
        profilesElement.innerHTML = ''
      }

    }
  }

  function checkForSameUrl(url) {
    return profiles.find(profile => {
      return profile.url === url
    })
  }

  function saveUserProfile(url) {
    try {

      if (checkForSameUrl(url)) {
        throw new Error('Same Profile Already Present...');
      }

      const profile = {
        id: Date.now().toString(),
        url: url
      }
      profiles.push(profile)

      return {
        status: 'success'
      }
    } catch (error) {
      return {
        status: 'error',
        message: error.message || ''
      }
    }
  }

  function deleteUserProfile(id) {
    try {
      profiles = profiles.filter(function (profile) {
        if (profile.id !== id) {
          return true
        } else {
          return false
        }
      })
      return true
    } catch (error) {
      return false
    }
  }

  function deleteProfileListener(event) {
    const deleteButton = event.target;

    const hiddenInput = deleteButton.nextElementSibling;

    if (hiddenInput) {
      const profileId = hiddenInput.value;

      if (profileId) {
        const deletedProfile = deleteUserProfile(profileId)

        if (deletedProfile) {
          showMessage('Profile Deleted Successfully', 'success');
          renderProfiles();
          saveDataToLocalStorage(profiles)
        } else {
          showMessage('Something Went wrong while deleting profile', 'error');
        }
      }
    }
  }

  function saveProfileListener(event) {
    if (urlInput) {
      const profileUrl = urlInput.value || '';

      if (profileUrl.indexOf('http') > -1 || profileUrl.indexOf('www') > -1) {
        const response = saveUserProfile(profileUrl);

        if (response.status === 'success') {
          showMessage('Profile Saved Successfully', 'success')
          renderProfiles();
          saveDataToLocalStorage(profiles)
        } else {
          showMessage(response.message || 'Something went wrong while saving profile', 'error')
        }
      } else {
        showMessage('Profile URL is invalid', 'error')
      }
    }
  }

  function saveTabListener(event) {
    chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
      const currentTabUrl = tabs[0].url || '';
      if (currentTabUrl.indexOf('http') > -1 || currentTabUrl.indexOf('www') > -1) {
        const response = saveUserProfile(currentTabUrl);

        if (response.status === 'success') {
          showMessage('Profile Saved Successfully', 'success')
          renderProfiles();
          saveDataToLocalStorage(profiles)
        } else {
          showMessage(response.message || 'Something went wrong while saving profile', 'error')
        }
      } else {
        showMessage('Profile URL is invalid', 'error')
      }
    })
  }

  function deleteAllListener(event) {
    profiles = []
    saveDataToLocalStorage(profiles)
    renderProfiles()
  }

  init()
  if (urlInput && saveProfileButton) {
    saveProfileButton.addEventListener('click', saveProfileListener)
    saveTabButton.addEventListener('click', saveTabListener)
    deleteAllButton.addEventListener('click', deleteAllListener)
  }

  window.onunload = function () {
    if (saveProfileButton) {
      saveProfileButton.removeEventListener('click', saveProfileListener)
    }

    if (saveTabButton) {
      saveTabButton.removeEventListener('click', saveTabListener)
    }

    if (deleteAllButton) {
      deleteAllButton.removeEventListener('click', deleteAllListener)
    }

    const deleteButtons = document.getElementsByClassName('btn-delete');

    for (let i = 0; i < deleteButtons.length; i++) {
      deleteButtons[i].removeEventListener('click', deleteProfileListener)
    }
  }
}
