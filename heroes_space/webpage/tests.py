import json

from django.contrib.auth import get_user_model
from django.test import TestCase, Client
from webpage.models import SalasMultiplayer, JogadoresMultiplayer, Classes, Campanhas, Missoes

User = get_user_model()


class TestesTest(TestCase):
    def setUp(self):
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

    def test_iniciar_nova_campanha01(self):
        c = Client()
        response = c.post('/api/iniciar_nova_campanha/', {'heroi': ''})

    def test_criar_heroi01(self):
        user = User.objects.create(username='testuser')
        user.set_password('12345')
        user.save()
        c = Client()
        logged_in = c.login(username='testuser', password='12345')
        criar_heroi = c.post("/api/criar_heroi/", {"classe": "Faster"})
        data = json.loads(criar_heroi.content)
        self.assertEqual(data["message"], "Herói criado com sucesso")
