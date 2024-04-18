from django.urls import path
from . import views

urlpatterns = [
    path('', views.landing, name = 'landing'),
    path('registration', views.registration, name = 'registration'),
    path('login', views.login, name = 'login'),
]