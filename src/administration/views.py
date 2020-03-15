from django.shortcuts import render
from django.http import HttpResponse, HttpResponseNotFound, HttpRequest, JsonResponse
from django.contrib.auth.decorators import user_passes_test
from django.views.decorators.csrf import csrf_exempt

from courses.models import Course
from degrees.models import Degree
import re 										#for spliting string and number in courseSearchText
import copy 
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
	content={}
	for d in Degree.objects.filter(name__istartswith=str(degreeSearchText)):
		content["DegreeName"] = str(d.name)
		content["DegreeInfo"] = str(d.degreeInfo)

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
			content["CourseCode"] =	str(c.courseDept)+ " " + str(c.courseID) 
			content["CourseName"] = str(c.name)
			content["Description"] = str(c.description)
			content["Category"] = str(c.category)
			content["Hours"] = str(c.hours)
			content["CourseAvailability"] = str(c.semester)
			content["PrereqCount"] = str(c.prereqCount)
			content["CoreqCount"] = str(c.coreqCount)
			break
			#result = {"CourseCode": str(c.courseDept) + ' ' +str(c.courseID),"CourseName": str(c.name), "Description": str(c.description),
					#   "Category": str(c.category), "Hours": str(c.hours), "CourseAvailability": str(c.semester), "PrereqCount": str(c.prereqCount),
					#   "CoreqCount": str(c.coreqCount)}
			# content.append(dict(result)) 
	else:
		for c in Course.objects.filter(courseDept__istartswith=str(courseSearchText)):
			content["CourseCode"] =	str(c.courseDept)+ " " + str(c.courseID) 
			content["CourseName"] = str(c.name)
			content["Description"] = str(c.description)
			content["Category"] = str(c.category)
			content["Hours"] = str(c.hours)
			content["CourseAvailability"] = str(c.semester)
			content["PrereqCount"] = str(c.prereqCount)
			content["CoreqCount"] = str(c.coreqCount)
			break
			# result = {"CourseCode": str(c.courseDept) + ' ' +str(c.courseID),"CourseName": str(c.name), "Description": str(c.description),
			# 		  "Category": str(c.category), "Hours": str(c.hours), "CourseAvailability": str(c.semester), "PrereqCount": str(c.prereqCount),
			# 		  "CoreqCount": str(c.coreqCount)}
			# content.append(dict(result)) 
	#print (content)
	return JsonResponse(content)

@csrf_exempt
def administrationAddCourseJS(request):	
	nCourseName = request.POST.get('nCourseName', '')
	nCourseDept = request.POST.get('nCourseDept', '')
	nCourseID = request.POST.get('nCourseID', '')
	nCoursePrereqCount = request.POST.get('nCoursePrereqCount', '')
	nCourseCoreqCount = request.POST.get('nCourseCoreqCount', '')
	nCourseHours = request.POST.get('nCourseHours', '')
	nCourseAvail = request.POST.get('nCourseAvail', '')
	print (nCourseAvail)
	c = Course.objects.filter(courseDept__istartswith=str(nCourseDept), courseID__startswith=nCourseID)
	#print(c)			
	if not c:
		if nCourseAvail == "0":
			nCourseAvail = "Spring"
		elif nCourseAvail == "1":
			nCourseAvail = "Fall"
		else:
			nCourseAvail = "Both"
		print (nCourseAvail)
		Course.objects.create(
		name = str(nCourseName),
		courseDept = str(nCourseDept),
		courseID = nCourseID,
		prereqCount = nCoursePrereqCount,
		coreqCount = nCourseCoreqCount,
		hours = nCourseHours,
		semester = str(nCourseAvail)	
		)
		jsResponse = {
			'success': 'True',
		    'message': 'Successfully added ' + str(nCourseName) + ' to course list!'
		}
	else:
		jsResponse = {
			'success': 'False',
			'message': 'Error adding course. ' + str(nCourseName) + ' already exists!'
		}
	return JsonResponse(jsResponse)

@csrf_exempt	
def administrationAddDegreeJS(request):
	nDegreeName = request.POST.get('nDegreeName', '')
	#ncourseList = request.POST.get('ncourseList', '')
	ncatalogYear = request.POST.get('ncatalogYear', '')
	ndegreeInfo = request.POST.get('ndegreeInfo','')
	value = Degree.objects.filter(name__istartswith=str(nDegreeName), catalogYear__startswith=ncatalogYear)
	#print(c)			
	if not value:
		Degree.objects.create(
		name = str(nDegreeName),
		#courseList = str(ncourseList),
		catalogYear = str(ncatalogYear),
		degreeInfo = str(ndegreeInfo)
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
			'message': 'Error removing course, format as "DepartmentName CourseNumber"'
		}
		
	return JsonResponse(jsResponse)


@csrf_exempt	
def administrationRemoveDegreeJS(request):
	nDegreeName = request.POST.get('nDegreeName', '')
	#ncourseList = request.POST.get('ncourseList', '')
	ncatalogYear = request.POST.get('ncatalogYear', '')
	#ndegreeInfo = request.POST.get('ndegreeInfo','')
	value = Degree.objects.filter(name__istartswith=str(nDegreeName), catalogYear__startswith=ncatalogYear).delete()
	#print(c)			
	if (value[0]==1):
		#Degree.objects.create(
		#name = str(nDregreeName),
		#courseList = str(ncourseList),
		#catalogYear = str(ncatalogYear),
		#degreeInfo = str(ndegreeInfo)
		#)
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
	#ncourseList = request.POST.get('ncourseList', '')
	ncatalogYear = request.POST.get('ncatalogYear', '')
	ndegreeInfo = request.POST.get('ndegreeInfo','')
	#value = Degree.objects.filter(name__istartswith=str(nDregreeName), catalogYear__startswith=ncatalogYear)
	# Update all the headlines with pub_date in 2007.
	NbrOfRow = Degree.objects.filter(name=str(nDegreeName), catalogYear__startswith=ncatalogYear).update(degreeInfo=ndegreeInfo)
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