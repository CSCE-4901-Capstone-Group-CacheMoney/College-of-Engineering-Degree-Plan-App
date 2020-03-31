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
	#degreeSearchText = degreeSearchText.replace(' ','')
	print (degreeSearchText)
	content={}
	for d in Degree.objects.filter(name__istartswith=str(degreeSearchText)):
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
		}
		content.append(result) 

	return JsonResponse(content, safe=False)

@csrf_exempt
def administrationViewDegreeDetailedJS(request):
	degreeSearchText = request.POST.get('degreeSearchText', '')
	#degreeSearchText = degreeSearchText.replace(' ','')
	print (degreeSearchText)
	content={}
	courseList=""
	for d in Degree.objects.filter(name__istartswith=str(degreeSearchText)):
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
			#result = {"CourseCode": str(c.courseDept) + ' ' +str(c.courseID),"CourseName": str(c.name), "Description": str(c.description),
					#   "Category": str(c.category), "Hours": str(c.hours), "CourseAvailability": str(c.semester), "PrereqCount": str(c.prereqCount),
					#   "CoreqCount": str(c.coreqCount)}
			# content.append(dict(result)) 
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
				# result = {"CourseCode": str(c.courseDept) + ' ' +str(c.courseID),"CourseName": str(c.name), "Description": str(c.description),
				# 		  "Category": str(c.category), "Hours": str(c.hours), "CourseAvailability": str(c.semester), "PrereqCount": str(c.prereqCount),
				# 		  "CoreqCount": str(c.coreqCount)}
				# content.append(dict(result)) 
		#print (content)

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
				# result = {"CourseCode": str(c.courseDept) + ' ' +str(c.courseID),"CourseName": str(c.name), "Description": str(c.description),
				# 		  "Category": str(c.category), "Hours": str(c.hours), "CourseAvailability": str(c.semester), "PrereqCount": str(c.prereqCount),
				# 		  "CoreqCount": str(c.coreqCount)}
				# content.append(dict(result)) 
		#print (content)

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

	else:
		c = Course.objects.filter(courseDept__istartswith=str(nCourseDept).upper(), courseID__startswith=nCourseID)
		#print(c)			
		if not c:
			# if nCourseAvail == "0":
			# 	nCourseAvail = "Spring"
			# elif nCourseAvail == "1":
			# 	nCourseAvail = "Fall"
			# else:
			# 	nCourseAvail = "Both"
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

	#print(json.loads(ndegreeInfo))

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

		#Get result from a search of above
		#save the ID
		status = Course.objects.filter(courseDept__istartswith=str(res[0]), courseID__startswith=res[1]).delete()
		#Delete from degree plans

		if status[0] == 1:											#if successful
			jsResponse = {
				'success': 'True',
				'message': 'Successful removing course '+  str(res[0]) + '!'
			}
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

	NbrOfRow = Degree.objects.filter(name=str(nDegreeName), catalogYear__startswith=ncatalogYear, CollegeName__istartswith=str(nCollegeName), specialty__istartswith=str(nspecialty)).update(degreeInfo=ndegreeInfo)
	#print(c)			
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