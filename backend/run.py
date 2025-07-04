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


# This block ensures the server only runs when the script is executed directly
if __name__ == '__main__':
    port = int(os.environ.get('FLASK_RUN_PORT', 5001))
    app.run(debug=True, host='0.0.0.0', port=port)