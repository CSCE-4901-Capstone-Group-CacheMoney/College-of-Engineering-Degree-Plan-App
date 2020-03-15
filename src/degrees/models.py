from django.db import models
from django.contrib.postgres.fields import JSONField

# Create your models here.
class Degree(models.Model):
	name = models.CharField(max_length=100)
	#courseList = models.TextField()
	catalogYear = models.CharField(max_length=4)
	degreeInfo = JSONField()

	def __str__(self):
		return self.name
