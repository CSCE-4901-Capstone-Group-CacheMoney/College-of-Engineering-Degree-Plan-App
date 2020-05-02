"""degreePlan URL Configuration

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/2.1/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.contrib import admin
from django.urls import path, include

#here is where we import the urls that we have created
from degrees.views import allDegreesView, degreeClassesView, degreeTimeline, addADegree, editDegree, session, timelineTest
from transferCredits.views import transferCreditView, addTransferCredit
from home.views import homeView, resourcesView, creditsView
from administration.views import administrationHomeView
from session.views import sessionHomeView

#make sure to add the path to the to the url patters below
#**** don't forget the comma !!!
urlpatterns = [
    path('', homeView),
    path('credits/', creditsView),
    path('admin/', admin.site.urls),
    path('degrees/', allDegreesView, name='degrees'),
    path('degree/', degreeClassesView, name='degreePlan'),
    path('timeline/', degreeTimeline, name='timeline'),
    path('test/', timelineTest, name='timelineTest'),

    path('users/', include('users.urls')),
    path('users/', include('django.contrib.auth.urls')),
    path('transferCreditList/', transferCreditView, name='transferCreditList'),
    path('addDegree/', addADegree, name="addDegree"),
    path('editDegree/', editDegree, name="editDegree"),
    path('addTransferCredit/', addTransferCredit, name="addTransferCredit"),
    path('administration/', administrationHomeView, name="administrationHomeView"),
    path('administration/', include('administration.urls')),

    path('session/', session, name="session"),
    path('session/', include('session.urls')),

    path('resources/', resourcesView, name='resources'),
]

