from functools import wraps
import jwt
from flask import jsonify, request
from app import app
from .db import User

def token_required(f):
    @wraps(f)
    def decorated(*args, **kwargs):
        #token = request.args.get('token')
        token = request.cookies.get('token')
        
        print(token)
        if not token:
            return jsonify({'message': 'Token is missing!'}), 401

        try:
            user = User()
            data = jwt.decode(token, app.config['SECRET_KEY'], algorithms=['HS256'])
            current_user = user.find_user_by_id(data['user_id'])
        except jwt.ExpiredSignatureError:
            return jsonify({'message': 'Token has expired!'}), 401
        except jwt.InvalidTokenError:
            return jsonify({'message': 'Invalid token!'}), 401

        return f(current_user, *args, **kwargs)

    return decorated




            