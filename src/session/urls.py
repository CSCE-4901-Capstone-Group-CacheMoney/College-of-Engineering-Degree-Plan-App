from django.urls import path
from . import views

urlpatterns = [
	path('studentCreateSession/', views.studentCreateSession, name='studentCreateSession'),
		
]