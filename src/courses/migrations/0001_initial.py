# Generated by Django 3.0.4 on 2020-03-31 20:27

import django.contrib.postgres.fields.jsonb
from django.db import migrations, models


class Migration(migrations.Migration):

    initial = True

    dependencies = [
    ]

    operations = [
        migrations.CreateModel(
            name='Course',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('courseID', models.PositiveSmallIntegerField()),
                ('courseDept', models.CharField(max_length=4)),
                ('name', models.CharField(max_length=100)),
                ('preCoReq', django.contrib.postgres.fields.jsonb.JSONField()),
                ('category', models.CharField(max_length=50)),
                ('hours', models.PositiveSmallIntegerField()),
                ('semester', models.CharField(choices=[('Fall', 'Fall'), ('Spring', 'Spring'), ('Both', 'Both')], default='Both', max_length=10)),
                ('description', models.TextField()),
            ],
        ),
        migrations.CreateModel(
            name='Prereq',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('courseID', models.PositiveSmallIntegerField()),
                ('courseDept', models.CharField(max_length=4)),
                ('prereqCourses', django.contrib.postgres.fields.jsonb.JSONField()),
            ],
        ),
    ]
