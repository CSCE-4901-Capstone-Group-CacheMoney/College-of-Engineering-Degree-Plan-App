from django.shortcuts import render
from django.http import HttpResponse, HttpResponseNotFound, HttpRequest, JsonResponse
from django.contrib.auth.decorators import user_passes_test
from django.views.decorators.csrf import csrf_exempt
from datetime import date, timedelta

from session.models import Session
from courses.models import Course
from degrees.models import Degree
import datetime

import re 										#for spliting string and number in courseSearchText
import copy 
import json
import ast
# Create your views here.

# not need for code in this function, it just directs admin to home page after login
# @user_passes_test(lambda u: u.is_superuser, login_url='/users/login/')
def sessionHomeView(request):
	return render(request, 'student/session.html', {})

#basic view for a user to edit their session variables
def sessionEditView(request):
	return render(request, 'student/edit-session.html', {})

#basic view for a user to login to session
def sessionLoginView(request):
	return render(request, 'student/login-session.html', {})

def sessionViewDegreePlan(request):
	return render(request, 'student/view-degree-plan-session.html', {})

def sessionViewTranscript(request):
	return render(request, 'student/view-transcript-session.html', {})

@csrf_exempt
def studentCreateSession(request):
	sessionid	= request.POST.get('sessionID', '')
	pin 		= request.POST.get('sessionPIN', '')
	# degree 		= request.POST.get('sessionDegree', '')
	# degreeYear	= request.POST.get('sessionDegreeYear', '')
	sessionDegreeID = request.POST.get('sessionDegreeID', '')
	completed 	= json.loads(request.POST.get('sessionInfo', ''))
	semesterOption = request.POST.get('semesterOption', '')
	semesterHours = request.POST.get('semesterHours', '')
	# degreeSearchText = degreeSearchText.replace(' ','')
	print ('Received:', sessionid, pin, sessionDegreeID)
	# content={}
	print('completed: ', completed)
	Session.objects.create(
		sessionID  = str(sessionid),
		sessionPIN = str(pin),
		degreeID   = int(sessionDegreeID),
		completedCourses =  completed,
	    semesterOption = str(semesterOption),
		semesterHours = int(semesterHours),
		)
	jsResponse = {
		'success': 'True',
		'message': 'Successfully added ' + str(sessionid) + ' ' + pin + ' to session DB!'
	}
	return JsonResponse(jsResponse)

# Remove any user that has been inactive for a year
@csrf_exempt
def removeInactiveUser(request):
	startdate = date.today()
	enddate = startdate - timedelta(days=365)

	# print(Session.objects.filter(last_visit__lt= enddate))
	status = Session.objects.filter(last_visit__lt= enddate).delete()	
	
	if status[0] == 1:											#if successful
		jsResponse = {
			'success': 'True',
			'message': 'Successfully updated session by removing inactive users within a year. ' 
		}
	else:
		jsResponse = { 	
			'success': 'False',
			'message': 'Unable to updated session by removing inactive users within a year. ' 
		}
			
	return JsonResponse(jsResponse)

# checkUserExistence takes in sessionid and pin, then look in session table if that combination exists.
@csrf_exempt
def checkUserExistence(request):
	sessionid	= request.POST.get('sessionid', '')
	pin 		= request.POST.get('pin', '')
	print('sessionid: ',sessionid, ' and pin: ', pin)
	print(Session.objects.filter(sessionID= str(sessionid), sessionPIN = str(pin)))
	status = Session.objects.filter(sessionID= str(sessionid), sessionPIN = str(pin)).count()
	
	if status != 0:		#if successful
		s = Session.objects.get(sessionID= str(sessionid), sessionPIN = str(pin))
		s.save()
		jsResponse = {
			'success': 'True',
			'message': 'The combination of sessionID ' + str(sessionid) + ' and pin '+ pin +' exists!' 
		}
	else:
		jsResponse = { 	
			'success': 'False',
				'message': 'The combination of sessionID ' + str(sessionid) + ' and pin '+ pin + " doesn't exist!"
		}
			
	return JsonResponse(jsResponse)

@csrf_exempt
def getSessionData(request):
	sessionid	= request.POST.get('sessionid', '')
	pin 		= request.POST.get('pin', '')
	print('Received sessionid: ',sessionid, ' and pin: ', pin)
	print(Session.objects.filter(sessionID= str(sessionid), sessionPIN = str(pin)))
	content = {} 
	
	for data in Session.objects.filter(sessionID = str(sessionid), sessionPIN = str(pin)):
		content = {
			# "degreeName"	: str(data.degreeName),
			# "degreeYear"	: data.degreeYear,
			"degreeID"		: data.degreeID,
			"semesterOption": str(data.semesterOption),
			"semesterHours": int(data.semesterHours)
		}	

		courseList = json.dumps(data.completedCourses)
	print("CourseList length is:", len(courseList))
	if len(courseList) != 0:
		courseList_dict = json.loads(courseList)
	category = courseList_dict['Categories']
	print('\ncourseList_dict:', courseList_dict)
	print("item inside courses:")
	
	courseItem = []
	for item in range(len(category.get('courses'))):
		singleClassItem = {}

		c = Course.objects.get(id = category.get('courses')[item])
		singleClassItem['id'] = str(c.id)
		singleClassItem['courseID'] = str(c.courseID)
		singleClassItem['courseDept'] = str(c.courseDept)
		print(category.get('courses')[item])
	
		courseItem.append(singleClassItem)
	
	courses = {}
	# courses["courses"] = courseItem
	courses.update({"courses" : courseItem})

	content.update({"Categories" : courses})
	return JsonResponse(content)

# updateSessionData updates sessionPIN and degreeNameif changed and update completedCourses along with new date stamp in last_visit
@csrf_exempt
def updateSessionData(request):
	sessionid	= request.POST.get('sessionid', '')
	pin 		= request.POST.get('pin', '')
	semesterOption = request.POST.get('semesterOption', '')
	sessionInfo = json.loads(request.POST.get('sessionInfo', ''))
	semesterHours = request.POST.get('semesterHours', '')

	print('Received sessionid: ',sessionid, ' and pin: ', pin, '\nsessionInfo:', sessionInfo)
	print(Session.objects.filter(sessionID= str(sessionid), sessionPIN = str(pin)))

	#check User Existence
	s = Session.objects.filter(sessionID= str(sessionid), sessionPIN = str(pin))
	s.update(semesterOption = str(semesterOption)) #add this to sessionInfo as cookie?
	s.update(semesterHours = str(semesterHours))
	status = s.count()
	if status == 0:
		jsResponse = { 	
			'success': 'False',
			'message': 'The combination of sessionID ' + str(sessionid) + ' and pin '+ pin + " doesn't exist!"
		}	
		return JsonResponse(jsResponse)

	newPin = sessionInfo['sessionPIN']
	# degree = sessionInfo['degreeName']
	# degreeYear = sessionInfo['degreeYear']
	degreeID = sessionInfo['degreeID']
	courseList = sessionInfo['completedCourses']
	
	print('newPin:', newPin)
	print("item inside courses: ", courseList)
	s = Session.objects.get(sessionID= str(sessionid), sessionPIN = str(pin))
	updatePin = 0
	updateDegreeName = 0
	updateSemester = 0
	#Change pin if new pin doesn't match
	if int(pin) != newPin:
		s.sessionPIN = str(newPin) 						#update( sessionPIN = newPin )
		updatePin = 1
		# print('pin: ', pin, ' vs. newPin:', newPin)

	#change degree if it doesn't match w the DB
	if degreeID != s.degreeID: 						#s.values_list('degreeName', flat = True).get():
		s.degreeID = degreeID
		# s.degreeName = degree
		updateDegreeName = 1
		
	# print('status pin:', updatePin, 'degree:', updateDegreeName)
	s.completedCourses = courseList
	s.save()
	message = ""
	if updatePin == 1:
		message += " Updated Pin,"
	if updateDegreeName == 1:
		message += " Updated degreeName,"
	message += " Updated sessionInfo"
	jsResponse = { 	
			'success': 'True',
			'message': 'Sucessfully:'+ message
		}
	return JsonResponse(jsResponse)
# {
#    "sessionPIN":1234,
#    "degreeName":"Data Science -2019",
#    "completedCourses":{
#       "Categories":{
#          "courses":[
#             12,
#             22,
#             32,
#             1
#          ]
#       }
#    }
# }


# {
#    "sessionPIN": 1234,
#    "degreeName": "Data Science -2019",
#	 "completedCourses": "{"Categories": {"courses": [12, 22, 32, 1]}}"
# 		
#    
# }