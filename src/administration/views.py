from django.shortcuts import render
from django.http import HttpResponse, HttpResponseNotFound, HttpRequest, JsonResponse
from django.contrib.auth.decorators import user_passes_test
from django.views.decorators.csrf import csrf_exempt

from courses.models import Course
from degrees.models import Degree
from session.models import Session

import re 										#for spliting string and number in courseSearchText
import copy 
import json
import ast
# Create your views here.

# not need for code in this function, it just directs admin to home page after login
@user_passes_test(lambda u: u.is_superuser, login_url='/users/login/')
def administrationHomeView(request):
	return render(request, 'administration/base.html', {})


# TODO back-end code for degree plans
def administrationViewDegree(request):
	content = {} # when ready to send to front-end add db values to this dictionary
	return render(request, 'administration/degree-plans/view-degree.html', content)

def administrationEditDegree(request):
	content = {} # when ready to send to front-end add db values to this dictionary
	return render(request, 'administration/degree-plans/edit-degree.html', content)

def administrationAddDegree(request):
	content = {} # when ready to send to front-end add db values to this dictionary
	return render(request, 'administration/degree-plans/add-degree.html', content)

def administrationRemoveDegree(request):
	content = {} # when ready to send to front-end add db values to this dictionary
	return render(request, 'administration/degree-plans/remove-degree.html', content)

# TODO back-end code for js requests to degree plans
@csrf_exempt
def administrationViewDegreeJS(request):
	degreeSearchText = request.POST.get('degreeSearchText', '')
	print (degreeSearchText)
	content={}
	for d in Degree.objects.filter(id__istartswith=str(degreeSearchText)):
		content["nDegreeName"]        = str(d.name)
		content["ndegreeInfo"]  	  = str(json.dumps(d.degreeInfo))
		content["ncatalogYear"]		  = str(d.catalogYear)
		content["nCollegeName"] 	  = str(d.CollegeName)
		content["nspecialty"]         = str(d.specialty)
		break

	return JsonResponse(content)

## Function that gives DegreeName, CatalogYear, and pkid of matching degrees  for Auto Search front-end
@csrf_exempt
def autoSearchDegreeJS(request):
	degreeSearchText = request.POST.get('degreeSearchText', '')
	print (degreeSearchText)
	content=[{}]
	for d in Degree.objects.filter(name__istartswith=str(degreeSearchText)):
		result = {
			"DegreeName"	: str(d.name),
			"CatalogYear"	: str(d.catalogYear),
			"ID"			: str(d.id),
			"CollegeName"	: str(d.CollegeName),
			"Specialty"		: str(d.specialty),
		}
		content.append(result) 

	return JsonResponse(content, safe=False)

@csrf_exempt
def administrationViewDegreeDetailedJS(request):
	degreeSearchText = request.POST.get('degreeSearchText', '')
	print (degreeSearchText)
	content={}
	courseList=""
	for d in Degree.objects.filter(id__istartswith=degreeSearchText):
		content["nDegreeName"]        = str(d.name)
		courseList				  	  = json.dumps(d.degreeInfo)
		content["ncatalogYear"]		  = str(d.catalogYear)
		content["nCollegeName"] 	  = str(d.CollegeName)
		content["nspecialty"]         = str(d.specialty)
		
		break

	courseList_dict = json.loads(courseList)

	jsonString={}
	jsonValue=[]

	for category in courseList_dict['Categories']:
		catItem = {}
		catItem['name'] = category.get('name')

		courseItem = []
		for item in range(len(category.get('courses'))):
			singleClassItem = {}

			c = Course.objects.get(id = category.get('courses')[item])
			singleClassItem['id'] = str(c.id)
			singleClassItem['courseID'] = str(c.courseID)
			singleClassItem['courseDept'] = str(c.courseDept)
			singleClassItem['name'] = str(c.name)
			singleClassItem['preCoreq'] = str(c.preCoReq)
			singleClassItem['category'] = str(c.category)
			singleClassItem['hours'] = str(c.hours)
			singleClassItem['semester'] = str(c.semester)
			singleClassItem['description'] = str(c.description)

			courseItem.append(singleClassItem)

		catItem['courses'] = courseItem
		catItem['coursesRequired'] = category.get('coursesRequired')

		jsonValue.append(catItem)
	
	jsonString['Categories'] = jsonValue

	print(json.dumps(jsonString, indent=2))
	content['ndegreeInfo'] = str(json.dumps(jsonString))
	return JsonResponse(content)

# TODO back-end code for courses
def administrationViewCourse(request):
	content = {}	# when ready to send to front-end add db values to this dictionary
	return render(request, 'administration/courses/view-course.html', content)

def administrationEditCourse(request):
	content = {} # when ready to send to front-end add db values to this dictionary
	return render(request, 'administration/courses/edit-course.html', content)

def administrationAddCourse(request):
	content = {} # when ready to send to front-end add db values to this dictionary
	return render(request, 'administration/courses/add-course.html', content)

def administrationRemoveCourse(request):
	content = {} # when ready to send to front-end add db values to this dictionary
	return render(request, 'administration/courses/remove-course.html', content)

# TODO back-end code for js requests to courses
@csrf_exempt
def administrationViewCourseJS(request):
	courseSearchText = request.POST.get('courseSearchText', '')
	courseSearchText = courseSearchText.replace(' ','')
	print (courseSearchText)
	content={}
	contains_digit = any(map(str.isdigit,courseSearchText))	#check if the search string contains digit
	
	if contains_digit:
		temp = re.compile("([a-zA-Z]+)([0-9]+)") 			#splitting courseDept and courseID
		res = temp.match(courseSearchText).groups() 
		for c in Course.objects.filter(courseDept__istartswith=str(res[0]), courseID__startswith=res[1]):
			content["CourseDept"] =	str(c.courseDept)
			content["CourseID"] = str(c.courseID)
			content["CourseName"] = str(c.name)
			content["Description"] = str(c.description)
			content["Category"] = str(c.category)
			content["Hours"] = str(c.hours)
			content["CourseAvailability"] = str(c.semester)
			content["PreCoreq"] = str(json.dumps(c.preCoReq))
			content["ID"] = str(c.id)
			break

	else:
		if len(str(courseSearchText)) > 4:		#search course names
			for c in Course.objects.filter(name__istartswith=str(courseSearchText)):
				content["CourseDept"] =	str(c.courseDept)
				content["CourseID"] = str(c.courseID)
				content["CourseName"] = str(c.name)
				content["Description"] = str(c.description)
				content["Category"] = str(c.category)
				content["Hours"] = str(c.hours)
				content["CourseAvailability"] = str(c.semester)
				content["PreCoreq"] = str(json.dumps(c.preCoReq))
				content["ID"] = str(c.id)
				break

		else:
			for c in Course.objects.filter(courseDept__istartswith=str(courseSearchText)):		#search course dept
				content["CourseDept"] =	str(c.courseDept)
				content["CourseID"] = str(c.courseID)		
				content["CourseName"] = str(c.name)
				content["Description"] = str(c.description)
				content["Category"] = str(c.category)
				content["Hours"] = str(c.hours)
				content["CourseAvailability"] = str(c.semester)
				content["PreCoreq"] = str(json.dumps(c.preCoReq))
				content["ID"] = str(c.id)
				break

	return JsonResponse(content)

@csrf_exempt
## Function that gives CourseDept, CourseID, and pkid of matching courses for Auto Search front-end
def autoSearchCourseJS(request):
	courseSearchText = request.POST.get('courseSearchText', '')
	courseSearchText = courseSearchText.replace(' ','')
	print (courseSearchText)
	content=[{}]
	contains_digit = any(map(str.isdigit,courseSearchText))	#check if the search string contains digit

	if courseSearchText.isdigit() is True:					# search for courseID
		print('autoSearchCourse courseSearchText: ', courseSearchText)
		for c in Course.objects.filter(courseID__startswith = courseSearchText):
			result = {
				"CourseDept": str(c.courseDept),
				"CourseID"	: str(c.courseID),
				"CourseName": str(c.name),
				"ID"		: str(c.id),
			}
			content.append(result) 
		return JsonResponse(content, safe=False)

	if contains_digit:
		temp = re.compile("([a-zA-Z]+)([0-9]+)") 			#splitting courseDept and courseID
		res = temp.match(courseSearchText).groups() 
		for c in Course.objects.filter(courseDept__istartswith=str(res[0]), courseID__startswith=res[1]):
			result = {
				"CourseDept": str(c.courseDept),
				"CourseID"	: str(c.courseID),
				"CourseName": str(c.name),
				"ID"		: str(c.id),
			}
			content.append(result) 
	else:
		if len(str(courseSearchText)) > 4:		#search course names
			for c in Course.objects.filter(name__istartswith=str(courseSearchText)):
				result = {
					"CourseDept": str(c.courseDept),
					"CourseID"	: str(c.courseID),
					"CourseName": str(c.name),
					"ID"		: str(c.id),
				}
				content.append(result) 

		else:
			for c in Course.objects.filter(courseDept__istartswith=str(courseSearchText)):		#search course dept
				result = {
					"CourseDept": str(c.courseDept),
					"CourseID"	: str(c.courseID),
					"CourseName": str(c.name),
					"ID"		: str(c.id),
				}
				content.append(result) 

	return JsonResponse(content, safe=False)


@csrf_exempt
def administrationViewCourseDetailedJS(request):

	courseSearchText = request.POST.get('courseSearchText', '')
	courseSearchText = courseSearchText.replace(' ','')
	print (courseSearchText)
	content={}
	preCoreq = ""
	contains_digit = any(map(str.isdigit,courseSearchText))	#check if the search string contains digit
	
	if contains_digit:
		temp = re.compile("([a-zA-Z]+)([0-9]+)") 			#splitting courseDept and courseID
		res = temp.match(courseSearchText).groups()
		for c in Course.objects.filter(courseDept__istartswith=str(res[0]), courseID__startswith=res[1]):
			content["CourseDept"] =	str(c.courseDept)
			content["CourseID"] = str(c.courseID)
			content["CourseName"] = str(c.name)
			content["Description"] = str(c.description)
			content["Category"] = str(c.category)
			content["Hours"] = str(c.hours)
			content["CourseAvailability"] = str(c.semester)
			preCoreq = json.dumps(c.preCoReq)
			content["ID"] = str(c.id)
			break

	else:
		if len(str(courseSearchText)) > 4:		#search course names
			for c in Course.objects.filter(name__istartswith=str(courseSearchText)):
				content["CourseDept"] =	str(c.courseDept)
				content["CourseID"] = str(c.courseID)
				content["CourseName"] = str(c.name)
				content["Description"] = str(c.description)
				content["Category"] = str(c.category)
				content["Hours"] = str(c.hours)
				content["CourseAvailability"] = str(c.semester)
				preCoreq = json.dumps(c.preCoReq)
				content["ID"] = str(c.id)
				break

		else:
			for c in Course.objects.filter(courseDept__istartswith=str(courseSearchText)):		#search course dept
				content["CourseDept"] =	str(c.courseDept)
				content["CourseID"] = str(c.courseID)		
				content["CourseName"] = str(c.name)
				content["Description"] = str(c.description)
				content["Category"] = str(c.category)
				content["Hours"] = str(c.hours)
				content["CourseAvailability"] = str(c.semester)
				preCoreq = json.dumps(c.preCoReq)
				content["ID"] = str(c.id)
				break

	#if course wasn't found in the database, retrn empty json
	if preCoreq == "":
		return JsonResponse(content)

	preCoreq_dict = json.loads(preCoreq)

	jsonString={}
	jsonValue=[]

	for category in preCoreq_dict['Categories']:
		catItem = {}
		catItem['College'] = category.get('College')
		catItem['DegreeName'] = category.get('DegreeName')
		catItem['DegreeYear'] = category.get('DegreeYear')
		catItem['Specialty'] = category.get('Specialty')

		preReqItem = []
		for item in range(len(category.get('PreReqs'))):
			singleClassItem = {}

			c = Course.objects.get(id = category.get('PreReqs')[item])
			singleClassItem['id'] = str(c.id)
			singleClassItem['courseID'] = str(c.courseID)
			singleClassItem['courseDept'] = str(c.courseDept)
			singleClassItem['name'] = str(c.name)
			singleClassItem['preCoreq'] = str(c.preCoReq)
			singleClassItem['category'] = str(c.category)
			singleClassItem['hours'] = str(c.hours)
			singleClassItem['semester'] = str(c.semester)
			singleClassItem['description'] = str(c.description)

			preReqItem.append(singleClassItem)

		catItem['PreReqs'] = preReqItem

		coReqItem = []
		for item in range(len(category.get('CoReqs'))):
			singleClassItem = {}

			c = Course.objects.get(id = category.get('CoReqs')[item])
			singleClassItem['id'] = str(c.id)
			singleClassItem['courseID'] = str(c.courseID)
			singleClassItem['courseDept'] = str(c.courseDept)
			singleClassItem['name'] = str(c.name)
			singleClassItem['preCoreq'] = str(c.preCoReq)
			singleClassItem['category'] = str(c.category)
			singleClassItem['hours'] = str(c.hours)
			singleClassItem['semester'] = str(c.semester)
			singleClassItem['description'] = str(c.description)

			coReqItem.append(singleClassItem)

		catItem['CoReqs'] = coReqItem

		jsonValue.append(catItem)
	
	jsonString['Categories'] = jsonValue

	print(json.dumps(jsonString, indent=2))
	content['PreCoreq'] = str(json.dumps(jsonString))

	return JsonResponse(content)

@csrf_exempt
def administrationEditCourseJS(request):

	nCourseName = request.POST.get('CourseName', '')
	nCourseDept = request.POST.get('DepartmentID', '')
	nCourseID = request.POST.get('CourseNumber', '')
	nCoursePreCoreqInfo = json.loads(request.POST.get('nCoursePreCoreqInfo', ''))
	nCourseHours = request.POST.get('CourseHours', '')
	nCourseAvail = request.POST.get('CourseAvailability', '')
	nID = request.POST.get('CourseID', '')

	print (nID)

	c = Course.objects.filter(id=nID)

	c.update(
		name = str(nCourseName),
		courseDept = str(nCourseDept).upper(),
		courseID = nCourseID,
		preCoReq = nCoursePreCoreqInfo,
		hours = nCourseHours,
		semester = str(nCourseAvail)	
		)

	print(c)
	
	jsResponse = {
		'success': 'True',
		'message': 'Successfully added ' + str(nCourseDept).upper() + ' ' + str(nCourseID) + ' to course list!'
	}

	return JsonResponse(jsResponse)

@csrf_exempt
def administrationAddCourseJS(request):	
	nCourseName = request.POST.get('nCourseName', '')
	nCourseDept = request.POST.get('nCourseDept', '')
	nCourseID = request.POST.get('nCourseID', '')
	nCoursePreCoreqInfo = json.loads(request.POST.get('nCoursePreCoreqInfo', ''))
	nCourseHours = request.POST.get('nCourseHours', '')
	nCourseAvail = request.POST.get('nCourseAvail', '')
	print (nCourseAvail)

	if len(str(nCourseDept)) != 4 or len(str(nCourseID)) != 4:
		jsResponse = {
			'success': 'False',
			'message': 'Error adding course. Course Department and Number must be 4 characters!'
		}
	
	elif int(nCourseID) < 1000:
		jsResponse = {
			'success': 'False',
			'message': 'Error adding course. Course number must be at least 1000!'
		}

	elif len(str(nCourseHours)) == 0:
		jsResponse = {
			'success': 'False',
			'message': 'Error adding course. You must specify the credit hours!'
		}

	else:
		c = Course.objects.filter(courseDept__istartswith=str(nCourseDept).upper(), courseID__startswith=nCourseID)
		#print(c)			
		if not c:
			print ('W/o if stmts: ',nCourseAvail)
			Course.objects.create(
			name = str(nCourseName),
			courseDept = str(nCourseDept).upper(),
			courseID = nCourseID,
			preCoReq = nCoursePreCoreqInfo,
			hours = nCourseHours,
			semester = str(nCourseAvail)	
			)
			jsResponse = {
				'success': 'True',
				'message': 'Successfully added ' + str(nCourseDept).upper() + ' ' + str(nCourseID) + ' to course list!'
			}

		else:
			jsResponse = {
				'success': 'False',
				'message': 'Error adding course. ' + str(nCourseDept).upper() + ' ' + str(nCourseID) + ' already exists!'
			}

	return JsonResponse(jsResponse)

def pkLookUpJS(request):
	pk = request.POST.get('pk', '')
	content={}
	c = Degree.objects.get(id = pk)
	content["CourseDept"] 	= str(c.courseDept)
	content["CourseID"] 	= str(c.courseID) 
	content["CourseName"] 	= str(c.name)
	content["Description"] 	= str(c.description)
	content["Category"] 	= str(c.category)
	content["Hours"] 		= str(c.hours)
	content["CourseAvailability"] = str(c.semester)
	content["PreCoreq"] 	= str(c.preCoReq)
	
	return JsonResponse(content)

@csrf_exempt	
def administrationAddDegreeJS(request):
	nDegreeName = request.POST.get('nDegreeName', '')
	ncatalogYear = request.POST.get('ncatalogYear', '')
	ndegreeInfo = request.POST.get('ndegreeInfo','')
	nCollegeName = request.POST.get('nCollegeName','')
	nspecialty = request.POST.get('nspecialty','')
	if nspecialty=='':
		nspecialty='None'

	value = Degree.objects.filter(name__istartswith=str(nDegreeName), catalogYear__startswith=ncatalogYear, CollegeName__istartswith=str(nCollegeName), specialty__istartswith=str(nspecialty))
	#print(c)			
	if not value:
		Degree.objects.create(
		name = str(nDegreeName),
		catalogYear = str(ncatalogYear),
		degreeInfo = json.loads(ndegreeInfo),
		CollegeName = str(nCollegeName),
		specialty = str(nspecialty)
		)
		jsResponse = {
			'success': 'True',
			'message': 'Successfully added ' + str(nDegreeName) + ' to degree plan ' + str(ncatalogYear) + ' !'
		}
	else:
		jsResponse = {
			'success': 'False',
			'message': 'Error adding degree plan. ' + str(nDegreeName) + ' already exists!'
		}
	return JsonResponse(jsResponse)


@csrf_exempt
def administrationRemoveCourseJS(request):
	courseSearchText = request.POST.get('courseSearchText', '')		#get message from front end
	courseSearchText = courseSearchText.replace(' ','')				#trim spaces
	temp = re.compile("([a-zA-Z]+)([0-9]+)") 						#splitting courseDept and courseID
	res = temp.match(courseSearchText).groups()

	if(len(res[0]) == 4 and len(res[1]) == 4):						#check if dept and id are 4 chars

		#Get PID
		courseObject = Course.objects.get(courseDept__istartswith=str(res[0]), courseID__startswith=res[1])
		CoursePID = courseObject.id
		print(CoursePID)

		status = courseObject.delete()

		if status[0] == 1:	
			jsResponse = {
				'success': 'True',
				'message': 'Successful removing course '+  str(res[0]) + '!'
			}

			#remove from degree
			for d in Degree.objects.all():
				ndegreeInfo = d.degreeInfo
				#Adding courses in Degree Plan to list
				for currentCat in ndegreeInfo["Categories"]:
					found = 0
					if CoursePID in currentCat["courses"]:
						currentCat["courses"].remove(CoursePID)
						found = 1

					if found == 1:
						nDegreeID = d.id

						Degree.objects.filter(id=nDegreeID).update(degreeInfo=ndegreeInfo)
						print("Removed from a degree")

			#remove from prereqs and coreqs of other courses
			for c in Course.objects.all():
				deps = json.loads(str(json.dumps(c.preCoReq)))
				toggle = 0
				for currDeg in deps["Categories"]:
					if CoursePID in currDeg["PreReqs"]:
						currDeg["PreReqs"].remove(CoursePID)
						print("Found as PreReqs")
						toggle = 1
					if CoursePID in currDeg["CoReqs"]:
						currDeg["CoReqs"].remove(CoursePID)
						print("Found as CoReq")
						toggle = 1
				if toggle == 1:
					courseID = c.id
					Course.objects.filter(id=courseID).update(preCoReq=deps)
					print("Removed as Pre/Co Req of a course")

			#remove course from sessions
			for sessionObject in Session.objects.all():
				completed = sessionObject.completedCourses
				if CoursePID in completed["Categories"]["courses"]:
					completed["Categories"]["courses"].remove(CoursePID)
					nSessionID = sessionObject.id
					Session.objects.filter(id=nSessionID).update(completedCourses=completed)
					print("Removed from a degree")					
		else: 	
			jsResponse = {
				'success': 'False',
				'message': 'Error removing course '+  str(res[0]) + '!'
			}
		
	else:
		jsResponse = {
			'success': 'False',
			'message': 'Error removing course, format as "MATH 1710"'
		}
		
	return JsonResponse(jsResponse)

@csrf_exempt	
def administrationRemoveDegreeJS(request):
	degreeSearchText = request.POST.get('degreeSearchText', '')		#get message from front end
	degreeSearchText = degreeSearchText.replace(' ','')				#trim spaces
	
	nDegreeName = request.POST.get('nDegreeName', '')
	ncatalogYear = request.POST.get('ncatalogYear', '')
	# ndegreeInfo = request.POST.get('ndegreeInfo','')
	nCollegeName = request.POST.get('nCollegeName','')
	nspecialty = request.POST.get('nspecialty','')
	if nspecialty=='':
		nspecialty='None'

	value = Degree.objects.filter(name__istartswith=str(nDegreeName), catalogYear__startswith=ncatalogYear, CollegeName__istartswith=str(nCollegeName), specialty__istartswith=str(nspecialty)).delete()

	#print(c)			
	if (value[0]==1):
		jsResponse = {
			'success': 'True',
			'message': 'Successfully deleted ' + str(nDegreeName) + ' for degree plan ' + str(ncatalogYear) + ' !'
		}
	else:
		jsResponse = {
			'success': 'False',
			'message': 'Error removing degree plan ' + str(value[0]) + ' !'
		}
	return JsonResponse(jsResponse)

@csrf_exempt	
def administrationEditDegreeJS(request):
	nDegreeName = request.POST.get('nDegreeName', '')
	ncatalogYear = request.POST.get('ncatalogYear', '')
	ndegreeInfo = request.POST.get('ndegreeInfo','')
	nCollegeName = request.POST.get('nCollegeName','')
	nspecialty = request.POST.get('nspecialty','')
	if nspecialty=='':
		nspecialty='None'

	NbrOfRow = Degree.objects.filter(name=str(nDegreeName), catalogYear__startswith=ncatalogYear, CollegeName__istartswith=str(nCollegeName), specialty__istartswith=str(nspecialty)).update(degreeInfo=json.loads(ndegreeInfo))
	if NbrOfRow==1:
		jsResponse = {
			'success': 'True',
			'message': 'Successfully updated ' + str(nDegreeName) + '  degree plan for  year ' + str(ncatalogYear) + ' !'
		}
	else:
		jsResponse = {
			'success': 'False',
			'message': 'Error unable to update ' + str(nDegreeName) + ' degree plan for year ' + str(ncatalogYear) +' !'
		}
	return JsonResponse(jsResponse)

@csrf_exempt
def scheduler(request):
	sessionid = request.POST.get('sessionID', '')
	print("Sessionid: " + str(sessionid))

	if sessionid == "DegreePlanTester":
		tempCoursesTaken = []
		semesterOption = "Fall"
		degreeInfo = request.POST.get('degreeInfo', '')
		degreeYear = request.POST.get('degreeYear', '')
		degreeName = request.POST.get('degreeName', '')
		degreeYear = request.POST.get('degreeInfo', '')
		maxHours = 15

	else:
		sessionObject = Session.objects.get(sessionID = str(sessionid))
		tempCoursesTaken = sessionObject.completedCourses
		degreeID = sessionObject.degreeID
		semesterOption = sessionObject.semesterOption
		maxHours = sessionObject.semesterHours

		degreeObject = Degree.objects.get(id = degreeID)
		degreeInfo = degreeObject.degreeInfo
		degreeYear = degreeObject.catalogYear
		degreeName = degreeObject.name
		collegeName = degreeObject.CollegeName
		specialty = degreeObject.specialty
		
	print("Degree: " + str(degreeName) + " - " + str(degreeID))

	content={}

	coursesTaken = []
	classDeps = {}
	masterDeps = {}
	coReqList = {}
	optionalCourses = []
	labs = {}

	#Add a course and recursively add its prereqs
	def addClassAndPreReqs(courseDict, currentClass):
		if currentClass not in coursesTaken and currentClass not in courseDict:
			#print("Processing " + str(currentClass))
			courseDict.setdefault(currentClass, [])
			courseObject = Course.objects.get(id=currentClass)
			deps = json.loads(str(json.dumps(courseObject.preCoReq)))

			for currDeg in deps["Categories"]:
				if str(currDeg["DegreeName"])!=str("") and str(currDeg["DegreeName"])!=str(degreeName) and str(currDeg["DegreeYear"])!=str(degreeYear):
					continue
				for preReq in currDeg["PreReqs"]:
					if preReq not in coursesTaken:
						#print("Prereq of " + str(preReq) + " for " + str(currentClass) + " added")
						courseDict.setdefault(currentClass, []).append(preReq)
						addClassAndPreReqs(courseDict, preReq)
					#else:
						#print("PreReq of " + str(preReq) + " not needed")
				for coReq in currDeg["CoReqs"]:
					if coReq not in coursesTaken:
						#print("Coreq of " + str(coReq) + " for " + str(currentClass) + " added")
						courseDict.setdefault(currentClass, []).append(coReq)
						coReqList.setdefault(currentClass, []).append(coReq)
						addClassAndPreReqs(courseDict, coReq)

	#Fund the chain of prereqs under it and return the number of classes that need to be taken before this
	def findDepth(courseDict, currentClass):
		total = 0
		for preReq in courseDict[currentClass]:
			try:
				temp = findDepth(courseDict, preReq)
				if temp < 0:
					return -1
				total = max(findDepth(courseDict, preReq), total)
			except RecursionError as re:
				return -1
		return total + 1
	
	#find the critical path and return the first class in the path
	def findCriticalStart(courseDict, target):
		tempDict = {}
		depthChart = {}
		targetClass = list(courseDict)[0]
		targetDepth = findDepth(courseDict, targetClass)

		if targetDepth < 0:
			return -targetClass

		for key in courseDict:
			depthChart.setdefault(key, findDepth(courseDict, key))
			if depthChart[key] < 0:
				return -key
		
			if target == 1:
				if depthChart[key] > targetDepth:
					targetDepth = depthChart[key]
					targetClass = key
			else:
				if depthChart[key] < targetDepth:
					targetDepth = depthChart[key]
					targetClass = key

		if targetDepth == 1:
			return targetClass

		for key in classDeps[targetClass]:
			addClassAndPreReqs(tempDict, key)
		
		return findCriticalStart(tempDict, 1)

	#Adding courses already taken to list
	for currentCourse in tempCoursesTaken["Categories"]["courses"]:
		if currentCourse not in coursesTaken:
			tempDict = {}
			addClassAndPreReqs(tempDict, currentCourse)
			for key in tempDict.keys():
				coursesTaken.append(key)
	print("Taken courses: " + str(coursesTaken))

	#Adding courses in Degree Plan to list
	for currentCat in degreeInfo["Categories"]:
		desiredCourses = currentCat["coursesRequired"]
		print("Desired Courses -",desiredCourses)

		#Look for labs with their classes
		for currentCourse in currentCat["courses"]:
			if currentCourse not in coursesTaken:
				courseObject = Course.objects.get(id=currentCourse)
				deps = json.loads(str(json.dumps(courseObject.preCoReq)))
				for currDeg in deps["Categories"]:
					if str(currDeg["DegreeName"])!=str("") and str(currDeg["DegreeName"])!=str(degreeName) and str(currDeg["DegreeYear"])!=str(degreeYear):
						continue
					else:
						for coReq in currDeg["CoReqs"]:
							coReqObject = Course.objects.get(id=coReq)
							if coReq not in coursesTaken:
								if "lab" in str(coReqObject.name).lower() and coReqObject.hours < 3:
									labs.setdefault(currentCourse, coReq)
									#print("Adding lab dep", currentCourse, coReq)

		#If all classes needed
		if desiredCourses == 0:
			for currentCourse in currentCat["courses"]:
				addClassAndPreReqs(classDeps, currentCourse)

		#If specific number of classes needed
		else:
			counter = 0
			catList = []
			searchingDepth = 1

			#check if any classes have been taken before
			for currentCourse in currentCat["courses"]:
				optionalCourses.append(currentCourse)
				catList.append(currentCourse)
				if currentCourse in coursesTaken:
					counter += 1

			#If required courses is not valid
			if len(catList) < desiredCourses:
				print("Desired Courses exceeds amount of courses in that category")
				content["success"] = "False"
				content["message"] = "Desired Courses exceeds amount of courses in that category"
				return JsonResponse(content)

			#while classes still need to be added
			while counter < desiredCourses:
				for currentCourse in currentCat["courses"]:
					if counter == desiredCourses:
						break
					
					if currentCourse not in coursesTaken:
						courseObject = Course.objects.get(id=currentCourse)

						#if class is a lab, skip
						if currentCourse in labs.values():
							#print("Found lab - ",courseObject.name)
							continue

						tempDict = {}
						addClassAndPreReqs(tempDict, currentCourse)

						#if class has too great of a depth
						if int(findDepth(tempDict, currentCourse)) > int(searchingDepth):
							#print("skipping for depth",courseObject.name, findDepth(tempDict, currentCourse), searchingDepth)
							continue

						#if class is  tied to a lab
						if currentCourse in labs.keys():
							addClassAndPreReqs(classDeps, currentCourse)
							if labs[currentCourse] in catList:
								counter += 2
							else:
								counter +=1
							print("Added class and counter is now at",counter,desiredCourses)

						#class not tied to any lab
						else:
							addClassAndPreReqs(classDeps, currentCourse)
							counter += 1
							print("Added class and counter is now at",counter,desiredCourses)

				#increase maximum depth of class
				searchingDepth += 1

	masterDeps = copy.deepcopy(classDeps)
	selectedClasses = []
	semesterCount = 48
	hourCount = [0] * semesterCount

	plan = [([]) for semesterCount in range(semesterCount)]

	#while classes still need to be slotted
	while classDeps:
		selectedClass = findCriticalStart(classDeps, 1)

		#if recursive path found
		if selectedClass < 0:
			print("Recursive PreReqs or CoReqs found for class", -selectedClass)
			content["success"] = "False"
			content["message"] = "Recursive PreReq or CoReq found involving class",-selectedClass
			return JsonResponse(content)
		selectedClasses.append(selectedClass)

		del classDeps[selectedClass]
		coursesTaken.append(selectedClass)

		for value in classDeps.values():
			try:
				value.remove(selectedClass)
			except:
				pass
		
		#find the earliest semester class can be scheduled
		earliest = 0
		for preReq in masterDeps[selectedClass]:
			for i in range(len(plan)):
				if preReq in plan[i]:
					if (selectedClass not in coReqList) or (preReq not in coReqList[selectedClass]):
						earliest = max(earliest, i+1)
					else:
						earliest = max(earliest, i)
					break

		classAvailability = Course.objects.get(id=selectedClass).semester
		classHours = Course.objects.get(id=selectedClass).hours

		if selectedClass in labs.keys():
			classHours +=1
		if selectedClass in labs.values():
			continue

		#find open semester slot and insert class
		for i in range(earliest, len(plan)):
			if classAvailability != "Both":
				if str(semesterOption) == str(classAvailability):
					if i % 2 != 0:
						continue
				else:
					if i % 2 == 0:
						continue
			if hourCount[i] + classHours <= maxHours:
				hourCount[i]+=classHours
				plan[i].append(selectedClass)
				if selectedClass in labs.keys():
					plan[i].append(labs[selectedClass])

				break

		#if slotting not possible
		else:
			content["success"] = "False"
			content["message"] = "Hours per semester too low to successfully complete degree"

			print(json.dumps(content))
			return JsonResponse(content)

	print("All Classes Processed")
	for semester in plan:
		print(semester)
	end = semesterCount
	for row in reversed(range(len(plan))):
		if len(plan[row]) == 0:
			continue
		end = row+1
		break

	#return semester lists
	for row in range(end):
		content[row+1] = []
		for column in range(len(plan[row])):
			courseObject = Course.objects.get(id=plan[row][column])

			result = plan[row][column] in optionalCourses

			content[row+1].append({
				"id": plan[row][column],
				"CourseDept": courseObject.courseDept,
				"CourseID": courseObject.courseID,
				"Hours": courseObject.hours,
				"Name": courseObject.name,
				"Description": courseObject.description,
				"Optional": "True" if plan[row][column] in optionalCourses else "False"
			})

	content["numSemesters"] = len(content)
	content["success"] = "True"

	return JsonResponse(content)



# TODO back-end code for resources
def administrationViewResource(request):
	content = {} # when ready to send to front-end add db values to this dictionary
	return render(request, 'administration/resources/view-resource.html', content)

def administrationEditResource(request):
	content = {} # when ready to send to front-end add db values to this dictionary
	return render(request, 'administration/resources/edit-resource.html', content)

def administrationAddResource(request):
	content = {} # when ready to send to front-end add db values to this dictionary
	return render(request, 'administration/resources/add-resource.html', content)

def administrationRemoveResource(request):
	content = {} # when ready to send to front-end add db values to this dictionary
	return render(request, 'administration/resources/remove-resource.html', content)

# TODO back-end code for js requsts to resources