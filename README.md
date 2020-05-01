# OptimizePrime

### Installation
- You may download a specific python version from https://www.python.org/downloads/
	- pip will be installed along with the python download
- If you have multiple versions of python installed on your system, replace `python` with `python3`.
- All of the following commands are executed in a powershell terminal. Changes may be necessary for other terminal types.


1. Once you confirm that python and pip are installed on your system, install virtualenv using the line\
	`pip install virtualenv`
2. Next create your virtual environment inside the folder where you add this project using the line\
	`python -m venv environmentName`

	 An example of our file hierarchy
		
		|-- projectsRoot
			|--degreePlan                    
				|-- (create virtual environment here)
				|-- (place the github OptimizePrime folder here)

3. Next run the virtual environment using the line\
		  `./Scripts/activate`
4. Next enter the directory OptimizePrime using `cd OptimizePrime` and then the src directory using `cd src`
5. Next install the following packages using pip
```
	pip install django             (our project was written using django 2.1.7)
      	pip install psycopg2           (our project used 2.7.7) 
      	pip install bootstrap4         (our project used 0.1.0)
      	pip install jinja2	       (our project used 2.10)
```
6. Once everything is installed and making sure that you are in the src directory run the following two lines
```
	python manage.py makemigrations
	python manage.py migrate
```
7. Lastly, you can launch the server using the line\
      `python manage.py runserver`

### Degree Planning Service Server Deployment and Maintenance

#### Introduction
We are currently running our Degree Planning Service application on a server hosted by UNT.
```
	OS: Windows Server 2016
	IP: 129.120.151.225
	Domain: degreeplans.unt.ad.unt.edu
```
#### Application Location

- Currently the entire project and its batch scripts are located under Tate Mosier’s student user account, the source code for the project is located at: 	C:\Users\tcm0106\Documents\College-of-Engineering-Degree-Plan-App. 

There are also 2 PowerShell Scripts that are currently automated on the server. One script is used to automatically start the Django server on server startup, as well another script that checks for old student sessions in our database and purges them if they are at least a year old. These PowerShell scripts are located at the root of the C drive (C:\). You can also find the automation settings for the scripts under the Windows Task Scheduler. The tasks are labeled “Start Degree Plan App” and “Degree Plan App Purge Old Sessions”.

The server requires the PostgreSQL server which is managed by pgAdmin 4 install under the programs folder if you ever need to view or make direct changes to the database.

In order to use our program make sure that you have Python 3.7.2 installed. Our team used pip 19.0.2 as our package manager and the following instruction will use pip commands.

#### Extra Information
- If needed, testing a local database is possible. Install PostgreSQL at https://www.postgresql.org/download/
* in `src\degreePlan\settings.py`, you may:
  * Change `DEBUG = False` to `DEBUG = True` should debug be needed on pages, instead of a generic 404 error
  * Change `DATABASES = {...}` to change database hooking locations, or the type of database engine in general
