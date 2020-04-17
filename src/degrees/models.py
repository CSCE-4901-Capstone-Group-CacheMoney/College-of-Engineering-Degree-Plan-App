from django.db import models
from django.contrib.postgres.fields import JSONField
#from degrees.models import Degree

# Create your models here.
class Degree(models.Model):
	name = models.CharField(max_length=100)
	catalogYear = models.CharField(max_length=4)
	degreeInfo = JSONField()
	CollegeName = models.CharField(max_length=100)
	specialty = models.CharField(max_length=100)

	def __str__(self):
		return self.name
