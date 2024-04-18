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

/* variables for functions */

let blogStartIndex    = 0
let blogIndexIncrease = 1

/* */

/* DOM interact elements */

const blogsScrollable = document.querySelector('.blogs__scrollable')
const searchButton    = document.querySelector('.blogs__interaction__search__confirm')
const searchInput     = document.querySelector('.blogs__interaction__search__input')

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
        auth_token: null,
        username: null,
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
            for (let key in data)
            {
                blog         = data[key]
                blog_element = generateBlog(key, blog.blog_title, blog.blog_body.substring(0, 200))
                blogsScrollable.appendChild(blog_element)
            }
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
searchButton   .addEventListener('click', () => 
{
    console.log(1111)
    let data = 
    {
        search_input: searchInput.value
    }
    fetch('http://127.0.0.1:8000/blogs/search',
    {
        method: 'POST',
        headers:
        {
            'Content-Type': 'application/json',
            'X-CSRFToken': CSRFToken
        },
        body: JSON.stringify(data)
    })
    .then(response => response.json())
    .then(data =>
    {
        blogStartIndex = 0
        blogsScrollable.innerHTML = ''
        if (JSON.stringify(data) !== JSON.stringify({})) 
        {
            for (let key in data)
            {
                blog         = data[key]
                blog_element = generateBlog(key, blog.blog_title, blog.blog_body.substring(0, 200))
                blogsScrollable.appendChild(blog_element)
            }
        }
        else
        {
            blogStartIndex -= blogIndexIncrease
        }
    })
})

/* */

/* other */

loadBlogs()

/* */
