# Generated by Django 2.1.2 on 2019-04-13 03:51

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('users', '0002_auto_20190412_2249'),
    ]

    operations = [
        migrations.AlterField(
            model_name='student',
            name='password',
            field=models.CharField(default='temp', max_length=32),
        ),
    ]
