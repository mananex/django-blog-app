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

/* function variables */

const lastBlogTitle = blogTitle.value
const lastBlogBody  = blogBody.value

/* */

/* functions */

function updateBlog()
{
    if (blogTitle.value !== lastBlogTitle || 
        blogBody.value !== lastBlogBody)
    {
        const data = 
        {
            blog_title: blogTitle.value,
            blog_body: blogBody.value
        }
        fetch('http://127.0.0.1:8000/blogs/edit/' + blogID + '/',
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
            if (data.error === '') window.location.href = '/blogs/' + blogID
        })
    }
}

/* */

/* event listeners */

saveBlog.addEventListener('click', () => { updateBlog() })
document.addEventListener('keypress', (e) => { if(e.key === 'Enter') updateBlog() } )
 
/* */