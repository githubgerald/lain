#!/usr/bin/python3
from flask import Flask, jsonify, request
from flask_cors import CORS
import os

HOST=str("127.0.0.1") # ignore
PORT=int(5010) # ignore
server = Flask(__name__)
CORS(server)

@server.route('/api/chats/<int:chat_id>', methods=['GET'])
def get_chat(chat_id):
    chOpen = open("./chats/"+str(chat_id)+".txt")
    chRead = chOpen.read()
    chOpen.close()
    response = jsonify({'messages': chRead})
    return response

@server.route('/api/chats/<int:chat_id>', methods=['POST'])
def receive_msg(chat_id):
    new_msg = request.json['msg']
    chOpen = open("./chats/"+str(chat_id)+".txt", "a")
    chOpen.write(new_msg+"\n")
    chOpen.close()
    return jsonify({'messaged': new_msg}), 201

if __name__ == "__main__":
    server.run(debug=False)
    