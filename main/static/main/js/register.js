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

const registrationError  = document.querySelector('#register__error')
const username           = document.querySelector('#input__username')
const password           = document.querySelector('#input__password')
const submitRegistration = document.querySelector('#submit__registration')

/* */

/* functions */

function registrate()
{
    let data = 
    {
        username: username.value,
        password: password.value,
    }

    fetch('http://127.0.0.1:8000/registration', 
    {
        method: 'POST',
        headers:
        {
            'Content-Type': 'application/json',
            'X-CSRFToken': CSRFToken,
        },
        body: JSON.stringify(data),
    }).then(response =>
    {
        return response.json()
    }).then(data => 
    {
        registrationError.innerHTML = data.error;
        if (data.error === '') window.location.href = '/login?redirect=true'
    })
}

/* */

/* event listeners */

submitRegistration.addEventListener('click', (e) => { registrate() })
document          .addEventListener('keypress', (e) => { if (e.key === 'Enter') registrate() })

/* */