/* get CSRF token */ // jQuery needed

let CSRFToken = null;
if (document.cookie && document.cookie !== '') {
    const cookies = document.cookie.split(';');
    for (let i = 0; i < cookies.length; i++) {
        const cookie = cookies[i].trim();
        // Does this cookie string begin with the name we want?
        if (cookie.substring(0, 'csrftoken'.length + 1) === ('csrftoken' + '=')) {
            CSRFToken = decodeURIComponent(cookie.substring('csrftoken'.length + 1));
            break;
        }
    }
}

/* */

/* DOM interact elements */

const loginInfo   = document.querySelector('#login__information')
const username    = document.querySelector('#input__username')
const password    = document.querySelector('#input__password')
const submitLogin = document.querySelector('#submit__login')

/* */

/* functions */

function login()
{
    let data =
    {
        username: username.value,
        password: password.value,
    }

    fetch('http://127.0.0.1:8000/login',
    {
        method: 'POST',
        headers: 
        {
            'Content-Type': 'application/json',
            'X-CSRFToken': CSRFToken,
        },
        body: JSON.stringify(data),
    })
    .then(response => response.json())
    .then(data => 
    {
        loginInfo.innerHTML = data.error
        if (data.error === '') window.location.href = '/profile'
    })
}

/* */

/* event listeners */

submitLogin.addEventListener('click', (e) => { login() } )
document   .addEventListener('keypress', (e) => { if (e.key === 'Enter') login() } )

/* */

/* other */

const URLParams    = new URLSearchParams(window.location.search)
const isRedirected = URLParams.get('redirect') === 'true'

if (isRedirected) loginInfo.innerHTML = 'You have been redirected.'

/* */