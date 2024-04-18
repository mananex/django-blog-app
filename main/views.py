from django.shortcuts import render, redirect
from django.middleware.csrf import get_token
from django.http import JsonResponse
from random import randint
from common import functions
from profiles import models
import json

# Create your views here.
def landing(request):
    if not request.COOKIES.get('csrftoken'): get_token(request)
    return render(request, 'home.html')

def registration(request):
    if request.method == 'GET':
        auth_token = request.COOKIES.get('auth_token')
        if auth_token:
            if functions.auth_token(auth_token):
                return redirect('user_profile')
        return render(request, 'register.html')
    elif request.method == 'POST':
        request_body = json.loads(request.body)
        
        username_validation = functions.validate_username(request_body['username'])
        password_validation = functions.validate_password(request_body['password'])
        
        if username_validation != True: return username_validation
        elif password_validation != True: return password_validation
        elif functions.check_username(request_body['username']): return JsonResponse({'error': 'The username already exist.'}, status = 400)

        password_salt   = str(randint(100, 9999))
        password_hashed = functions.hash(request_body['password'] + password_salt)
        auth_token      = functions.generate_token()
        
        models.Profile(username = request_body['username'], 
                       password = password_hashed, 
                       password_salt = password_salt, 
                       auth_token = auth_token).save()
        
        success_response = JsonResponse({'error': '', 'auth_token': auth_token}, status = 201)
        success_response.set_cookie('auth_token', auth_token, expires = 3600 * 24)
        return success_response

def login(request):
    if request.method == 'GET':
        auth_token = request.COOKIES.get('auth_token')
        if auth_token:
            if functions.auth_token(auth_token):
                return redirect('user_profile')
        return render(request, 'login.html')
    elif request.method == 'POST':
        request_body = json.loads(request.body)
        if functions.check_username(request_body['username']):
            profile = functions.auth_profile(request_body['username'], request_body['password'])
            if profile: 
                print('password is correct')
                
                new_auth_token = functions.generate_token()
                profile.auth_token = new_auth_token
                profile.save()
                
                success_response = JsonResponse({'error': ''}, status = 200)
                success_response.set_cookie('auth_token', new_auth_token, expires = 3600 * 24)
                return success_response
            else: 
                return JsonResponse({'error': 'Password is not correct.'}, status = 400)
        else:
            return JsonResponse({'error': 'User name doesn\'t exist.'}, status = 400)