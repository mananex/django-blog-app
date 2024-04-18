from django.shortcuts import render, redirect
from django.http import JsonResponse
from common import functions
from . import models
from blogs import models as modelsBlog

# Create your views here.
def user_profile(request):
    auth_token = request.COOKIES.get('auth_token')
    profile = functions.auth_token(auth_token)
    if profile:
        context = {
            'name': profile.username,
            'auth_token': auth_token
        }
        return render(request, 'user_profile.html', context)
    else:
        return redirect('login')

def other_profile(request, username):
    auth_token = request.COOKIES.get('auth_token')
    profile = models.Profile.objects.filter(username = username).first()
    
    if auth_token == profile.auth_token: return redirect('user_profile')
    
    context = {
        'name': profile.username
    }
    return render(request, 'other_profile.html', context)

def change_username(request, username):
    auth_token = request.COOKIES.get('auth_token')
    if auth_token:
        username_validation = functions.validate_username(username)
        if username_validation != True: return username_validation
        
        profile = models.Profile.objects.filter(auth_token = auth_token).first()
        profile_blogs = modelsBlog.Blog.objects.filter(author_username = profile.username)
        
        profile.username = username
        profile.save()
        
        profile_blogs.update(author_username = username)
        return JsonResponse({'info': 'ok!'}, status = 200)
    
def logout(request):
    response = redirect('landing')
    response.delete_cookie('auth_token')
    return response