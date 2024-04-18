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

/* important variables */

let blogStartIndex    = 0;
let blogIndexIncrease = 1;

/* */

/* DOM interact elements */

blogsScrollable = document.querySelector('.blogs__scrollable')

/* */

/* functions */

function generateBlog(id, title, description)
{
    let new_blog                        = document.createElement('div')
    let new_blog_title                  = document.createElement('a')
    let new_blog_description            = document.createElement('div')

    new_blog               .classList.add('blogs__scrollable-blog')
    new_blog_title         .classList.add('blogs__scrollable-blog__title', 'link', 'text')
    new_blog_description   .classList.add('blogs__scrollable-blog__description')

    new_blog_title      .innerHTML = title
    new_blog_title      .setAttribute('href', '/blogs/' + id)
    new_blog_description.innerHTML = description + '...'

    new_blog.appendChild(new_blog_title)
    new_blog.appendChild(new_blog_description)

    return new_blog
}


function loadBlogs()
{
    let data = 
    {
        start_index: blogStartIndex,
        end_index:   blogStartIndex + blogIndexIncrease,
        auth_token:  null,
        username: username,
    }
    fetch('http://127.0.0.1:8000/blogs/', 
    {
        method: 'POST',
        headers: 
        {
            'Content-Type': 'application/json',
            'X-CSRFToken': CSRFToken,
        },
        body: JSON.stringify(data)
    })
    .then(response => response.json())
    .then(data => 
    {
        if (JSON.stringify(data) !== JSON.stringify({})) 
        {
            blog         = Object.entries(data)[0]
            blog_element = generateBlog(blog[0], blog[1].blog_title, blog[1].blog_body.substring(0, 200))
            blogsScrollable.appendChild(blog_element)
        }
        else
        {
            blogStartIndex -= blogIndexIncrease
        }
    })
    .catch(error => console.log(error))
    blogStartIndex += blogIndexIncrease
}

function maximalScrollHandler()
{
    let isScrolledToBottom = blogsScrollable.scrollHeight - blogsScrollable.scrollTop === blogsScrollable.clientHeight;
    if (isScrolledToBottom) loadBlogs()
}

/* */

/* event listeners */

blogsScrollable.addEventListener('wheel', () => { maximalScrollHandler() } )

/* */

/* other */

loadBlogs()

/* */