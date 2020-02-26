from django.shortcuts import render

#import the degrees model
from .models import Degree

# import the forms
# the right form is not used anymore
from .forms import DegreeSelectionForm, CoursesSelectionForm

# import the courses model; allows us to query DB
from courses.models import Course
from tecmCore.models import TechClasses
from mathCore.models import MathClasses

#adding something to create a model to dict
from django.forms.models import model_to_dict
from .utils import timelineGenerator, processTimeline, courseDescriptionStructure, generateDictEntry, extractInfo, processChoices

# Tate Test....
from pprint import pprint
from django.http import HttpResponse, HttpResponseNotFound

# Create your views here.
# Description: This function generates a dropdown form so that he users
#              can select a degree
def allDegreesView(request):

    # need to figure out stuff about default values
    if request.method == 'POST':
      degreeChoice = DegreeSelectionForm(request.POST)

      # The code below is used to get the user's input
      if degreeChoice.is_valid():
        cleanedChoice = degreeChoice.cleaned_data


        # when accessing objects we will need try/except blocks 
        try:
          choice = Degree.objects.filter(name=cleanedChoice['degreeChoices'])
          request.session['degree']=model_to_dict(choice[0])
          degreeName = request.session.get("degree")['name']

          # get the technical communications courses
          techcourses = TechClasses.objects.filter(name="Engineering TECM")
          techcourses = model_to_dict(techcourses[0])
          tecm = generateDictEntry(techcourses, degreeName, "Technical Communications", "tecmCoreInfo")
          request.session.get('degree')['degreeInfo'][tecm[0]] = tecm[1]

          # get the mathematics courses 
          mathcourses = MathClasses.objects.filter(name="Engineering MATH")
          mathcourses = model_to_dict(mathcourses[0])
          math = generateDictEntry(mathcourses, degreeName, "Mathematics", "mathCoreInfo")
          request.session.get('degree')['degreeInfo'][math[0]] = math[1]

          classes = extractInfo(request.session.get('degree')['degreeInfo'])
          print(classes[0])
          print("\n\n")
          print(classes[1])
          print("\n\n")
          print(classes[2])
          request.session['requirements'] = classes[0]
          request.session['electives'] = classes[1]
          request.session['rankings'] = classes[2]
          if 'taken' in request.session:
            del request.session['taken']

        except Degree.DoesNotExist:
          print('invalid selection')
      else:
        print('invalid choice')

    degreeDropdown = DegreeSelectionForm()
    #print(degreeDropdown)
    #pprint(vars(request)) #tate test here!
    print("\n\n")
    return render(request, 'degree/degreeList.html', { 'form': degreeDropdown })

#This is the function for structure for saving user info @CHALET
def degreeClassesView(request):

    if request.method == 'POST':
        degreeName = request.session.get("degree")['name']
        #request.session['taken'] = request.POST.getlist(degreeName)
           
        result = []
        if 'taken' in request.session:
          result = processChoices(request.session['taken'], request.POST.getlist(degreeName))
        else:
          result = processChoices([], request.POST.getlist(degreeName))
        request.session['taken'] = result

        #print(request.POST)
        print(request.session.get("taken"))

    #the context needs to change depending of whether the user has a degree or not
    if request.session.get('degree'):
      #print(request.session.get('degree'))
      print('Degree Set')
      usersDegree = request.session.get('degree')

            # seems like the degree context will need a degree name
      # somehow we need to map each course description with the database
      details = courseDescriptionStructure(usersDegree)
      #print(usersDegree)
      #print("\n\n")
      #print(details)
      # the code below should go in the utility function 
      #print("test1")
      tempContext = {
          "degree": usersDegree,
          "coursesInfo" : details,
      } # if the degree is set get the JSON objects  
      #print("test2")
    else:
      print('Need a degree')
      tempContext = {}
      # redirect to other page pass empty context?

    return render(request, 'degree/degreePlan.html', { "context": tempContext })

# Description: This function determines which courses need will be
#              shown in the timeline view
def degreeTimeline(request):
    # here we use the degree that the user has already selected
    # not sure if we would need to ask for the degree object again

    if request.session.get('degree'):

      ### assume we extracted all the classes from the JSON degree object
      ### and placed them in a list.
      #degreeCourses = ["MATH 1710", "MATH 1720", "TECM 2700", "CSCE 2100", "CSCE 2110", "CSCE 3110", "CSCE 4110", "CSCE 4444", "CSCE 4901"]

      if 'taken' not in request.session:
        print("no taken courses")
        taken = []
      else:
        taken = request.session['taken']
      if 'transferCredit' not in request.session:
        print("no transfer credits")
        transferCredits = []
      else:
        transferCredits = request.session['transferCredit']
      timeline = timelineGenerator(request.session['requirements'], request.session['electives'], request.session['rankings'], taken, transferCredits)

      #print("Finished setting the timeline\n\n")
      #print(timeline)
    
      fullTimeline = processTimeline(timeline)

    else:
      print("you need a degree")
      fullTimeline = {}
    #print(fullTimeline)
#******** need to further refine the timeline here before passing it to the view
#******** need another util function

    #return render(request, 'degree/timeline.html', {'timeline': timeline})
    return render(request, 'degree/timeline.html', {'timeline': fullTimeline})

def addADegree(request):
  if request.method == 'POST':
    print(request.POST)

  

  return render(request, 'degree/addDegree.html', {})

def editDegree(request):
    if request.method == 'POST':
      print(request.POST)

      if request.POST.get("degreeChoices"):
        degreeChoice = DegreeSelectionForm(request.POST)

        if degreeChoice.is_valid():
          cleanChoice = degreeChoice.cleaned_data
          context = {
            "degrees": '',
            "choice": 'this',
          }
          #choice = 

    degreeDropdown = DegreeSelectionForm()
    context = { 
      "degrees": degreeDropdown, 
      "choice": ''}

    return render(request, 'degree/editDegree.html', { "context": context })




def tateTestFunction(request):

  data = "";

  # grab all degree object data
  # -------------------------------------------
  # for degree in Degree.objects.all():
  #   data += str(degree)+"<br>"
  #   pprint(degree.year)

  # create new row entry
  # --------------------------------------------
  #Degree.objects.create(name='Information Technology', degreeInfo={},year='2020')
  
  # grab specific row by attribute search
  # ------------------------------------------
  #degree = Degree.objects.get(name='Information Technology')
  #pprint(degree) # test debug

  # grab every entry in the table
  # -------------------------------------------
  for degree in Degree.objects.all():
    # example how to grab specific row by attribute and change values
    # if degree.name == 'I.T.':
    #   degree.name = 'Information Technology'
    #   degree.save()

    # part of the for loop to concatenate model attributes to string
    data += str(degree.name)+"</br>"
  
  # create or edit session variable
  # ------------------------------------------
  #request.session['selectedDegree'] = 'Information Technology'

  # check if session variable exists
  # ------------------------------------------
  if request.session.get('selectedDegree'):
    print("it exists!")
  else:
    print("it does not exists...")

  # delete session variable
  # ------------------------------------------
  #del request.session['selectedDegree']

  #pprint(request.session['selectedDegree']);
  #data += "<br> Session Data: "+request.session['selectedDegree']+"<br>"

  # check for admin user
  # here we can check if admin options
  # should show up on page
  # ----------------------------------------------
  if request.user.is_authenticated:
    data += "<br><br>You are authenticated as the admin!"

  #return HttpResponse('<h1>'+data+'</h1>')
  content = {}
  return render(request, 'administration/home.html', content)