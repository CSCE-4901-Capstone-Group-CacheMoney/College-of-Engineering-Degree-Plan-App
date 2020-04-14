from django.urls import path
from . import views

urlpatterns = [
	path('studentCreateSession/', views.studentCreateSession, name='studentCreateSession'),
	path('removeInactiveUser/', views.removeInactiveUser, name='removeInactiveUser'),
	path('checkUserExistence/', views.checkUserExistence, name='checkUserExistence'),	
]