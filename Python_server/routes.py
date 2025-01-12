from flask import jsonify, request
from app import app

@app.route('/')
def index():
    return jsonify({
        "status": "ok",
        "message": "A5 Browser Automation Server is running"
    })

@app.route('/health')
def health_check():
    return jsonify({
        "status": "healthy",
        "version": "1.0.0"
    })

@app.route('/api/execute', methods=['POST'])
def execute_command():
    data = request.get_json()
    if not data or 'command' not in data:
        return jsonify({
            "status": "error",
            "message": "No command provided"
        }), 400
    
    # TODO: Implement browser automation logic here
    return jsonify({
        "status": "success",
        "message": "Command received",
        "command": data['command']
    })

@app.errorhandler(404)
def not_found(error):
    return jsonify({
        "status": "error",
        "message": "Endpoint not found"
    }), 404

@app.errorhandler(500)
def server_error(error):
    return jsonify({
        "status": "error",
        "message": "Internal server error"
    }), 500
