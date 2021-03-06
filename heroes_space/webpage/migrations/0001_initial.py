# -*- coding: utf-8 -*-
# Generated by Django 1.9.10 on 2016-11-27 00:37
from __future__ import unicode_literals

from django.conf import settings
from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    initial = True

    dependencies = [
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
    ]

    operations = [
        migrations.CreateModel(
            name='Baus',
            fields=[
                ('pk_bau', models.AutoField(primary_key=True, serialize=False)),
                ('ativo', models.BooleanField(default=True)),
            ],
        ),
        migrations.CreateModel(
            name='Campanhas',
            fields=[
                ('pk_campanha', models.AutoField(primary_key=True, serialize=False)),
                ('nome', models.CharField(db_index=True, max_length=100, unique=True)),
            ],
        ),
        migrations.CreateModel(
            name='Classes',
            fields=[
                ('pk_classe', models.AutoField(primary_key=True, serialize=False)),
                ('nome', models.CharField(db_index=True, max_length=50, unique=True)),
                ('resistencia', models.IntegerField()),
                ('agilidade', models.IntegerField()),
                ('poder_ataque', models.IntegerField()),
                ('vida', models.IntegerField()),
            ],
        ),
        migrations.CreateModel(
            name='Denuncias',
            fields=[
                ('pk_denuncia', models.AutoField(primary_key=True, serialize=False)),
                ('motivo', models.CharField(max_length=250)),
                ('data', models.DateTimeField(auto_now_add=True)),
                ('tipo', models.CharField(choices=[('hk', 'Hack'), ('fl', 'Flood'), ('tr', 'Trapaça'), ('sp', 'Spam')], default='hk', max_length=2)),
                ('denunciado', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='user_denunciado', to=settings.AUTH_USER_MODEL, verbose_name='Denunciado')),
            ],
        ),
        migrations.CreateModel(
            name='Herois',
            fields=[
                ('pk_heroi', models.AutoField(primary_key=True, serialize=False)),
                ('nome', models.CharField(max_length=100)),
                ('nivel', models.PositiveIntegerField(default=1)),
                ('experiencia', models.PositiveIntegerField(default=0)),
                ('moedas', models.IntegerField(default=0)),
                ('classe', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='classe_heroi', to='webpage.Classes')),
                ('usuario', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='usuario_heroi', to=settings.AUTH_USER_MODEL)),
            ],
        ),
        migrations.CreateModel(
            name='Itens',
            fields=[
                ('pk_item', models.AutoField(primary_key=True, serialize=False)),
                ('nome', models.CharField(max_length=100)),
                ('preco', models.IntegerField()),
                ('resistencia', models.IntegerField(default=0)),
                ('agilidade', models.IntegerField(default=0)),
                ('poder_ataque', models.IntegerField(default=0)),
                ('vida', models.IntegerField(default=0)),
            ],
        ),
        migrations.CreateModel(
            name='ItensBaus',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('quantidade', models.PositiveIntegerField(default=1)),
                ('pk_bau', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='bau_many', to='webpage.Baus')),
            ],
        ),
        migrations.CreateModel(
            name='LogSpaceHeroes',
            fields=[
                ('pk_log', models.AutoField(primary_key=True, serialize=False)),
                ('action', models.CharField(max_length=50)),
                ('date', models.DateTimeField(auto_now_add=True)),
                ('user', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='user_log', to=settings.AUTH_USER_MODEL)),
            ],
        ),
        migrations.CreateModel(
            name='Missoes',
            fields=[
                ('pk_missao', models.IntegerField(primary_key=True, serialize=False)),
                ('nome', models.CharField(db_index=True, max_length=150)),
                ('campanha', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='campanha_missao', to='webpage.Campanhas')),
            ],
        ),
        migrations.CreateModel(
            name='ProgressoHeroi',
            fields=[
                ('pk_progresso', models.AutoField(primary_key=True, serialize=False)),
                ('pontuacao', models.IntegerField(default=0)),
                ('heroi', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='progresso_heroi', to='webpage.Herois')),
                ('missao', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='progresso_missao', to='webpage.Missoes')),
            ],
        ),
        migrations.CreateModel(
            name='Consumiveis',
            fields=[
                ('pk_item', models.OneToOneField(on_delete=django.db.models.deletion.CASCADE, primary_key=True, related_name='item_consumivel', serialize=False, to='webpage.Itens')),
                ('duracao', models.IntegerField(default=0)),
            ],
        ),
        migrations.CreateModel(
            name='Equipamentos',
            fields=[
                ('pk_item', models.OneToOneField(on_delete=django.db.models.deletion.CASCADE, primary_key=True, related_name='item_equipamento', serialize=False, to='webpage.Itens')),
                ('durabilidade', models.IntegerField(default=0)),
                ('tipo', models.CharField(default='a', max_length=50)),
            ],
        ),
        migrations.AddField(
            model_name='itensbaus',
            name='pk_item',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='item_many', to='webpage.Itens'),
        ),
        migrations.AddField(
            model_name='baus',
            name='heroi',
            field=models.OneToOneField(on_delete=django.db.models.deletion.CASCADE, related_name='user_bau', to='webpage.Herois'),
        ),
        migrations.AddField(
            model_name='baus',
            name='itens',
            field=models.ManyToManyField(related_name='itens_baus', through='webpage.ItensBaus', to='webpage.Itens'),
        ),
        migrations.AlterUniqueTogether(
            name='progressoheroi',
            unique_together=set([('missao', 'heroi')]),
        ),
    ]
