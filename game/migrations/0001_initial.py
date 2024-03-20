# Generated by Django 5.0.3 on 2024-03-19 14:33

from django.db import migrations, models


class Migration(migrations.Migration):

    initial = True

    dependencies = [
    ]

    operations = [
        migrations.CreateModel(
            name='RoundData',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('playerId', models.CharField(max_length=64)),
                ('roundIndex', models.IntegerField()),
                ('curriculumType', models.CharField(max_length=32)),
                ('mapping', models.CharField(max_length=128)),
                ('source', models.CharField(max_length=32)),
                ('start', models.IntegerField()),
                ('score', models.IntegerField()),
                ('target', models.IntegerField()),
                ('starttime', models.CharField(max_length=64)),
                ('endtime', models.CharField(max_length=64)),
                ('timeCreated', models.DateTimeField(auto_now_add=True)),
            ],
            options={
                'verbose_name': 'Round Data',
                'verbose_name_plural': 'Round Data',
            },
        ),
    ]