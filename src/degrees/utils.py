# This file holds utility functions for the degrees
from courses.models import Course, Prereq   #, preCoReq
from degrees.models import Degree
from django.forms.models import model_to_dict

import re 

import math

import copy

import time

import json

from serialScheduler import SerialScheduler
from processParallelScheduler import ProcessParallelScheduler
"""

MOST OF THESE FUNCTIONS ARE NOT FUNCTIONALLY USED, BUT STILL REFERENCED
DO NOT DELETE ANY COMPLETE FUNCTION AT THE MOMENT AS A COMPILER ERROR WILL OCCUR

"""
# needs the course array and the university core array
def timelineGenerator(courses, electives, rankings, coursesTaken, transferCredits):

    return 

# Description: A function used to find a course in the timeline
# Return:      The function returns the location of the course in the timeline and a boolean
#              representing whether it exists in the timeline or not
# Parameters:  course is a string of course such as CSCE 1030
#              timeline is a dictionary where each key holds a list of tuples
#              Ex. {1:[(CSCE 1030, 0, [])]}
def findCourse(course, timeline):


    return 

# Description: This function updates the second entry in a tuple.
#              Ex. (CSCE 1030, 0, []) this function would increase 0 to 1
# Return:      The index of the course, i.e. the key
# Parameters:  updateInfo is a tuple with a boolean value, a dictionary key, and a list index
#                   Ex. (True, 2, 3)
#              course is a string such as CSCE 1030
#              timeline is a dictionary of all the courses in the timeline
def updatePriority(updateInfo, course, timeline):

    return 

# needs the course, the course list, the corelist, the "offset", the dictionary
# Description: This function recursively finds the a courses prerequisites by querying the database
# Return:      a dictionary that acts as hash map of the location for each course
# Parameters:  currentCourse is a course in a list, the coursesList is the list of courses in the degree, coreList is
#              a list of the univeristy core categories, timeline is the preprocessed timeline
def coursePlacement(currentCourse, coursesList, coreList, timeline):
#    print("++++++++++ Current Course: " + currentCourse)

    return 

# Description: a function used with python's list sort. The function takes a tuple parameter
# and uses it's second value to sort all tuples in a list
def priority(x):
    return x[1]

# this function needs to divide the timeline into the courses for each semester
# Description:  This function separates the timeline dictionary into groups of 5
# Return:       a list of lists of five entries where each entry is a course
# Parameter:    the timeline dictionary
def processTimeline(timeline):

    return 

# Description:  The function takes a degree object and generates a dictionary where
#               each key is a course and each value is a course's database information
# Return:       A dictionary that maps courses with their database information
# Parameter:    A degree database object as a dictionary
def courseDescriptionStructure(degree):

    return 
    
# Description:  This function is used to build a string the represents the information for a particular course
# Return        A string which holds the parameters information the information is the course's name,
#               the number of the course's hours, and the course's description
# Parameter:    the course department and course id as a single string, i.e. CSCE 1030   
def generateCourseInfo(course):

    return 

# Description:  This funciton generates a dictionary entry
# Return        a a string and list of courses - tuple of a list of courses and a string ()
# Parameter:    a JSON object, and degree name  
def generateDictEntry(degreeCore,degreeName,category,lookUpCat):

    return 

def extractInfo(degree):

    return 

def processChoices(currentChoices, newChoices):

    for course in newChoices:
        if course not in currentChoices:
            currentChoices.append(course)

    return currentChoices

def sleep(this):

    time.sleep(4)

    return this

def add_tasks(scheduler, test_function, courses, coursedeps):
    temparr = []
    print(courses)
    print(coursedeps)
    for i, course in enumerate(courses):
        print(course)
        temparr.append([])
        #if course in coursedeps.keys():
            #print("Course with dep: " + str(course) + " dep: " + str(coursedeps[course]))
        for dep in coursedeps[course]:
            temparr[i].append(str(dep))
            
        print("Dependencies: " + str(temparr[i]))
        #if len(temparr)>=1:
        scheduler.add_task(task_name = str(course), dependencies = temparr[i], description ="",target_function = test_function ,function_kwargs={"this":int(course)})
        #else:
        #    scheduler.add_task(task_name = str(course), dependencies = [], description ="",target_function = test_function ,function_kwargs={"this":int(course)})

        #else:
        #    print(course)
        #    scheduler.add_task(task_name = str(course), dependencies = [], description ="",target_function = test_function ,function_kwargs={"this":int(course)})

def echo(this):
    return this

def add_testtasks(scheduler, test_function):

    scheduler.add_task(task_name = "149", dependencies = [], description ="",target_function = test_function ,function_kwargs={"this":149})

    #scheduler.add_task(task_name = "43", dependencies = [], description ="",target_function = test_function ,function_kwargs={"this":43})

class TaskScheduler():

    def testSerialScheduling(self, courses, coursedeps):

        serial = SerialScheduler()

        add_tasks(serial, echo, courses, coursedeps)

        return (serial.run())

    def ParallelScheduling(self, courses, coursedeps):

        parallel = ProcessParallelScheduler(5)

        add_tasks(parallel, sleep, courses, coursedeps)

        results = parallel.run()

        return results

    def TestParallelScheduling(self):

        parallel = ProcessParallelScheduler(5)

        add_testtasks(parallel, sleep)

        results = parallel.run()

        return results

def timelineGenerator2(classesTaken, degreeID, degreeYear, degreeName):
    print(degreeID)
    print(classesTaken)
    degreeYear = ""
    new = ""

    
    #new, degreeYear = degreeName.split(" - ")
    #{"Categories": [{"College": "None", "DegreeName": "BIOMEDICAL ENGINEERING", "DegreeYear": null, "Specialty": "None", "PreReqs": [12, 18], "CoReqs": [19]}, {"College": "", "DegreeName": "", "DegreeYear": "", "Specialty": "", "PreReqs": [23, 22], "CoReqs": [2, 1]}]}
    #print("Degree year: " + str(degreeYear) + " Degree name: " + str(new))
    tobj = Degree.objects.get(id = degreeID)
    degree = tobj.degreeInfo
    degreeLoad = tobj.degreeInfo
    classLoad = classesTaken
    classes = []
    #multiple course options
    varclasses = []
    #those course options category names
    varclassescat = []
    tempclasses = []
    classdeps = {}
    print(degreeLoad)
    for reqs in degreeLoad["Categories"]:
        for courses in reqs["courses"]:
            print("Printed courses: " + str(courses))
            i=1
            if courses in classLoad["Categories"]["courses"]:
                """if (int(reqs["coursesRequired"])>0):
                    print("Only some required")
                    i+=1
                """
                print("Course removed: " + str(courses))
                #del degreeLoad["Categories"]["courses"][int(courses)]
                continue
            tempclasses.append(int(courses))
        if reqs["coursesRequired"]==0:
            for currcourse in tempclasses:
                classes.append(currcourse)
            tempclasses.clear()
        else:
            while(i<int(reqs["coursesRequired"])):
                classes.append(tempclasses[i])
                varclasses.append(tempclasses[i])
                i+=1
            tempclasses.clear()
            varclassescat.append(reqs["name"])
    deps = {}

    for currclass in classes:
        #print(currclass)
        obj = Course.objects.get(id=currclass)
        #print(str(json.dumps(obj.preCoReq)))
        deps = json.loads(str(json.dumps(obj.preCoReq)))
        for currDeg in deps["Categories"]:
            if currDeg["DegreeName"]==degreeName and currDeg["DegreeYear"]==degreeYear:
                print("Found specific degree reqs")
                classdeps[currclass].append(currDeg["PreReqs"])
                classdeps[currclass].append(currDeg["CoReqs"])
            elif(deps["Categories"][0]["DegreeName"]==""):
                print("Using no specific degree")
                classdeps[currclass] = (deps["Categories"][0]["PreReqs"])
                #classdeps[currclass].update((deps["Categories"][0]["CoReqs"]))

    print(classdeps)

    tempdeps = []
    for cdep in classdeps:
        for adep in classdeps[cdep]:
            if adep in classes:
                print("cdep already exists: " + str(adep))
            elif adep in classLoad["Categories"]["courses"]:
                classdeps[cdep].remove(adep)
            else:
                print("class being added:")
                classes.append(str(adep))
                tempdeps.append(str(adep))
            

    for cdeps in tempdeps:
        obj = Course.objects.get(id=cdeps)
        deps = json.loads(str(json.dumps(obj.preCoReq)))
        classdeps[cdeps] = (deps["Categories"][0]["PreReqs"])
        #classdeps[cdeps] = []
    

    #for currcourse in classdeps            

    #print("All classes: " + str(classes))
    #print("Changable classes: " + str(varclasses))
    #print("Changable class cats: " + str(varclassescat))
    #print("Single class dependencies " + str(classdeps))


    schedule = TaskScheduler()
    print(schedule.testSerialScheduling(classes, classdeps))

    #print(schedule.TestParallelScheduling())
    print()
    print()
    #print(schedule.testSerialScheduling(classes, classdeps))
    print("Classes: " + str(classes) + " Class deps: " + str(classdeps))
    print("Assuming start in fall")

    classArr = schedule.ParallelScheduling(classes, classdeps)
    print(classArr)

    return classArr
