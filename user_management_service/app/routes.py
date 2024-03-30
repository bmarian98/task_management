from flask import request, jsonify
from app import app
from app.db import User
from .login_required import token_required
import jwt




db = User()

@app.route('/')
def home():
    return jsonify({'profile': "user"}), 200

@app.route('/register', methods=['POST'])
def register():
    data = request.json
    username = data.get('username')
    password = data.get('password')
    gender = data.get('gender')
    nickname = data.get('nickname')

    if not username or not password or not gender:
        return jsonify({'error': 'Required filed wasn\'t provided'}), 400
    
    if db.find_user_by_credentials(username, password):
        return jsonify({'error': 'Username already exists'}), 400

    user_id = db.register_user(username, password, gender, nickname)
    return jsonify({'message': 'User registered successfully', 'user_id': user_id}), 201

@app.route('/users', methods=['GET'])
def get_all_user():
    try:
        users = db.find_all_users()
        for user in users:
            user['_id'] = str(user['_id'])
            user.pop('password', None)
            
        return jsonify({"message": "ok", "users": users}), 200
    except Exception as e:
        print(e)
        return jsonify({"message": "Error retrieving users"}), 500



@app.route('/login', methods=['POST'])
def login():
    try:
        data = request.json
        username = data.get('username')
        password = data.get('password')
        print("User: {} Pass: {}".format(username, password))

        if not username or not password:
            return jsonify({'error': 'Username and password are required'}), 400

        user = db.find_user_by_credentials(username, password)

        if user:
            
            token = jwt.encode({'user_id': str(user['_id'])}, app.config['SECRET_KEY'], algorithm='HS256')
            
            response = jsonify({'message': 'Login successful','token': token})
            response.set_cookie('token', token)
            return response
        else:
            return jsonify({'error': 'Invalid username or password'}), 401
    except Exception as e:
        print(f"Error during login: {e}")
        return jsonify({'error': 'Login failed'}), 400

@app.route('/profile', methods=['GET'])
@token_required
def get_profile(user):
    
    if not user:
        return jsonify({'error': 'User ID is required'}), 400

    #user = db.find_user_by_id(user_id)
    if user:
        user['_id'] = str(user['_id'])
        # Remove password before returning profile
        user.pop('password', None)
        return jsonify({'profile': user}), 200
    else:
        return jsonify({'error': 'User not found'}), 404

@app.route('/profile/update', methods=['PUT'])
@token_required
def update_profile(user):
    print("ajunge")
    data = request.json
    user_id = user['_id']
    print(user_id)
    new_password = data.get('password')

    if not user_id:
        return jsonify({'error': 'User ID is required'}), 400

    if db.update_user_password(user_id, new_password):
        return jsonify({'message': 'Profile updated successfully'}), 200
    else:
        return jsonify({'error': 'User not found'}), 404
    