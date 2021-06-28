window.onload = function () {
  let profiles = [];
  const urlInput = document.getElementById('url')
  const saveProfileButton = document.getElementById('saveProfile')

  function showMessage(message, type) {
    const messageElement = document.getElementById('message')
    if (messageElement) {
      messageElement.innerHTML = `<span class="${type}">${message}</span>`

      setTimeout(() => {
        messageElement.innerHTML = ''
      }, 5000);
    }
  }

  function saveDataToLocalStorage() {
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
          <a class="profile-url">${profile.url}</a> <button class="btn-delete">X</button>
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

  function saveUserProfile(url) {
    try {
      const profile = {
        id: Date.now().toString(),
        url: url
      }
      profiles.push(profile)
      return true
    } catch (error) {
      return false
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
          saveDataToLocalStorage()
        } else {
          showMessage('Something Went wrong while deleting profile', 'error');
        }
      }
    }
  }

  function saveButtonListener(event) {
    if (urlInput) {
      const profileUrl = urlInput.value || '';

      if (profileUrl.indexOf('http') > -1 || profileUrl.indexOf('www') > -1) {
        const isProfileSaved = saveUserProfile(profileUrl);

        if (isProfileSaved) {
          showMessage('Profile Saved Successfully', 'success')
          renderProfiles();
          saveDataToLocalStorage()
        } else {
          showMessage('Something went wrong while saving profile', 'error')
        }
      } else {
        showMessage('Profile URL is invalid', 'error')
      }
    }
  }

  init()
  if (urlInput && saveProfileButton) {
    saveProfileButton.addEventListener('click', saveButtonListener)
  }

  window.onunload = function () {
    if (saveProfileButton) {
      saveProfileButton.removeEventListener('click', saveButtonListener)
    }

    const deleteButtons = document.getElementsByClassName('btn-delete');

    for (let i = 0; i < deleteButtons.length; i++) {
      deleteButtons[i].removeEventListener('click', deleteProfileListener)
    }
  }
}
