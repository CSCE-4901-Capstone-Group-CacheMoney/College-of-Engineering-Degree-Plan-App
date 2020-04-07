# Generated by Django 3.0.4 on 2020-04-07 18:51

import django.contrib.postgres.fields.jsonb
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('users', '0001_initial'),
    ]

    operations = [
        migrations.CreateModel(
            name='Session',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('sessionID', models.CharField(max_length=8)),
                ('sessionPIN', models.PositiveSmallIntegerField(max_length=4)),
                ('degreeName', models.CharField(max_length=100)),
                ('completedCourses', django.contrib.postgres.fields.jsonb.JSONField()),
            ],
        ),
    ]
