window.onload = () => {
    const searchBox = document.querySelector('#miller');

    searchBox.addEventListener('focusout', () => {
        formSubmit();
    })

    // getUser("shiva017");
}

const formSubmit = () => {
    const searchBox = document.querySelector('#miller');
    if (searchBox.value != "") {
        getUser(searchBox.value);
        searchBox.value = "";
    }
    return false;
}

const getUser = async (username) => {
    const API_URL = "https://api.github.com/users";
    const main = document.querySelector('#main');

    const response = await fetch(`${API_URL}/${username}`);
    const data = await response.json();

    const card = `
        <div class="card">
            <div>
                <img class="avatar" src=${data.avatar_url} alt="dp">
            </div>
            <div class="user">
                <h2>${data.name}</h2>
                <p>${data.bio}</p>

                <ul>
                    <li>${data.followers}<strong>followers</strong></li>
                    <li>${data.following}<strong>following</strong></li>
                    <li>${data.public_repos}<strong>Repos</strong></li>
                </ul>

                <div id="repos"></div>
            </div>
        </div>
    `

    main.innerHTML = card;
    getRepos(API_URL, username);
}

const getRepos = async (API_URL, username) => {
    const repos = document.querySelector('#repos');

    const response = await fetch(`${API_URL}/${username}/repos`);
    const data = await response.json();

    // Sort repositories by stars and then by creation date
    const sortedRepos = data.sort((a, b) => {
        // Sort by stars in descending order
        const starsDiff = b.stargazers_count - a.stargazers_count;
        if (starsDiff !== 0) {
            return starsDiff;
        }

        // If stars are equal, sort by creation date in descending order
        return new Date(b.created_at) - new Date(a.created_at);
    });

    // Display only the first 5 repositories
    sortedRepos.slice(0, 5).forEach(repo => {
        const element = document.createElement('a');
        element.classList.add('repo');
        element.href = repo.html_url;
        element.innerText = repo.name;
        element.target = "_blank";
        repos.appendChild(element);
    });
}
