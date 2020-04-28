from django.db import models
from django.contrib.auth.models import User
from django.contrib.auth.models import AbstractUser
from django.contrib.postgres.fields import JSONField
from django.utils import timezone

# Create your models here.
class Session(models.Model):
	FALL= 'Fall'
	SPRING='Spring'
	SEMESTER_CHOICES = ((FALL,' Fall'), (SPRING, 'Spring'))
	sessionID = models.CharField(max_length = 8)		#PositiveSmallIntegerField()
	sessionPIN = models.CharField(max_length = 4)
	# degreeName = models.CharField(max_length=100)
	completedCourses = JSONField(default=dict)
	last_visit = models.DateField(auto_now = True)
	# degreeYear = models.SmallIntegerField(default = 0)
	degreeID = models.SmallIntegerField(default = 0)
	semesterOption = models.CharField(max_length=10, choices=SEMESTER_CHOICES, default=FALL)

	
	def str(self):
		return str(self.sessionID) + ' ' + str(self.degreeName) + ' ' + str(self.completedCourse)  

	def save(self, *args, **kwargs):
		self.last_visit = timezone.now()
		return super(Session,self).save(*args, **kwargs)
