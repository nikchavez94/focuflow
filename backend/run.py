# focuflow/backend/run.py

# We need to import 'request' and 'jsonify' from flask
from flask import Flask, request, jsonify
from flask_cors import CORS
import os
from dotenv import load_dotenv

# --- NEW: Import Firebase Admin SDK modules ---
import firebase_admin
from firebase_admin import credentials, firestore, auth

# Load environment variables from a .env file
load_dotenv()

# --- NEW: Initialize Firebase Admin SDK ---
# The credentials.Certificate() function uses your key file to authenticate.
cred = credentials.Certificate("serviceAccountKey.json")
firebase_admin.initialize_app(cred)
# Get a reference to the Firestore database service
db = firestore.client()
# --- End of NEW ---


# Create an instance of the Flask application
app = Flask(__name__)
CORS(app)

def check_project_ownership(project_id, uid):
    """Checks if a user (uid) owns a specific project (project_id). Returns True or False."""
    project_ref = db.collection('projects').document(project_id)
    project_doc = project_ref.get()
    if not project_doc.exists:
        # The project doesn't even exist
        return False
    
    project_data = project_doc.to_dict()
    if project_data.get('ownerId') == uid:
        # The ownerId on the project matches the user's ID
        return True
    
    return False

# --- Define API Routes ---

@app.route('/')
def hello():
    return "Hello from FocusFlow Backend!"


@app.route('/api/test')
def api_test():
    return {"message": "API is working!"}


# --- NEW: User Registration Route ---
@app.route('/api/auth/register', methods=['POST'])
def register_user():
    try:
        # Get user data (email, password, name) from the request's JSON body
        data = request.get_json()
        email = data['email']
        password = data['password']
        # Use .get() for optional fields like 'name' to avoid errors if they're missing
        name = data.get('name', 'Anonymous User')

        # --- Firebase Authentication Part ---
        # Create a new user in the Firebase Authentication service
        user = auth.create_user(
            email=email,
            password=password,
            display_name=name
        )

        # --- Firestore Database Part ---
        # Now, create a corresponding user profile document in the Firestore database
        # We use the unique ID (uid) from the created auth user as the document ID
        user_ref = db.collection('users').document(user.uid)
        user_ref.set({
            'uid': user.uid,
            'email': user.email,
            'name': name,
            'createdAt': firestore.SERVER_TIMESTAMP  # Records the creation time
        })

        # Return a success message and the new user's UID
        return jsonify({"message": f"User {user.email} created successfully", "uid": user.uid}), 201

    except Exception as e:
        # Handle potential errors (e.g., email already exists)
        return jsonify({"error": str(e)}), 400
# --- End of NEW ---


# --- NEW: A Protected Route for Authenticated Users ---
@app.route('/api/protected')
def protected_route():
    try:
        # The frontend will send an "Authorization" header with the token.
        # The format is "Bearer <ID_TOKEN>".
        auth_header = request.headers.get('Authorization')
        if not auth_header:
            return jsonify({"error": "No authorization token provided"}), 401 # 401 Unauthorized

        # Split "Bearer" from the token string
        id_token = auth_header.split(' ').pop()
        
        # --- Firebase Token Verification Part ---
        # Use the Firebase Admin SDK to verify the token.
        # This checks if the token is valid and hasn't expired.
        # It also decodes the token to get the user's information (like their uid).
        decoded_token = auth.verify_id_token(id_token)
        
        # Get the user's unique ID from the decoded token
        uid = decoded_token['uid']
        
        # Now you know who the user is! You can fetch their data from Firestore, etc.
        # For this test, we'll just return a success message with their UID.
        return jsonify({"message": f"Welcome! You are authenticated as user {uid}", "uid": uid}), 200

    except auth.InvalidIdTokenError:
        # The token was invalid (e.g., expired, tampered with).
        return jsonify({"error": "Invalid token"}), 403 # 403 Forbidden
    except Exception as e:
        return jsonify({"error": f"An error occurred: {str(e)}"}), 500
# --- End of NEW ---

# Endpoint to CREATE a new project
@app.route('/api/projects', methods=['POST'])
def create_project():
    try:
        # First, verify the user is authenticated
        auth_header = request.headers.get('Authorization')
        if not auth_header:
            return jsonify({"error": "Authorization token required"}), 401
        
        id_token = auth_header.split(' ').pop()
        decoded_token = auth.verify_id_token(id_token)
        uid = decoded_token['uid']

        # Get project data from the request
        data = request.get_json()
        project_name = data.get('name')
        if not project_name:
            return jsonify({"error": "Project name is required"}), 400

        # Create the project document data
        project_data = {
            'name': project_name,
            'ownerId': uid, # Link the project to the logged-in user
            'createdAt': firestore.SERVER_TIMESTAMP
        }

        # Add the new project to the 'projects' collection in Firestore
        projects_collection = db.collection('projects')
        projects_collection.add(project_data)

        return jsonify({"message": "Project created successfully"}), 201

    except auth.InvalidIdTokenError:
        return jsonify({"error": "Invalid token"}), 403
    except Exception as e:
        return jsonify({"error": f"An error occurred: {str(e)}"}), 500


# Endpoint to GET all projects for the logged-in user
@app.route('/api/projects', methods=['GET'])
def get_projects():
    try:
        # Verify the user is authenticated
        auth_header = request.headers.get('Authorization')
        if not auth_header:
            return jsonify({"error": "Authorization token required"}), 401
        
        id_token = auth_header.split(' ').pop()
        decoded_token = auth.verify_id_token(id_token)
        uid = decoded_token['uid']

        # Query the 'projects' collection for documents where 'ownerId' matches the user's uid
        projects_collection = db.collection('projects')
        user_projects_query = projects_collection.where('ownerId', '==', uid)
        
        projects = []
        for doc in user_projects_query.stream():
            project_data = doc.to_dict()
            project_data['id'] = doc.id # Add the document ID to the data
            projects.append(project_data)

        return jsonify(projects), 200
    
    except auth.InvalidIdTokenError:
        return jsonify({"error": "Invalid token"}), 403
    except Exception as e:
        return jsonify({"error": f"An error occurred: {str(e)}"}), 500
# Endpoint to GET all tasks for a specific project
@app.route('/api/projects/<project_id>/tasks', methods=['GET'])
def get_tasks_for_project(project_id):
    try:
        # First, verify the user is authenticated
        auth_header = request.headers.get('Authorization')
        id_token = auth_header.split(' ').pop()
        decoded_token = auth.verify_id_token(id_token)
        uid = decoded_token['uid']

        
        if not check_project_ownership(project_id, uid):
            return jsonify({"error": "User does not have access to this project"}), 403 

        # Query the 'tasks' collection for tasks matching the project_id
        tasks_collection = db.collection('tasks')
        project_tasks_query = tasks_collection.where('projectId', '==', project_id)
        
        tasks = []
        for doc in project_tasks_query.stream():
            task_data = doc.to_dict()
            task_data['id'] = doc.id
            tasks.append(task_data)
        
        return jsonify(tasks), 200

    except Exception as e:
        return jsonify({"error": f"An error occurred: {str(e)}"}), 500


# Endpoint to CREATE a new task in a specific project
@app.route('/api/projects/<project_id>/tasks', methods=['POST'])
def create_task_for_project(project_id):
    try:
        # Verify user authentication
        auth_header = request.headers.get('Authorization')
        id_token = auth_header.split(' ').pop()
        decoded_token = auth.verify_id_token(id_token)
        uid = decoded_token['uid']
        
        # --- COMPLETE THE TODO ---
        if not check_project_ownership(project_id, uid):
            return jsonify({"error": "User does not have access to this project"}), 403 # 403 Forbidden
        # --------------------------

        # Get task data from the request body
        data = request.get_json()
        title = data.get('title')
        if not title:
            return jsonify({"error": "Task title is required"}), 400

        # Create the task data, linking it to the project
        task_data = {
            'title': title,
            'description': data.get('description', ''),
            'status': data.get('status', 'todo'),
            'priority': data.get('priority', 'medium'),
            'dueDate': data.get('dueDate', None),
            'projectId': project_id,
            'ownerId': uid,
            'createdAt': firestore.SERVER_TIMESTAMP
        }

        tasks_collection = db.collection('tasks')
        tasks_collection.add(task_data)
        
        return jsonify({"message": "Task created successfully"}), 201

    except Exception as e:
        return jsonify({"error": f"An error occurred: {str(e)}"}), 500
    
# This block ensures the server only runs when the script is executed directly
if __name__ == '__main__':
    port = int(os.environ.get('FLASK_RUN_PORT', 5001))
    app.run(debug=True, host='0.0.0.0', port=port)