import csv
from django.contrib.auth import login, authenticate, get_user_model
from django.contrib.auth.decorators import login_required
from django.contrib.auth.forms import AuthenticationForm
from django.db.models import Sum
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
            LogSpaceHeroes.objects.create(user=user, action='Logar conta no site')
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


@csrf_exempt
@login_required
def criar_heroi_request(request):
    if request.method == "POST":
        classe = request.POST.get("classe", "Hybrid")
        heroi = criar_heroi_function(request, classe=classe)
        return JsonResponse({"message": "Herói criado com sucesso", "success": True, "heroi": heroi.pk,
                             "nivel": heroi.nivel, "classe": heroi.classe.nome,
                             "resistencia": heroi.classe.resistencia, "agilidade": heroi.classe.agilidade,
                             "poder_ataque": heroi.classe.poder_ataque, "vida": heroi.classe.vida})


def criar_heroi_function(request, classe="Hybrid"):
    classe = Classes.objects.get(nome=classe)
    heroi = Herois.objects.create(nome=request.user, classe=classe, usuario=request.user)
    LogSpaceHeroes.objects.create(user=request.user, action='Criar herói')
    return heroi


@csrf_exempt
@login_required
def iniciar_nova_campanha(request):
    if request.method == "POST":
        campanha = Campanhas.objects.get(nome="Prólogo")
        missao = Missoes.objects.get(campanha=campanha, pk_missao=1)
        id_heroi = request.POST.get("heroi")
        heroi = Herois.objects.get(pk_heroi=id_heroi)
        ProgressoHeroi.objects.create(heroi=heroi, missao=missao)
        LogSpaceHeroes.objects.create(user=request.user, action='Iniciar nova campanha')
        return JsonResponse({"message": "Campanha criada com sucesso", "success": True})


@csrf_exempt
@login_required
def escolher_heroi(request):
    if request.method == "POST":
        id_heroi = request.POST.get("heroi")
        heroi = Herois.objects.select_for_update().get(pk_heroi=id_heroi)
        progresso = ProgressoHeroi.objects.select_related().filter(heroi=heroi).order_by('missao__pk_missao')[0]
        return JsonResponse({"missao": progresso.missao.pk_missao, "nivel": heroi.nivel, "classe": heroi.classe.nome,
                             "resistencia": heroi.classe.resistencia, "agilidade": heroi.classe.agilidade,
                             "poder_ataque": heroi.classe.poder_ataque, "vida": heroi.classe.vida})


@csrf_exempt
@login_required
def registrar_fase1(request):
    if request.method == "POST":
        missao = Missoes.objects.get(pk_missao=2)
        id_heroi = request.POST.get("heroi")
        heroi = Herois.objects.get(pk_heroi=id_heroi)
        ProgressoHeroi.objects.create(heroi=heroi, missao=missao)
        LogSpaceHeroes.objects.create(user=request.user, action='Iniciar fase 1')
        return JsonResponse({"message": "Iniciar fase 1", "success": True})


@csrf_exempt
@login_required
def registrar_fase2(request):
    if request.method == "POST":
        missao = Missoes.objects.get(pk_missao=3)
        id_heroi = request.POST.get("heroi")
        heroi = Herois.objects.get(pk_heroi=id_heroi)
        ProgressoHeroi.objects.create(heroi=heroi, missao=missao)
        LogSpaceHeroes.objects.create(user=request.user, action='Iniciar fase 2')
        return JsonResponse({"message": "Iniciar fase 2", "success": True})


@csrf_exempt
@login_required
def registrar_fase3(request):
    if request.method == "POST":
        missao = Missoes.objects.get(pk_missao=4)
        id_heroi = request.POST.get("heroi")
        heroi = Herois.objects.get(pk_heroi=id_heroi)
        ProgressoHeroi.objects.create(heroi=heroi, missao=missao)
        LogSpaceHeroes.objects.create(user=request.user, action='Iniciar fase 3')
        return JsonResponse({"message": "Iniciar fase 3", "success": True})


@csrf_exempt
@login_required
def registrar_fase4(request):
    if request.method == "POST":
        missao = Missoes.objects.get(pk_missao=5)
        id_heroi = request.POST.get("heroi")
        heroi = Herois.objects.get(pk_heroi=id_heroi)
        ProgressoHeroi.objects.create(heroi=heroi, missao=missao)
        LogSpaceHeroes.objects.create(user=request.user, action='Iniciar fase 3')
        return JsonResponse({"message": "Iniciar fase 4", "success": True})


@csrf_exempt
@login_required
def registrar_pontuacao(request):
    if request.method == "POST":
        pontos = int(request.POST.get("pontos", 0))
        id_missao = request.POST.get("missao")
        id_heroi = request.POST.get("heroi")
        heroi = Herois.objects.get(pk_heroi=id_heroi)
        missao = Missoes.objects.get(pk_missao=id_missao)
        progresso = ProgressoHeroi.objects.get(heroi=heroi, missao=missao)
        if pontos > progresso.pontuacao and pontos > 0:
            progresso.pontuacao = pontos
            progresso.save()

        return JsonResponse({"message": "Pontos registrados", "success": True})


@login_required
def ranking(request):
    ranking_dict = {"status": True, "data": []}
    progr = ProgressoHeroi.objects.select_related().annotate(pontuacao_jogador=Sum("pontuacao")).order_by(
        '-pontuacao_jogador')[:20]

    for p in progr:
        ranking_dict["data"].append({"nome": p.heroi.nome, "pontuacao": p.pontuacao_jogador})

    return JsonResponse(ranking_dict)


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
