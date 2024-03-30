from flask import Flask
from flask_cors import CORS

import os


app = Flask(__name__)

CORS(app, supports_credentials=True)  # Enable CORS for all routes

SECRET_KEY = os.environ.get('SECRET_KEY') or 'this is a secret'
# print(SECRET_KEY)
app.config['SECRET_KEY'] = SECRET_KEY

#app.config.from_pyfile('config.py')  # Assuming you have a config.py file


from app import routes