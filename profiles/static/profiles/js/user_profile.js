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

const blogsScrollable = document.querySelector('.blogs__scrollable')
const usernameInput   = document.querySelector('.blogs__account__name__input__field')
const usernameSave    = document.querySelector('.blogs__account__name__input__save')
const lastUsername    = usernameInput.value

/* */

/* functions */

function deleteBlog(blog_id)
{
    let data = { blog_id: blog_id}
    fetch('http://127.0.0.1:8000/blogs/delete/' + blog_id, 
    {
        method: 'GET',
        headers:
        {
            'Content-Type': 'application/json',
            'X-CSRFToken': CSRFToken,
        },
    })
    .then(response => response.json())
    .then(data => { if (data.error === 'auth_failed') location.reload() } )
}

function toggleBlogDeleteWindow(element)
{
    let blog_element         = element.parentElement.parentElement
    let blog_id              = blog_element.querySelector('a').getAttribute('href').split('/')[2]
    let delete_window        = element.parentElement.nextSibling
    let delete_window_accept = delete_window.lastChild.firstChild
    let delete_window_cancel = delete_window.lastChild.lastChild
    
    delete_window.style.display = 'flex'
    delete_window_accept.addEventListener('click', () => 
    {
        deleteBlog(blog_id)
        blog_element.remove()
    })
    delete_window_cancel.addEventListener('click', () => { delete_window.style.display = 'none' } )
}

function generateBlogDeleteWindow()
{
    let new_blog_delete_window                = document.createElement('div')
    let new_blog_delete_window_title          = document.createElement('div')
    let new_blog_delete_window_buttons        = document.createElement('div')
    let new_blog_delete_window_button_accept  = document.createElement('div')
    let new_blog_delete_window_button_deny    = document.createElement('div')

    new_blog_delete_window              .classList.add('blogs__scrollable-blog__delete__window')
    new_blog_delete_window_title        .classList.add('blogs__scrollable-blog__delete__window__title', 'text')
    new_blog_delete_window_buttons      .classList.add('blogs__scrollable-blog__delete__window__buttons')
    new_blog_delete_window_button_accept.classList.add('blogs__scrollable-blog__delete__window__buttons-button', 'accept', 'text')
    new_blog_delete_window_button_deny  .classList.add('blogs__scrollable-blog__delete__window__buttons-button', 'deny', 'text')

    new_blog_delete_window_title        .innerHTML = 'Are you sure?'
    new_blog_delete_window_button_accept.innerHTML = 'Yes'
    new_blog_delete_window_button_deny  .innerHTML = 'No'

    new_blog_delete_window_buttons.appendChild(new_blog_delete_window_button_accept)
    new_blog_delete_window_buttons.appendChild(new_blog_delete_window_button_deny)

    new_blog_delete_window.appendChild(new_blog_delete_window_title)
    new_blog_delete_window.appendChild(new_blog_delete_window_buttons)
    new_blog_delete_window.style.display = 'none'

    return new_blog_delete_window
}

function generateBlogChangesButtons(id)
{
    let new_blog_changes                = document.createElement('div')
    let new_blog_changes_delete         = document.createElement('div')
    let new_blog_changes_edit           = document.createElement('div')

    new_blog_changes       .classList.add('blogs__scrollable-blog__changes')
    new_blog_changes_delete.classList.add('blogs__scrollable-blog__changes__delete', 'text')
    new_blog_changes_edit  .classList.add('blogs__scrollable-blog__changes__edit', 'text')

    new_blog_changes_delete.innerHTML = 'Delete'
    new_blog_changes_delete.addEventListener('click', () => { toggleBlogDeleteWindow(new_blog_changes_delete) })

    new_blog_changes_edit  .innerHTML = 'Edit'
    new_blog_changes_edit  .addEventListener('click', () => { window.location.href = '/blogs/edit/' + id } )

    new_blog_changes.appendChild(new_blog_changes_delete)
    new_blog_changes.appendChild(new_blog_changes_edit)

    return new_blog_changes
}

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
    new_blog.appendChild(generateBlogChangesButtons(id))
    new_blog.appendChild(generateBlogDeleteWindow())

    return new_blog
}

function loadBlogs()
{
    let data = 
    {
        start_index: blogStartIndex,
        end_index:   blogStartIndex + blogIndexIncrease,
        auth_token:  auth_token,
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
// blogsScrollable.addEventListener('mousemove', () => { maximalScrollHandler() } )
usernameSave   .addEventListener('click', () =>
{
    if (usernameInput.value !== lastUsername)
    {
        fetch('http://127.0.0.1:8000/profile/change_username/' + usernameInput.value,
        {
            method: 'GET',
            headers:
            {
                'Content-Type': 'application/json',
                'X-CSRFToken': CSRFToken,
            },
        })
        .then(response => response.json())
        .then(data => 
        {
            if (data.error) alert(data.error)
            else location.reload()
        })
        .catch(error => console.log(error.value))
    }
})

/* */

/* other */

loadBlogs()

/* */