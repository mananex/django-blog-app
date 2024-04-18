from django.urls import path
from . import views

urlpatterns = [
    path('', views.user_profile, name = 'user_profile'),
    path('logout', views.logout, name = 'logout'),
    path('<str:username>/', views.other_profile, name = 'other_profile'),
    path('change_username/<str:username>/', views.change_username, name = 'change_username')
]
