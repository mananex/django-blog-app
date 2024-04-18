from django.http import JsonResponse
from profiles import models as profileModels

import string
import secrets
import hashlib

allowed_symbols = string.ascii_letters + string.digits + '_'

def hash(data: str) -> str:
    """
    Hash the string and return it.
    """
    return hashlib.sha256(data.encode()).hexdigest()

def auth_profile(profile_id: int):
    return profileModels.Profile.objects.filter(profile_id = profile_id).first()

def check_username(username: str) -> bool:
    """
    Returns true if username exist.
    """
    profile = profileModels.Profile.objects.filter(username = username).exists()
    if profile: return True
    return False

def auth_profile(username: str, password: str):
    """
    Returns profile if credentials are true.
    """
    profile             = profileModels.Profile.objects.filter(username = username).first()
    input_password_hash = hash(password + profile.password_salt)
    if profile.password == input_password_hash: return profile

def validate_username(username: str) -> JsonResponse | bool:
    """
    Returns None if username is correct.
    """
    if len(username) < 4: return JsonResponse({'error': 'The username must be longer than 3 characters'}, status = 400)
    elif len(username) > 25: return JsonResponse({'error': 'The username must be shorter than 26 characters.'}, status = 400)
    
    for symbol in username:
        if symbol not in allowed_symbols:
            return JsonResponse({'error': 'The username can contain only letters, numbers and _'}, status = 400)
        
    return True
    
def validate_password(password: str) -> JsonResponse | bool:
    """
    Returns None if password is correct.
    """
    if len(password) < 6: return JsonResponse({'error': 'The password must be longer than 5 characters.'}, status = 400)
    elif len(password) > 30: return JsonResponse({'error': 'The password must be shorter than 31 characters.'}, status = 400)
    return True

def generate_token() -> str:
    """
    Generated token will be used for profiles to stay logged in.
    """
    while True:
        token_hash = hash(secrets.token_hex(8))
        profile = profileModels.Profile.objects.filter(auth_token = token_hash).first()
        if not profile: return token_hash

def auth_token(auth_token: str) -> profileModels.Profile:
    """
    Authenticates token. Returns the profile object if token is available.
    """
    profile = profileModels.Profile.objects.filter(auth_token = auth_token).first()
    if profile: return profile
     