from django.db import models
from django.contrib.auth.models import User
from django.contrib.auth.models import AbstractUser
from django.contrib.postgres.fields import JSONField


# Create your models here.
class Session(models.Model):
	sessionID = models.CharField(max_length = 8)		#PositiveSmallIntegerField()
	sessionPIN = models.PositiveSmallIntegerField()
	degreeName = models.CharField(max_length=100)
	completedCourses = JSONField()

	def str(self):
		return str(self.sessionID) + ' ' + str(self.degreeName) + ' ' + str(self.completedCourse)  
