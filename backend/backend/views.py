from django.http import *
from django.middleware.csrf import get_token
from django.views.decorators.http import *

@require_GET
def get_csrf(request: HttpRequest) -> JsonResponse:
    """
    Function to retrieve CSRF token

    Parameters:
        request (HttpRequest): get request to retrieve token
    
    Returns:
        response (JsonResponse): response with token in it
    """
    response = JsonResponse({
        'token': get_token(request)
    })

    return response

count = 1

def get_count(request: HttpRequest) -> JsonResponse:
    """
    Function to retrieve current count

    Parameters:
        request (HttpRequest): get request to retrieve count

    Returns:
        response (JsonResponse): response with count
    """
    return JsonResponse({
        'count': count
    })

