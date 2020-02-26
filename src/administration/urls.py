from django.urls import path
from . import views

urlpatterns = [
    path('add-degree/', views.administrationAddDegree, name='administrationAddDegree'),
    #when ready continue paths here!
]