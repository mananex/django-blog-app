# Django blog app
### This is a simple web application that allows users to create blogs, search for them using keywords, read other blogs and share them.

#### Click on this to see the video.<br>
[![Youtube link](https://img.youtube.com/vi/L-RaJAM4Su4/0.jpg)](https://www.youtube.com/watch?v=L-RaJAM4Su4)

## Installation
First of all, you need to have Python 3.x installed. I'm using `Python 3.11.7`. **Installation manual made for Windows OS.**

Create a folder where your project will be located and start follow installation steps.

### 1. Creating a virtual environment and downloading github repository
Open a command line and move to the project directory, then execute these commands.

```
python -m venv venv-django-blog-app
cd venv-django-blog-app
```
Then you can download this repository by running `git clone https://github.com/mananex/django-blog-app.git` in the command line (**if you have git installed**), or you can just manually download the repository archive and unzip it in the virtual environment.

After this, the virtual environment folder should look like this:

&emsp;&emsp;┌ `venv-django-blog-app` **(v-env name)**<br>
&emsp;&emsp;├── `Include`<br>
&emsp;&emsp;├── `Lib`<br>
&emsp;&emsp;├── `Scripts`<br>
&emsp;&emsp;├── `django-blog-app` **(or** `django-blog-app-main`**)**<br>
&emsp;&emsp;├──── `.git`<br>
&emsp;&emsp;├──── `bloggo`<br>
&emsp;&emsp;├──── `blogs`<br>
&emsp;&emsp;├──── `common`<br>
&emsp;&emsp;├──── `main`<br>
&emsp;&emsp;├──── `profiles`<br>
&emsp;&emsp;├──── `cmd.bat`<br>
&emsp;&emsp;├──── `manage.py`<br>
&emsp;&emsp;├──── `README.md`<br>
&emsp;&emsp;├──── `requirements.txt`

### 2. Activating virtual environment and installing packages
In the environment folder move to the `django-blog-app` (or `django-blog-app-main`) folder and run the `cmd.bat` file. **It will activate the virtual environment.** *Don't close it, you need to use it when setting up the project.*

To install all packages you should run `pip install -r requirements.txt` in the command line - after launching the `cmd.bat` file (*it's important*).

### 3. Project setup
Before launching the server you must run the following commands.
```
python manage.py makemigrations
python manage.py migrate
python manage.py collectstatic
```

If you want to have access to the admin panel, you will also need to create a superuser. You can do it by running the command `python manage.py createsuperuser`. To access the admin panel page go to the `/admin` page of the web app after launching it.<br>
**Example:** `http://127.0.0.1:8000/admin`

### 4. Launching the server
Whenever you want to launch the server, first of all you need to open command line and activate the virtual environment. By running `cmd.bat` in the `django-blog-app` folder you will automatically launch the command line and activate the virtual environment.
**To launch the server use the command** `python manage.py runserver`.

### Thanks!
