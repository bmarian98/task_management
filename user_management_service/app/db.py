import os
from pymongo import MongoClient
from bson.objectid import ObjectId

MONGO_URI = os.environ.get('MONGO_URI', 'mongodb://localhost:27017/')

class User:
    def __init__(self):
        self.client = MongoClient(MONGO_URI)
        self.db = self.client['user_database']
        self.users_collection = self.db['users']

    def register_user(self, username, password, gender, nickname):
        user_data = {'username': username, 'password': password, 'gender': gender, 
                     'nickname': nickname}
        result = self.users_collection.insert_one(user_data)
        return str(result.inserted_id)
    
    def find_all_users(self):
        return list(self.users_collection.find())  # Fetch all users

    def find_user_by_credentials(self, username, password):
        return self.users_collection.find_one({'username': username, 'password': password})

    def find_user_by_id(self, user_id):
        return self.users_collection.find_one({'_id': ObjectId(user_id)})

    def update_user_password(self, user_id, new_password):
        result = self.users_collection.update_one({'_id': ObjectId(user_id)}, {'$set': {'password': new_password}})
        return result.modified_count > 0
    
