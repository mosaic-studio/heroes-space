from django.contrib.auth import login, authenticate, get_user_model
from django.contrib.auth.forms import AuthenticationForm
from django.http import HttpResponseRedirect
from django.shortcuts import render

from webpage.forms import CreateUserForm

User = get_user_model()


def index(request):
    if request.user.is_authenticated():
        return render(request, 'webpage/index.html')
    else:
        return render(request, 'index.html')


def criar_conta(request):
    dados = {"page": "criar_conta"}
    if request.method == "POST":
        form = CreateUserForm(request.POST)
        if form.is_valid():
            new_user = User.objects.create_user(**form.cleaned_data)
            new_user = authenticate(username=form.cleaned_data['username'],
                                    password=form.cleaned_data['password'])
            login(request, new_user)
            return HttpResponseRedirect("/")
        else:
            dados["erros"] = form.errors

        dados["form"] = CreateUserForm()
    return render(request, "webpage/cadastro.html", dados)


def logar(request):
    dados = {"page": "login"}
    if request.method == "POST":
        form = AuthenticationForm(request, data=request.POST)
        if form.is_valid():
            user = login(request, form.get_user())
            return HttpResponseRedirect("/")
        else:
            dados["form"] = form
    return render(request, "registration/login.html", dados)
