from django.urls import path
from degrees import views as dviews
from . import views

urlpatterns = [
	path('login/', views.sessionLoginView, name='sessionLoginView'),
	path('create/', views.sessionHomeView, name='sessionHomeView'),
	path('edit/', views.sessionEditView, name='sessionEditView'),
	path('view/degree-plan/', views.sessionViewDegreePlan, name='sessionViewDegreePlan'),
	path('view/transcript/', views.sessionViewTranscript, name='sessionViewTranscript'),
	path('view/transcript/js/', dviews.timelineTest, name='timelineTest'),
	path('studentCreateSession/', views.studentCreateSession, name='studentCreateSession'),
	path('removeInactiveUser/', views.removeInactiveUser, name='removeInactiveUser'),
	path('checkUserExistence/', views.checkUserExistence, name='checkUserExistence'),
	path('getSessionData/', views.getSessionData, name='getSessionData'),
	path('updateSessionData/', views.updateSessionData, name='updateSessionData'),
	#path('test/', dviews.timelineTest, name='timelineTest'),

]
