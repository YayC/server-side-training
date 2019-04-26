from django.contrib.auth import authenticate
from django.contrib.auth import login as log_in
from django.contrib.auth import logout as log_out
from django.http import HttpResponseRedirect
from django.shortcuts import render

from images.forms import SignUpForm
from images.forms import LoginForm
import datetime
from mixpanel import Mixpanel

mp = Mixpanel('882f2de242c9b75b0c2df3af6af6790f')

def index(request):
    """Return the logged in page, or the logged out page
    """
    print('Index view!')
    if request.user.is_authenticated():
        mp.track(request.user.id, "Page Served", {"page": "index-logged-in"})
        return render(request, 'images/index-logged-in.html', {
            'user': request.user
        })
    else:
        return render(request, 'images/index-logged-out.html')


def signup(request):
    """Render the Signup form or a process a signup
    """
    if request.method == 'POST':
        form = SignUpForm(request.POST)
        mp_distinct_id = request.POST.get('mp_distinct_id')

        if form.is_valid():
            form.save()
            username = form.cleaned_data.get('username')
            raw_password = form.cleaned_data.get('password1')
            user = authenticate(username=username, password=raw_password)
            log_in(request, user)

            mp.alias(user.id, mp_distinct_id)
            mp.track(mp_distinct_id, "Signed Up", {"username": username})
            mp.people_set(mp_distinct_id, {
                'username': username,
                'Lifetime Corgis': 0,
                'logins': 1,
                '$created': datetime.datetime.now().isoformat()
            }, meta={'$ip': 0})

            return HttpResponseRedirect('/')
        else:
            # track validation failed
            mp.track(mp_distinct_id, 'Signup Failed', {"error_json": form.errors.as_json()})

    else:
        form = SignUpForm()

    return render(request, 'images/signup.html', {'form': form})


def login(request):
    """Render the login form or log in the user
    """
    if request.method == 'POST':
        username = request.POST['username']
        password = request.POST['password']
        user = authenticate(username=username, password=password)
        if user is not None:
            log_in(request, user)
            mp.track(user.id, 'Login', {
                'Username': username,
                'id': user.id
            })
            return HttpResponseRedirect('/')
        else:
            mp_distinct_id = request.POST.get('mp_distinct_id')
            mp.track(mp_distinct_id, 'Failed Login', {
                'username': username,
            })
            return render(request, 'images/login.html', {
                'form': LoginForm,
                'error': 'Please try again'
            })
    else:
        return render(request, 'images/login.html', {'form': LoginForm})



def logout(request):
    """Logout the user
    """
    user_id = request.user.id

    log_out(request)

    mp.track(user_id, 'Logged Out')
    return HttpResponseRedirect('/')
