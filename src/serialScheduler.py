'''

Created on 16/08/2012



@author: victor

'''
import django
django.setup()

class Task(object):

    """

    Representation of a task.

    """

    def __init__(self, function, name, kwargs, description = ""):

        """

        Creates a Task object.

        @param function: A callable object that will perform the real work of the task.

        @param name: The name of the task (an identifier).

        @param kkwargs: Parameters for the callable.

        @param description: A short description of what the task does. Can be empty.

        """

        self.function = function

        self.name = name

        self.kwargs = kwargs

        self.result = None



    def run(self):

        """

        Runs the task's associated callable and returns its result.

        @return: The result of the callable execution.

        """

        self.result = self.function(**(self.kwargs))

        return self.result



class SerialScheduler(object):

    """

    Base scheduling class. It ensures that no task is executed before its dependencies (without building a

    dependency tree).

    It allows to define some functions that will be executed when the scheduler reaches some strategic points.

    TODO: In all scheduler types a dependencies must be checked to avoid cycles for instance.

    """



    def __init__(self, functions = {}):

        """

        Constructor. Initializes needed variables.



        @param fucntions: A dictionary containing 3 possible keys. Each key defines another dictionary of two

        entries ('function' and 'kwargs') with a callable and its arguments. The possible keys are:

            'task_started' -> Were an action performed after each task is called is defined.

            'task_ended' -> Defines the action performed when a task is finished.

            'scheduling_started' -> Defines the action performed when the scheduler starts to run tasks.

            'scheduling_ended' -> Defines the action performed when the scheduler has finished to run all tasks.

        """

        self.functions = functions

        self.semester = "Fall"

        self.tasks = {}

        self.dependencies = {}

        self.not_completed = []

        self.finished = []

        self.results = []



    def function_exec(self, function_type, info = None):

        """

        Execute one of the predefined functions if defined.



        @param function_type: Type of the function to check and run (proper types should be 'task_start','task_end'

        and 'scheduling_end', each defining 'function' and 'kwargs' entries.



        """

        if function_type in self.functions:

            self.functions[function_type]['kwargs']['info'] = info

            self.functions[function_type]['function'](**(self.functions[function_type]['kwargs']))



    def run(self):

        """

        Runs all the tasks in a way that tasks are not executed before their dependencies are

        cleared.



        @return: An array with the results of task calculations.

        """

        self.function_exec('scheduling_started', {"number_of_tasks":len(self.not_completed)})



        ordered_tasks = self.get_ordered_tasks()



        for task in ordered_tasks:

            self.function_exec('task_started', {"task_name":task.name})

            self.results.append(task.run())

            self.function_exec('task_ended', {"task_name":task.name, "finished":len(self.finished)})



        self.function_exec('scheduling_ended')



        return self.results


    def get_ordered_tasks(self):

        """

        Returns a list of task names so that any task name will have an index bigger than the tasks it depends on.



        @return: A list of task names.

        """
        classcount = 0

        ordered_tasks = []
        while len( self.not_completed) > 0:

            #Choose an available process
            #classcount+=1 
            if classcount == 4:
                if self.semester== "Fall":
                    self.semester="Spring"
                else:
                    self.semester="Fall"
                classcount=0

            task_name = self.choose_runnable_task()

            #print(ordered_tasks)



            if task_name is None:


                print("It was impossible to pick a suitable task for running. Check dependencies.")

                return []

            else:

                # Run a process

                ordered_tasks.append(self.tasks[task_name])

                print("Current task: " + str(task_name))

                classcount+=1

                self.lock_task(task_name)

                self.complete_task(task_name)

                self.remove_from_dependencies(task_name)

        return ordered_tasks



    def choose_runnable_task(self):

        """

        Returns a task name which dependencies have already been fulfilled.



        @return: The task name.

        """
        #print("Incomplete tasks: " + str(self.not_completed) + " Type: " + str(type(self.not_completed)))
        #print("List of dependencies: " + str(self.dependencies))
        for task_name in self.not_completed:
            #print("All tasks have dependencies, task self: " + str(self.tasks))
            
            if len(self.dependencies[str(task_name)]) == 0:         # and (self.tasks[str(task_name)].description== "Both" or self.tasks[str(task_name)].description == self.semester): # This process has no dependencies
                #print("Found no dependencies for this task, passing this on")
                print("Task name: " + str(task_name) + " semesters available: " + str(self.tasks[str(task_name)].description) + " current semester: " + str(self.semester))
                return task_name

        
        #print("Found no tasks without dependencies")
        return None # All task have dependencies (circular dependencies for instance)





    def lock_task(self, task_name):

        """

        Removes a task from the 'not complete list' making it unavailable for further selections.



        @param task_name: The name of the task to lock.

        """

        # Remove it from the not_completed list

        self.not_completed.remove(task_name)



    def complete_task(self, task_name):

        """

        Adds a task to the list of completed tasks.



        @param task_name: The name of the task to complete.

        """

        self.finished.append(task_name)



    def remove_from_dependencies(self, task_name):

        """

        Removes a task from the dependencies of all other uncomplete tasks. At the end of execution, all dependency

        lists must be empty.



        @param task_name: The name of the task to remove from dependencies.

        """

        #print("Removing " + str(task_name) + " from dependencies: " + str(self.dependencies))


        for tn in self.dependencies:

            if task_name in self.dependencies[tn]:

                self.dependencies[tn].remove(task_name)



    def add_task(self, task_name, dependencies, target_function, function_kwargs, description):
        """
        print("Self: " + str(self.dependencies) + str(self.functions) + str(self.tasks) + str(self.not_completed))

        print("Task name: " + str(task_name) + "Dependences: " + str(dependencies) + "Target function: " + str(target_function))
        print("Function kwargs: " + str(function_kwargs) + "Description" + str(description))
        """
        """

        Adds a task to the scheduler. The task will be executed along with the other tasks when the 'run' function is called.



        @param task_name:

        @param dependencies: A list with the task_names of the tasks that must be fulfilled before executing this other task.

        Example of dependencies dictionary:

            {"task_C":["dep_task_A", "dep_task_B"]}

            This dependencies dict. means that task C cannot be run until task B and A are cleared.

        @param target_function: The function executed by this task.

        @param function_kwargs: Its arguments.

        @param description: A brief description of the task.

        """



        if not task_name in self.tasks:
            """print()
            print("Task name: " + str(task_name) + "dep type: " + str(type(dependencies)) + "actual deps: " + str(dependencies))

            print("All dependencies before insert" + str(self.dependencies))
            """
            task = Task( name = str(task_name), description = description, function = target_function, kwargs=function_kwargs)

            task.description = description

            self.tasks[str(task_name)] = task

            self.not_completed.append(str(task_name))

            self.dependencies[str(task_name)] = dependencies

            print("Task name: " + str(task_name) + "  actual deps: " + str(dependencies))

            #print("All dependencies after insert: " + str(self.dependencies))
            
        else:

            print("[Error SerialScheduler::add_task] Task " + str(task_name) + " already exists. Task name must be unique.")

            exit()