document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('github-form');
    const searchInput = document.getElementById('search');
    const userList = document.getElementById('user-list');
    const reposList = document.getElementById('repos-list');
  
    // Add toggle button dynamically
    const toggleBtn = document.createElement('button');
    toggleBtn.textContent = 'Switch to Repo Search';
    form.appendChild(toggleBtn);
  
    let searchType = 'users'; // Default to user search
  
    const headers = {
      'Accept': 'application/vnd.github.v3+json'
    };
  
    // Toggle search type
    toggleBtn.addEventListener('click', () => {
      searchType = searchType === 'users' ? 'repositories' : 'users';
      toggleBtn.textContent = `Switch to ${searchType === 'users' ? 'Repo' : 'User'} Search`;
      userList.innerHTML = '';
      reposList.innerHTML = '';
    });
  
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const query = searchInput.value.trim();
  
      if (query) {
        userList.innerHTML = '';
        reposList.innerHTML = '';
  
        const url = searchType === 'users'
          ? `https://api.github.com/search/users?q=${query}`
          : `https://api.github.com/search/repositories?q=${query}`;
  
        fetch(url, { headers })
          .then(response => {
            if (!response.ok) throw new Error('Rate limit exceeded');
            return response.json();
          })
          .then(data => {
            if (searchType === 'users') {
              data.items.forEach(user => renderUser(user));
            } else {
              data.items.forEach(repo => renderRepo(repo));
            }
          })
          .catch(error => console.error(`Error fetching ${searchType}:`, error));
      }
    });
  
    function renderUser(user) {
      const li = document.createElement('li');
      li.innerHTML = `<h3>${user.login}</h3><img src="${user.avatar_url}" alt="${user.login}'s avatar" style="width:50px"/><a href="${user.html_url}" target="_blank">View Profile</a>`;
      li.addEventListener('click', () => fetchUserRepos(user.login));
      userList.appendChild(li);
    }
  
    function fetchUserRepos(username) {
      reposList.innerHTML = '';
      fetch(`https://api.github.com/users/${username}/repos`, { headers })
        .then(response => {
          if (!response.ok) throw new Error('Rate limit exceeded');
          return response.json();
        })
        .then(repos => repos.forEach(repo => renderRepo(repo)))
        .catch(error => console.error('Error fetching repos:', error));
    }
  
    function renderRepo(repo) {
      const li = document.createElement('li');
      li.innerHTML = `${repo.name} <a href="${repo.html_url}" target="_blank">(View on GitHub)</a>`;
      reposList.appendChild(li);
    }
  });