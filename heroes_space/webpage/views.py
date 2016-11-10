import csv
from django.contrib.auth import login, authenticate, get_user_model
from django.contrib.auth.decorators import login_required
from django.contrib.auth.forms import AuthenticationForm
from django.http import HttpResponse
from django.http import HttpResponseRedirect
from django.http import JsonResponse
from django.shortcuts import render
from django.views.decorators.csrf import csrf_exempt

from webpage.forms import CreateUserForm
from webpage.models import LogSpaceHeroes, Herois, Classes, Campanhas, ProgressoHeroi, Missoes

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
            user = User.objects.create_user(**form.cleaned_data)
            new_user = authenticate(username=form.cleaned_data['username'],
                                    password=form.cleaned_data['password'])
            login(request, new_user)
            LogSpaceHeroes.objects.create(user=user, action='Criar conta no site')
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
            LogSpaceHeroes.objects.create(user=form.get_user(), action='Logar conta no site')
            return HttpResponseRedirect("/")
        else:
            dados["form"] = form
    return render(request, "registration/login.html", dados)


@csrf_exempt
@login_required
def criar_heroi_request(request):
    if request.method == "POST":
        criar_heroi_function(request)
        return JsonResponse({"message": "Herói criado com sucesso", "status": True})


def criar_heroi_function(request):
    classe = Classes.objects.get(nome="Hybrid")
    heroi = Herois.objects.create(nome=request.user, classe=classe, usuario=request.user)
    LogSpaceHeroes.objects.create(user=request.user, action='Criar herói')
    return heroi


@csrf_exempt
@login_required
def iniciar_nova_campanha(request):
    if request.method == "POST":
        campanha = Campanhas.objects.get(nome="Prólogo")
        missao = Missoes.objects.get(campanha=campanha, ordem=1)
        heroi = criar_heroi_function(request)
        ProgressoHeroi.objects.create(heroi=heroi, missao=missao)
        LogSpaceHeroes.objects.create(user=request.user, action='Iniciar nova campanha')
        return JsonResponse({"message": "Campanha criada com sucesso", "status": True})


@csrf_exempt
@login_required
def registrar_fase1(request):
    if request.method == "POST":
        campanha = Campanhas.objects.get(nome="Descoberta")
        missao = Missoes.objects.get(campanha=campanha, ordem=1)
        heroi = Herois.objects.filter(usuario=request.user)[0]
        ProgressoHeroi.objects.create(heroi=heroi, missao=missao)
        LogSpaceHeroes.objects.create(user=request.user, action='Iniciar fase 1')
        return JsonResponse({"message": "Iniciar fase 1", "status": True})


@csrf_exempt
@login_required
def registrar_fase2(request):
    if request.method == "POST":
        campanha = Campanhas.objects.get(nome="Descoberta")
        missao = Missoes.objects.get(campanha=campanha, ordem=2)
        heroi = Herois.objects.filter(usuario=request.user)[0]
        ProgressoHeroi.objects.create(heroi=heroi, missao=missao)
        LogSpaceHeroes.objects.create(user=request.user, action='Iniciar fase 2')
        return JsonResponse({"message": "Iniciar fase 2", "status": True})


@login_required
def gerar_relatorio(request):
    if request.user.is_superuser:
        response = HttpResponse(content_type='text/csv')
        response['Content-Disposition'] = 'attachment; filename="somefilename.csv"'
        writer = csv.writer(response)
        writer.writerow(['Usuário', 'Data/Hora', 'Alteração realizada'])
        logs = LogSpaceHeroes.objects.all()
        for i in logs:
            writer.writerow([i.user.username, i.date, i.action])

        return response


@login_required
def pag_gerar_relatorio(request):
    return render(request, "webpage/cadastro.html")
