from django.core.management.base import BaseCommand
from webpage.models import Classes, Campanhas, Missoes, Itens, Equipamentos, Consumiveis


class Command(BaseCommand):

    def handle(self, *args, **options):
        tank = Classes.objects.create(nome='Tank', resistencia=70, agilidade=30, poder_ataque=10, vida=500)
        hybrid = Classes.objects.create(nome='Hybrid', resistencia=0, agilidade=100, poder_ataque=50, vida=250)
        faster = Classes.objects.create(nome='Faster', resistencia=10, agilidade=250, poder_ataque=35, vida=150)

        camp_1 = Campanhas.objects.create(nome="Prólogo")
        camp_2 = Campanhas.objects.create(nome="Descoberta")
        camp_3 = Campanhas.objects.create(nome="Invasão")
        camp_4 = Campanhas.objects.create(nome="Ato Final")

        Missoes.objects.create(campanha=camp_1, nome="Prólogo", pk_missao=1)
        Missoes.objects.create(campanha=camp_2, nome="Explorando o Universo", pk_missao=2)
        Missoes.objects.create(campanha=camp_2, nome="Primeiro Contato", pk_missao=3)
        Missoes.objects.create(campanha=camp_2, nome="Plano de Fuga", pk_missao=4)
        Missoes.objects.create(campanha=camp_2, nome="Ilusão", pk_missao=5)
