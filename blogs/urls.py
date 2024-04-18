from django.urls import path
from . import views 

urlpatterns = [
    path('', views.blogs, name = 'blogs'),
    path('search', views.search, name = 'search'),
    path('create', views.create_blog, name = 'create_blog'),
    path('<int:blog_id>/', views.blog, name = 'blog'),
    path('edit/<int:blog_id>/', views.edit_blog, name = 'edit_blog'),
    path('delete/<int:blog_id>/', views.delete_blog, name = 'delete_blog')
]