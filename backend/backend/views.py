from django.http import *
from django.middleware.csrf import get_token
from django.views.decorators.http import *
from django.views.decorators.csrf import csrf_exempt
import json

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

# @csrf_exempt
@require_http_methods(['GET', 'PATCH'])
def count_request(request: HttpRequest) -> JsonResponse:
    """
    Function to retrieve current count

    Parameters:
        request (HttpRequest): get request to retrieve count

    Returns:
        response (JsonResponse): response with count
    """
    global count

    print(json.dumps(dict(request.headers), indent=2))

    if request.method == 'PATCH':
        count += 1
    
    return JsonResponse({
        'count': count
    })

