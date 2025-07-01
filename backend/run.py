from flask import Flask
from flask_cors import CORS # For allowing requests from your frontend
import os
from dotenv import load_dotenv # For loading environment variables

# Load environment variables from a .env file (we'll create this next)
load_dotenv()

# Create an instance of the Flask application
app = Flask(__name__)

# Enable Cross-Origin Resource Sharing (CORS) for your app.
# This allows your React frontend (running on a different port) to make requests to this backend.
CORS(app)

# Define a simple route for the root URL ('/')
@app.route('/')
def hello():
    return "Hello from FocusFlow Backend!" # This is what you'll see in the browser

# Define another simple API test route
@app.route('/api/test')
def api_test():
    # This route returns JSON data, common for APIs
    return {"message": "API is working!"}

# This block ensures the server only runs when the script is executed directly
# (not when imported as a module)
if __name__ == '__main__':
    # Get the port from an environment variable, or default to 5001
    # Using a different port than React (often 3000) avoids conflicts.
    port = int(os.environ.get('FLASK_RUN_PORT', 5001))
    # Run the Flask development server
    # debug=True enables auto-reloading on code changes and provides a debugger.
    # host='0.0.0.0' makes the server accessible from other devices on your network.
    app.run(debug=True, host='0.0.0.0', port=port)