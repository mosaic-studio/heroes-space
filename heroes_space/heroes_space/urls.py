"""heroes_space URL Configuration

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/1.9/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  url(r'^$', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  url(r'^$', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.conf.urls import url, include
    2. Add a URL to urlpatterns:  url(r'^blog/', include('blog.urls'))
"""
from django.conf.urls import url
from django.contrib import admin

from webpage import views

urlpatterns = [
    url(r'^admin/', admin.site.urls),
    url(r'^$', views.index),
    url(r'^login/$', views.logar),
    url(r'^criar_conta/$', views.criar_conta),
    url(r'^api/iniciar_nova_campanha/$', views.iniciar_nova_campanha),
    url(r'^api/registrar_fase01/$', views.registrar_fase1),
    url(r'^api/registrar_fase02/$', views.registrar_fase2),
    url(r'^api/registrar_fase03/$', views.registrar_fase3),
    url(r'^api/registrar_fase04/$', views.registrar_fase4),
    url(r'^api/registrar_pontuacao/$', views.registrar_pontuacao),
    url(r'^api/ranking/$', views.ranking),
    url(r'^api/criar_heroi/$', views.criar_heroi_request),
    url(r'^api/listar_salas/$', views.listar_salas_multiplayer),
    url(r'^api/entrar_sala/$', views.entrar_sala_multiplayer),
    url(r'^api/sair_sala/$', views.sair_sala_multiplayer),
]
