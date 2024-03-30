import os
from pymongo import MongoClient
from bson.objectid import ObjectId

MONGO_URI = os.environ.get('MONGO_URI', 'mongodb://localhost:27017/')

class Task:
    def __init__(self):
        self.client = MongoClient(MONGO_URI)
        self.db = self.client['task_databse']
        self.tasks_collection = self.db['tasks']

    def create_task(self, title, description, user_id, owner_id):           
        new_task = {
            "title": title,
            "description": description,
            "assignedTo": ObjectId(user_id),
            "owner": ObjectId(owner_id),
            "completed": False,
        }
        self.tasks_collection.insert_one(new_task)
            

    def get_all_tasks(self):
        return list(self.tasks_collection.find())
    
    def get_task_by_task_id(self, task_id):
        task_id = ObjectId(task_id)
        return self.tasks_collection.find_one({"_id": task_id})
    
    def get_tasks_by_user(self, user_id):
        _id = ObjectId(user_id)
        return list(self.tasks_collection.find({"assignedTo": _id})) 


    def update_task_status(self, task_id, new_status):
        _id = ObjectId(task_id)
        update_result = self.tasks_collection.update_one({"_id": _id}, {"$set": {"completed": new_status}})
               

    def delete_task(self, task_id):
        _id = ObjectId(task_id)
        delete_result = self.tasks_collection.delete_one({"_id": _id})
           
