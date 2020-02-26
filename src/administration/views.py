from django.shortcuts import render
from django.http import HttpResponse, HttpResponseNotFound

# Create your views here.

# not need for code in this function, it 
# just directs admin to home page after login
def administrationHomeView(request):
	return render(request, 'administration/home.html', {})

# TODO back-end code for adding a degree
def administrationAddDegree(request):
	content = {} # when ready to send to front-end add db values to this dictionary
	return render(request, 'administration/add_degree.html', content)
