from django.shortcuts import render
from django.http import HttpResponse, HttpResponseNotFound, HttpRequest, JsonResponse
from django.contrib.auth.decorators import user_passes_test
from django.views.decorators.csrf import csrf_exempt

from session.models import Session
from courses.models import Course
from degrees.models import Degree
import re 										#for spliting string and number in courseSearchText
import copy 
import json
import ast
# Create your views here.

# not need for code in this function, it just directs admin to home page after login
# @user_passes_test(lambda u: u.is_superuser, login_url='/users/login/')
def sessionHomeView(request):
	return render(request, 'session/base.html', {})

@csrf_exempt
def studentCreateSession(request):
	sessionid= request.POST.get('sessionid', '')
	pin = request.POST.get('pin', '')
	degree = request.POST.get('degree', '')
	completed = request.POST.get('completed', '')
	# degreeSearchText = degreeSearchText.replace(' ','')
	#print (degreeSearchText)
	# content={}
	print('completed: ', completed)
	Session.objects.create(
		sessionID = str(sessionid),
		sessionPIN = pin,
		degreeName = str(degree),
		completedCourses =  json.loads(completed),
		)
	jsResponse = {
		'success': 'True',
		'message': 'Successfully added ' + str(sessionid) + ' ' + pin + ' to session DB!'
	}
	return JsonResponse(jsResponse)
