#!/usr/bin/python3
from flask import Flask, jsonify, request, send_from_directory
from flask_cors import CORS
import json
import os
from datetime import datetime

server = Flask(__name__)
CORS(server)

# Helper function to ensure JSON file exists
def ensure_chat_file(chat_id):
    filepath = f"./chats/{chat_id}.json"
    if not os.path.exists(filepath):
        with open(filepath, 'w') as f:
            json.dump({"messages": []}, f)
    return filepath

# GET: Retrieve all messages from a chat
@server.route("/api/v0/chats/<int:chat_id>", methods=["GET"])
def get_chat(chat_id):
    filepath = ensure_chat_file(chat_id)
    
    try:
        with open(filepath, 'r') as file:
            data = json.load(file)
        return jsonify(data), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500

# POST: Add a new message to a chat
@server.route("/api/v0/chats/<int:chat_id>", methods=["POST"])
def receive_msg(chat_id):
    filepath = ensure_chat_file(chat_id)
    
    # Get the message data from request
    new_msg_data = request.json
    
    # Add timestamp if not provided
    if 'timestamp' not in new_msg_data:
        new_msg_data['timestamp'] = datetime.now().isoformat()
    
    # Add date if not provided
    if 'date' not in new_msg_data:
        new_msg_data['date'] = datetime.now().strftime("%d/%m/%Y")
    
    # Add time if not provided
    if 'time' not in new_msg_data:
        new_msg_data['time'] = datetime.now().strftime("%H:%M")
    
    try:
        # Read existing messages
        with open(filepath, 'r') as file:
            data = json.load(file)
        
        # Append new message
        data['messages'].append(new_msg_data)
        
        # Write back to file
        with open(filepath, 'w') as file:
            json.dump(data, file, indent=2)
        
        return jsonify({"success": True, "message": new_msg_data}), 201
    
    except Exception as e:
        return jsonify({"error": str(e)}), 500

# Serve static files
@server.route("/")
def get_webcli_index():
    return send_from_directory("static", "index.html")

@server.route("/static/<path:filename>")
def get_static(filename):
    return send_from_directory("static", filename)

@server.route("/assets/<asset_type>/<asset_file>", methods=["GET"])
def get_webcli_assets(asset_type, asset_file):
    return send_from_directory(f"assets/{asset_type}", asset_file)

if __name__ == "__main__":
    # Create chats directory if it doesn't exist
    os.makedirs("chats", exist_ok=True)
    server.run(debug=True, port=5000)