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

const blogTitle = document.querySelector('#blog__title')
const blogBody  = document.querySelector('#blog__body')
const saveBlog  = document.querySelector('#save__blog')
const blogError = document.querySelector('#blog__error')

/* */

/* functions */

function createBlog()
{
    const data = 
    {
        blog_title: blogTitle.value,
        blog_body: blogBody.value
    }
    fetch('http://127.0.0.1:8000/blogs/create',
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
        blogError.innerHTML = data.error
        if (data.blog_id) window.location.href = '/blogs/' + data.blog_id
    })
}

/* */

/* event listeners */

saveBlog.addEventListener('click', () => { createBlog() })
document.addEventListener('keypress', (e) => { if(e.key === 'Enter') createBlog() } )
 
/* */