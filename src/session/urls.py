from django.urls import path
from . import views

urlpatterns = [
	path('login/', views.sessionLoginView, name='sessionLoginView'),
	path('create/', views.sessionHomeView, name='sessionHomeView'),
	path('edit/', views.sessionEditView, name='sessionEditView'),
	path('studentCreateSession/', views.studentCreateSession, name='studentCreateSession'),
	path('removeInactiveUser/', views.removeInactiveUser, name='removeInactiveUser'),
	path('checkUserExistence/', views.checkUserExistence, name='checkUserExistence'),
]