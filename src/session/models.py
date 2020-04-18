from django.db import models
from django.contrib.auth.models import User
from django.contrib.auth.models import AbstractUser
from django.contrib.postgres.fields import JSONField
from django.utils import timezone

# Create your models here.
class Session(models.Model):
	sessionID = models.CharField(max_length = 8)		#PositiveSmallIntegerField()
	sessionPIN = models.PositiveSmallIntegerField()
	degreeName = models.CharField(max_length=100)
	completedCourses = JSONField(default=dict)
	last_visit = models.DateField(auto_now = True)

	def str(self):
		return str(self.sessionID) + ' ' + str(self.degreeName) + ' ' + str(self.completedCourse)  

	def save(self, *args, **kwargs):
		self.last_visit = timezone.now()
		return super(Session,self).save(*args, **kwargs)
