from django.shortcuts import render
from django.http import HttpResponse, HttpResponseNotFound, HttpRequest, JsonResponse
from django.contrib.auth.decorators import user_passes_test
from django.views.decorators.csrf import csrf_exempt

from courses.models import Course
from degrees.models import Degree
import re 										#for spliting string and number in courseSearchText
import copy 
import json
import ast
# Create your views here.

# not need for code in this function, it just directs admin to home page after login
@user_passes_test(lambda u: u.is_superuser, login_url='/users/login/')
def administrationHomeView(request):
	return render(request, 'administration/base.html', {})

#@csrf_exempt
def studentCreateSession(request):
	#degreeSearchText = request.POST.get('degreeSearchText', '')
	#degreeSearchText = degreeSearchText.replace(' ','')
	#print (degreeSearchText)
	content={}
	for d in Degree.objects.filter(name__istartswith=str(degreeSearchText)):
		content["sessionId"]          = str(d.name) #can be named anything on table for backend
		content["sessionPin"]		  = str(d.catalogYear) #sanatize to only allow numbers #can be named anything on table for backend
		content["sessionDegree"] 	  = str(d.CollegeName) #can be named anything on table for backend
		content["sessionInfo"]  	  = str(json.dumps(d.degreeInfo)) #can be named anything on table for backend
		break

	return JsonResponse(content)
