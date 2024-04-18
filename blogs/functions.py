from django.http import JsonResponse
import string

allowed_symbols = string.ascii_letters + string.digits + ' -_!?:&'

def validate_blog_title(title: str) -> JsonResponse | bool:
    """
    Returns True if title is valid.
    """
    if len(title) < 5: return JsonResponse({'error': 'The title must be longer than 4 characters.'}, status = 400)
    elif len(title) > 60: return JsonResponse({'error': 'The title must be shorter than 61 characters.'}, status = 400)
    
    for symbol in title:
        if symbol not in allowed_symbols:
            return JsonResponse({'error': 'Only allowed ASCII letters, numbers, spaces and _!?:&-'}, status = 400)
        
    return True

def validate_blog_body(body: str) -> JsonResponse | bool:
    """
    Returns True if title is valid.
    """
    if len(body) < 200: return JsonResponse({'error': 'Story must be longer than 200 characters.'}, status = 400)
    elif len(body) > 3000: return JsonResponse({'error': 'Story must be shorter than 3000 characters.'}, status = 400)
    return True