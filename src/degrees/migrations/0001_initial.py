# Generated by Django 3.0.2 on 2020-03-15 21:12

import django.contrib.postgres.fields.jsonb
from django.db import migrations, models


class Migration(migrations.Migration):

    initial = True

    dependencies = [
    ]

    operations = [
        migrations.CreateModel(
            name='Degree',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('name', models.CharField(max_length=100)),
                ('catalogYear', models.CharField(max_length=4)),
                ('degreeInfo', django.contrib.postgres.fields.jsonb.JSONField()),
            ],
        ),
    ]
