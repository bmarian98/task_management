from flask import request, jsonify
from app import app
from app.db import Task

task_manager = Task()

@app.route('/')
def home():
    return jsonify({'tasks': "service is working"}), 200

@app.route("/create_task", methods=["POST"])
def create_task():
    data = request.get_json()

    title = data.get("title")
    description = data.get("description")  
    user_id = data.get("assignedTo")
    owner = data.get("owner_id")

    task_manager.create_task(title, description, user_id, owner)
    return jsonify({"message": "Task created successfully"}), 201 

# Get all tasks
@app.route("/tasks", methods=["GET"])
def get_tasks():
    tasks = task_manager.get_all_tasks()
    for task in tasks:
        task['_id'] = str(task['_id'])
        task['assignedTo'] = str(task['assignedTo'])
        task['owner'] = str(task['owner'])
    return jsonify({"tasks": tasks}), 200

@app.route("/task/<task_id>", methods=["GET"])
def get_taks_by_task_id(task_id):
    task = task_manager.get_task_by_task_id(task_id)
    task['_id'] = str(task['_id'])
    task['assignedTo'] = str(task['assignedTo'])
    task['owner'] = str(task['owner'])

    return jsonify({"message": "ok", "task": task}), 200


@app.route("/tasks/<user_id>", methods=["GET"])
def get_tasks_by_user_id(user_id):
    tasks = task_manager.get_tasks_by_user(user_id)
    for task in tasks:
        task['_id'] = str(task['_id'])
        task['assignedTo'] = str(task['assignedTo'])
        task['owner'] = str(task['owner'])
    return jsonify({"tasks" : tasks}), 200

# Update task status
@app.route("/tasks/<task_id>/status", methods=["PUT"])
def update_task_status(task_id):
    data = request.get_json()
    if "completed" not in data:
        return jsonify({"message": "Missing 'completed' field in request body"}), 400
    new_status = bool(data["completed"])
    task_manager.update_task_status(task_id, new_status)

    # if update_result.matched_count == 0:
    #     return jsonify({"message": "Task not found"}), 404
    
    return jsonify({"message": "Task status updated successfully"}), 200


# Delete task
@app.route("/tasks/<task_id>", methods=["DELETE"])
def delete_task(task_id):
    task_manager.delete_task(task_id)
    return jsonify({"message": "Task was deleted"}), 200