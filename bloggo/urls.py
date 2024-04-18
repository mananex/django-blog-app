from django.contrib import admin
from django.urls import path, include

urlpatterns = [
    path('', include('main.urls')),
    path('blogs/', include('blogs.urls')),
    path('profile/', include('profiles.urls')),
    path('admin/', admin.site.urls),
]
