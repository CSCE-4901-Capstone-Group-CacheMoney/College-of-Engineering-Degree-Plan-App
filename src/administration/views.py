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
	
	return JsonResponse(content)

@csrf_exempt
def administrationAddCourseJS(request):	
	nCourseName = request.POST.get('nCourseName', '')
	nCourseDept = request.POST.get('nCourseDept', '')
	nCourseID = request.POST.get('nCourseID', '')
	nCoursePrereqCount = request.POST.get('nCoursePrereqCount', '')
	nCourseCoreqCount = request.POST.get('nCourseCoreqCount', '')
	nCourseHours = request.POST.get('nCourseHours', '')
	#nCourseAvail = request.POST.get('nCourseAvail', '')
	c = Course.objects.filter(courseDept__istartswith=str(nCourseDept), courseID__startswith=nCourseID)
	#print(c)			
	if not c:
		Course.objects.create(
		name = str(nCourseName),
		courseDept = str(nCourseDept),
		courseID = nCourseID,
		prereqCount = nCoursePrereqCount,
		coreqCount = nCourseCoreqCount,
		hours = nCourseHours,
		#semester = str(nCourseAvail)	
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
def administrationRemoveCourseJS(request):
	# courseSearchText = request.POST.get('courseSearchText', '')
	# contains_digit = any(map(str.isdigit,courseSearchText))	#check if the search string contains digit
	
	# if contains_digit:
	# 	temp = re.compile("([a-zA-Z]+)([0-9]+)") 			#splitting courseDept and courseID
	# 	res = temp.match(courseSearchText).groups() 
	# 	status = Course.objects.filter(courseDept__istartswith=str(res[0]), courseID__startswith=res[1]).delete()
	# 	if status[0] == 1:
	# 		jsResponse = {
	# 			'success': 'True',
	# 			'message': 'Successful removing course '+  str(res[0]) + '!'
	# 			}
	# 	else: 	
	# 		jsResponse = {
	# 		'success': 'False',
	# 		'message': 'Error removing course '+  str(res[0]) + '!'
	# 		}
	# else:
	# 	status = Course.objects.filter(courseDept__istartswith=str(res[0])).delete()
	# 	if status[0] == 1:
	# 		jsResponse = {
	# 			'success': 'True',
	# 			'message': 'Successful removing course '+  str(res[0]) + '!'
	# 			}
	# 	else: 	
	# 		jsResponse = {
	# 			'success': 'False',
	# 			'message': 'Error removing course '+  str(res[0]) + '!'
	# 			}
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