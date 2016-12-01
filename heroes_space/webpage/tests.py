import json

from django.contrib.auth import get_user_model
from django.test import TestCase, Client
from webpage.models import SalasMultiplayer, JogadoresMultiplayer, Classes, Campanhas, Missoes

User = get_user_model()


class TestesTest(TestCase):
    def setUp(self):
        """
        Inicializando com dados necessários para o teste.
        :return:
        """
        tank = Classes.objects.create(nome='Tank', resistencia=4, agilidade=2, poder_ataque=2, vida=120)
        hybrid = Classes.objects.create(nome='Hybrid', resistencia=2, agilidade=3, poder_ataque=3, vida=100)
        faster = Classes.objects.create(nome='Faster', resistencia=1, agilidade=5, poder_ataque=2, vida=75)

        camp_1 = Campanhas.objects.create(nome="Prólogo")
        camp_2 = Campanhas.objects.create(nome="Descoberta")
        camp_3 = Campanhas.objects.create(nome="Invasão")
        camp_4 = Campanhas.objects.create(nome="Ato Final")

        Missoes.objects.create(campanha=camp_1, nome="Prólogo", pk_missao=1)
        Missoes.objects.create(campanha=camp_2, nome="Explorando o Universo", pk_missao=2)
        Missoes.objects.create(campanha=camp_2, nome="Primeiro Contato", pk_missao=3)
        Missoes.objects.create(campanha=camp_2, nome="Plano de Fuga", pk_missao=4)
        Missoes.objects.create(campanha=camp_2, nome="Ilusão", pk_missao=5)

        SalasMultiplayer.objects.create(nome="Only PRO", max_jogadores=8, mapa="Dust2_Universe")
        SalasMultiplayer.objects.create(nome="4Noobs", max_jogadores=4, mapa="Aztec_Universe")
        SalasMultiplayer.objects.create(nome="x1", max_jogadores=2, mapa="Pool_day_Galaxy")
        user = User.objects.create(username='testuser')
        user.set_password('12345')
        user.save()
        user = User.objects.create(username='testuser2')
        user.set_password('12345')
        user.save()
        user = User.objects.create(username='testuser3')
        user.set_password('12345')
        user.save()

    def test_criar_heroi01(self):
        """
        Teste de criação de heróis
        Resultado esperado: Faster
        :return:
        """
        c = Client()
        logged_in = c.login(username='testuser', password='12345')
        criar_heroi = c.post("/api/criar_heroi/", {"classe": "Faster"})
        data = json.loads(criar_heroi.content.decode("utf-8"))
        self.assertEqual(data["classe"], "Faster")

    def test_iniciar_nova_campanha01(self):
        """
        Teste para criação de uma nova campanha
        Resultado esperado: True
        :return:
        """
        c = Client()
        logged_in = c.login(username='testuser', password='12345')
        criar_heroi = c.post("/api/criar_heroi/", {"classe": "Faster"})
        data = json.loads(criar_heroi.content.decode("utf-8"))
        self.assertEqual(data["success"], True)

    def test_listar_salas_multiplayer01(self):
        """
        Teste para a listagem de salas multiplayer
        Resultado esperado: 3
        :return:
        """
        c = Client()
        logged_in = c.login(username='testuser', password='12345')
        listar_salas = c.get("/api/listar_salas/")
        data = json.loads(listar_salas.content.decode("utf-8"))
        self.assertEqual(len(data["data"]), 3)

    def test_entrar_sala_multiplayer01(self):
        """
        Teste de usuário entrando na sala.
        Resultado esperado: True
        :return:
        """
        sala = SalasMultiplayer.objects.get(nome="Only PRO")
        c = Client()
        logged_in = c.login(username='testuser', password='12345')
        entrar_sala = c.post("/api/entrar_sala/", {"id_sala": sala.pk})
        data = json.loads(entrar_sala.content.decode("utf-8"))
        self.assertEqual(data["success"], True)

    def test_entrar_sala_multiplayer02(self):
        """
        Teste excedendo o número máximo de jogadores na sala.
        Resultado esperado: False
        :return:
        """
        sala = SalasMultiplayer.objects.get(nome="x1")
        c = Client()
        c.login(username='testuser', password='12345')
        c.post("/api/entrar_sala/", {"id_sala": sala.pk})
        c.logout()
        c.login(username='testuser2', password='12345')
        c.post("/api/entrar_sala/", {"id_sala": sala.pk})
        c.logout()
        logged_in = c.login(username='testuser3', password='12345')
        entrar_sala = c.post("/api/entrar_sala/", {"id_sala": sala.pk})
        data = json.loads(entrar_sala.content.decode("utf-8"))
        self.assertEqual(data["success"], False)

    def test_sair_sala_multiplayer01(self):
        """
        Teste para o usuário sair de uma sala.
        Resultado esperado: True
        :return:
        """
        sala = SalasMultiplayer.objects.get(nome="Only PRO")
        c = Client()
        logged_in = c.login(username='testuser', password='12345')
        c.post("/api/entrar_sala/", {"id_sala": sala.pk})
        entrar_sala = c.post("/api/sair_sala/", {"id_sala": sala.pk})
        data = json.loads(entrar_sala.content.decode("utf-8"))
        self.assertEqual(data["success"], True)

    def test_sair_sala_multiplayer02(self):
        """
        Teste para o usuário sair de uma sala.
        Resultado esperado: False
        :return:
        """
        sala = SalasMultiplayer.objects.get(nome="Only PRO")
        c = Client()
        logged_in = c.login(username='testuser', password='12345')
        c.post("/api/entrar_sala/", {"id_sala": sala.pk})
        c.logout()
        c.login(username='testuser2', password='12345')
        entrar_sala = c.post("/api/sair_sala/", {"id_sala": sala.pk})
        data = json.loads(entrar_sala.content.decode("utf-8"))
        self.assertEqual(data["success"], False)

    def test_registrar_pontos(self):
        """
        Teste para registrar os pontos de um herói/nave.
        Resultado esperado: True
        :return:
        """
        c = Client()
        logged_in = c.login(username='testuser', password='12345')
        criar_heroi = c.post("/api/criar_heroi/", {"classe": "Faster"})
        heroi = json.loads(criar_heroi.content.decode("utf-8"))
        iniciar_campanha = c.post("/api/iniciar_nova_campanha/", {"heroi": heroi["heroi"]})
        c.post("/api/registrar_fase01/", {"heroi": heroi["heroi"]})
        registrar_pontos = c.post("/api/registrar_pontuacao/", {"heroi": heroi["heroi"], "missao": 2, "pontos": 100})
        data = json.loads(registrar_pontos.content.decode("utf-8"))
        self.assertEqual(data["success"], True)

    def test_ranking01(self):
        """
        Teste para listar o ranking.
        Resultado esperado: 100
        :return:
        """
        c = Client()
        logged_in = c.login(username='testuser', password='12345')
        criar_heroi = c.post("/api/criar_heroi/", {"classe": "Faster"})
        heroi = json.loads(criar_heroi.content.decode("utf-8"))
        iniciar_campanha = c.post("/api/iniciar_nova_campanha/", {"heroi": heroi["heroi"]})
        c.post("/api/registrar_fase01/", {"heroi": heroi["heroi"]})
        registrar_pontos = c.post("/api/registrar_pontuacao/", {"heroi": heroi["heroi"], "missao": 2, "pontos": 100})
        ranking = c.get("/api/ranking/")
        data = json.loads(ranking.content.decode("utf-8"))
        self.assertEqual(data["data"][0]["pontuacao"], 100)
