Dos Reis Cedric

# Pac Man - restfull API module

## Installation

### Setting up a virtual environment for the REST API with python

1. Install `virtualenv` package and create a new environment in the `./src` folder project

  

	On Linux and macOS :

  


	```
	python3 -m virtualenv env
	```

  


	On Windows :

  


	```
	python -m virtualenv env
	```

  


2. Activate the virtual environment with :

  

	On Linux and macOS :

  


	```
	source env/bin/activate
	```
	
	On Windows :
	
	```
	.\env\Scripts\activate
	```

3. Then install all packages dependencies in `requirements.txt` :

  

	```
	pip install -r requirements.txt
	```

4. Define environment variables

  

	On Linux and macOS :
	
	```
	export FLASK_ENV=development
	export FLASK_APP=app.py
	```
	
	On Windows :
	
	```
	set FLASK_ENV=development
	set FLASK_APP=app.py
	```

## Starting the web server (REST API)

```
python -m flask run
```

## Starting the web client

http://localhost:5000/
or 
127.0.0.1:5000

  

