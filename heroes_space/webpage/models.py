from django.db import models
from django.conf import settings
from django.utils.translation import ugettext_lazy as _

HACK = "hk"
FLOOD = "fl"
TRAPACA = "tr"
SPAM = "sp"

TIPOS_DENUNCIAS = (
    (HACK, 'Hack'),
    (FLOOD, 'Flood'),
    (TRAPACA, 'Trapaça'),
    (SPAM, 'Spam')
)


class Denuncias(models.Model):
    pk_denuncia = models.AutoField(primary_key=True)
    motivo = models.CharField(max_length=250)
    data = models.DateTimeField(auto_now_add=True)
    tipo = models.CharField(max_length=2, default=HACK, choices=TIPOS_DENUNCIAS)
    denunciado = models.ForeignKey(settings.AUTH_USER_MODEL, related_name='user_denunciado',
                                   on_delete=models.CASCADE, verbose_name=_("Denunciado"))

    def __str__(self):
        return "{} - {} - {}".format(self.motivo, self.data, self.denunciado)


class Classes(models.Model):
    pk_classe = models.AutoField(primary_key=True)
    nome = models.CharField(max_length=50, db_index=True, unique=True)
    resistencia = models.IntegerField()
    agilidade = models.IntegerField()
    poder_ataque = models.IntegerField()
    vida = models.IntegerField()

    def __str__(self):
        return "{} - {} - {} - {} - {}".format(self.nome, self.resistencia, self.agilidade,
                                               self.poder_ataque, self.vida)


class Herois(models.Model):
    pk_heroi = models.AutoField(primary_key=True)
    nome = models.CharField(max_length=100)
    nivel = models.PositiveIntegerField(default=1)
    experiencia = models.PositiveIntegerField(default=0)
    classe = models.ForeignKey('Classes', on_delete=models.CASCADE,
                               related_name='classe_heroi')
    usuario = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE,
                                related_name='usuario_heroi')
    moedas = models.IntegerField(default=0)

    def __str__(self):
        return "{} - {} - {} - {}".format(self.nivel, self.nome, self.classe.nome, self.usuario)


class Baus(models.Model):
    pk_bau = models.AutoField(primary_key=True)
    ativo = models.BooleanField(default=True)
    heroi = models.OneToOneField('Herois', related_name='user_bau', on_delete=models.CASCADE)
    itens = models.ManyToManyField('Itens', related_name='itens_baus', through='ItensBaus')

    def __str__(self):
        return "{} - {}".format(self.pk_bau, self.heroi.nome)


class ItensBaus(models.Model):
    pk_item = models.ForeignKey('Itens', related_name='item_many', on_delete=models.CASCADE)
    pk_bau = models.ForeignKey('Baus', related_name='bau_many', on_delete=models.CASCADE)
    quantidade = models.PositiveIntegerField(default=1)

    def __str__(self):
        return "{} - {} - {}".format(self.pk_item, self.pk_bau.heroi.nome, self.quantidade)


class Itens(models.Model):
    pk_item = models.AutoField(primary_key=True)
    nome = models.CharField(max_length=100)
    preco = models.IntegerField()
    resistencia = models.IntegerField(default=0)
    agilidade = models.IntegerField(default=0)
    poder_ataque = models.IntegerField(default=0)
    vida = models.IntegerField(default=0)

    def __str__(self):
        return "{} - {}".format(self.nome, self.preco)


class Equipamentos(models.Model):
    pk_item = models.OneToOneField('Itens', primary_key=True, related_name='item_equipamento')
    durabilidade = models.IntegerField(default=0)
    tipo = models.CharField(max_length=50, default="a")

    def __str__(self):
        return "{} - {} - {}".format(self.pk_item.nome, self.durabilidade, self.tipo)


class Consumiveis(models.Model):
    pk_item = models.OneToOneField('Itens', primary_key=True, related_name='item_consumivel')
    duracao = models.IntegerField(default=0)

    def __str__(self):
        return "{} - {}".format(self.pk_item.nome, self.duracao)


class Campanhas(models.Model):
    pk_campanha = models.AutoField(primary_key=True)
    nome = models.CharField(max_length=100, db_index=True, unique=True)

    def __str__(self):
        return "{} - {}".format(self.pk_campanha, self.nome)


class Missoes(models.Model):
    pk_missao = models.IntegerField(primary_key=True)
    nome = models.CharField(max_length=150, db_index=True)
    campanha = models.ForeignKey('Campanhas', on_delete=models.CASCADE, related_name='campanha_missao')

    def __str__(self):
        return "{} - {}".format(self.pk_missao, self.nome)


class ProgressoHeroi(models.Model):
    pk_progresso = models.AutoField(primary_key=True)
    missao = models.ForeignKey('Missoes', related_name='progresso_missao', on_delete=models.CASCADE)
    heroi = models.ForeignKey('Herois', related_name='progresso_heroi', on_delete=models.CASCADE)
    pontuacao = models.IntegerField(default=0)

    def __str__(self):
        return "{} - {} - {}".format(self.missao.nome, self.heroi.nome, self.pontuacao)

    class Meta:
        unique_together = (('missao', 'heroi'),)


class LogSpaceHeroes(models.Model):
    pk_log = models.AutoField(primary_key=True)
    user = models.ForeignKey(settings.AUTH_USER_MODEL, related_name='user_log')
    action = models.CharField(max_length=50)
    date = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return "{} - {} - {}".format(self.user.username, self.date, self.action)
