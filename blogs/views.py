from django.shortcuts import render, redirect
from django.core.serializers import serialize
from django.http import JsonResponse
from common import functions as commonFunctions
from . import models, functions
from profiles import models as modelsProfiles
import json

# Create your views here.
def blogs(request):
    if request.method == 'GET':
        return render(request, 'blogs.html')
    elif request.method == 'POST':
        request_body = json.loads(request.body)
        result_object = {}
        
        if 'username' in request_body and request_body['username']:
            author_profile = modelsProfiles.Profile.objects.filter(username = request_body['username']).first()
            result_blogs = models.Blog.objects.filter(author_username = author_profile.username).order_by('-id').all()[request_body['start_index']:request_body['end_index']]
        elif 'auth_token' in request_body and request_body['auth_token']:
            author_profile = modelsProfiles.Profile.objects.filter(auth_token = request_body['auth_token']).first()
            result_blogs = models.Blog.objects.filter(author_username = author_profile.username).order_by('-id').all()[request_body['start_index']:request_body['end_index']]
        else: 
            result_blogs = models.Blog.objects.order_by('-id').all()[request_body['start_index']:request_body['end_index']]
        
        for blog in result_blogs: result_object[blog.id] = { 'blog_title': blog.title, 'blog_body': blog.body }
        
        return JsonResponse(result_object, status = 200)

def blog(request, blog_id):
    blog = models.Blog.objects.filter(id = blog_id).first()
    if blog:
        context = {
            'blog_author': blog.author_username,
            'blog_title': blog.title,
            'blog_body': blog.body,
        }
        return render(request, 'blog.html', context)

def create_blog(request):
    auth_token = request.COOKIES.get('auth_token')
    profile = commonFunctions.auth_token(auth_token)
    
    if request.method == 'GET':
        if profile: return render(request, 'edit_blog.html')
        else: return redirect('login')
    elif request.method == 'POST':
        request_body = json.loads(request.body)

        title_validation = functions.validate_blog_title(request_body['blog_title'])
        body_validation  = functions.validate_blog_body(request_body['blog_body'])
        
        if title_validation != True: return title_validation
        elif body_validation != True: return body_validation

        new_blog = models.Blog(author_username = profile.username, title = request_body['blog_title'], body = request_body['blog_body'])
        new_blog.save()

        return JsonResponse({'blog_id': new_blog.id}, status = 200)

def edit_blog(request, blog_id):
    auth_token = request.COOKIES.get('auth_token')
    profile = commonFunctions.auth_token(auth_token)

    if request.method == 'GET':
        if profile:
            blog = models.Blog.objects.filter(id = blog_id).first()
            if profile.username == blog.author_username:
                context = {
                    'title': blog.title,
                    'body': blog.body,
                    'blog_id': blog_id
                }
                return render(request, 'edit_blog.html', context)
            else: return redirect('profile')
        else: return redirect('login')
    elif request.method == 'POST':
        request_body = json.loads(request.body)
        
        title_validation = functions.validate_blog_title(request_body['blog_title'])
        body_validation  = functions.validate_blog_body(request_body['blog_body'])
        
        if title_validation != True: return title_validation
        elif body_validation != True: return body_validation
        
        blog = models.Blog.objects.filter(id = blog_id).first()
        blog.title = request_body['blog_title']
        blog.body = request_body['blog_body']
        blog.save()
        
        return JsonResponse({'error': ''}, status = 200)

def delete_blog(request, blog_id):
    auth_token = request.COOKIES.get('auth_token')
    profile = commonFunctions.auth_token(auth_token)
    
    if not profile: return JsonResponse({'error': 'auth_failed'}, status = 400)
    
    blog = models.Blog.objects.filter(id = blog_id, author_username = profile.username)
    if blog: 
        blog.delete()
        return JsonResponse({'info': 'ok!'}, status = 200)
    
def search(request):
    request_body = json.loads(request.body)
    result_object = {}
    
    blog_list = models.Blog.objects.filter(title__contains = request_body['search_input']).all()
    for blog in blog_list: result_object[blog.id] = { 'blog_title': blog.title, 'blog_body': blog.body }
    
    return JsonResponse(result_object, status = 200)
