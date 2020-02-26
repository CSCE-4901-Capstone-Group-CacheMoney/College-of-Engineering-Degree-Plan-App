from django.shortcuts import render
from django.http import HttpResponse, HttpResponseNotFound

# Create your views here.

# not need for code in this function, it 
# just directs admin to home page after login
def administrationHomeView(request):
	return render(request, 'administration/home.html', {})