from django.urls import path
from . import views

urlpatterns = [
	path('pkLookUp/js/', views.pkLookUpJS, name='pkLookUpJS'),
	path('autoSearchCourse/js/', views.autoSearchCourseJS, name='autoSearchCourseJS'),
	path('autoSearchDegree/js/', views.autoSearchDegreeJS, name='autoSearchDegreeJS'),

	path('view-degree/', views.administrationViewDegree, name='administrationViewDegree'),
	path('edit-degree/', views.administrationEditDegree, name='administrationEditDegree'),
	path('add-degree/', views.administrationAddDegree, name='administrationAddDegree'),
	path('remove-degree/', views.administrationRemoveDegree, name='administrationRemoveDegree'),
	# add degree plans js requests urls at a later time....
	path('add-degree/js/', views.administrationAddDegreeJS, name='administrationAddDegreeJS'),
	path('remove-degree/js/', views.administrationRemoveDegreeJS, name='administrationRemoveDegreeJS'),
	path('edit-degree/js/', views.administrationEditDegreeJS, name='administrationEditDegreeJS'),
	path('view-degree/js/', views.administrationViewDegreeJS, name='administrationViewDegreeJS'),
	path('view-degree-detailed/js/', views.administrationViewDegreeDetailedJS, name='administrationViewDegreeDetailedJS'),


	path('view-course/', views.administrationViewCourse, name='administrationViewCourse'),
	path('edit-course/', views.administrationEditCourse, name='administrationEditCourse'),
	path('add-course/', views.administrationAddCourse, name='administrationAddCourse'),
	path('remove-course/', views.administrationRemoveCourse, name='administrationRemoveCourse'),
	# add courses js requests urls at a later time....
	path('view-course/js/', views.administrationViewCourseJS, name='administrationViewCourseJS'),
	path('view-course-detailed/js/', views.administrationViewCourseDetailedJS, name='administrationViewCourseDetailedJS'),
	path('edit-course/js/', views.administrationEditCourseJS, name='administrationEditCourseJS'),
	path('add-course/js/', views.administrationAddCourseJS, name='administrationAddCourseJS'),
	path('remove-course/js/', views.administrationRemoveCourseJS, name='administrationRemoveCourseJS'),
	path('create-session/js/',views.studentCreateSession, name='studentCreateSession'),

	path('view-resource/', views.administrationViewResource, name='administrationViewResource'),
	path('edit-resource/', views.administrationEditResource, name='administrationEditResource'),
	path('add-resource/', views.administrationAddResource, name='administrationAddResource'),
	path('remove-resource/', views.administrationRemoveResource, name='administrationRemoveResource'),	
]