#!/usr/bin/python3
from flask import Flask, jsonify, request
from flask_cors import CORS

server = Flask(__name__)
CORS(server) # https://stackoverflow.com/a/46637194

@server.route('/api/chats/<int:chat_id>', methods=['GET'])
def get_chat(chat_id):
    response = []
    with open("./chats/"+str(chat_id)+".txt") as file:
        for line in file:
            response.append(line.rstrip())
    return jsonify({"messages":response})

@server.route('/api/chats/<int:chat_id>', methods=['POST'])
def receive_msg(chat_id):
    new_msg = request.json['msg']
    chOpen = open("./chats/"+str(chat_id)+".txt", "a")
    chOpen.write(new_msg+"\n")
    chOpen.close()
    return jsonify({'messaged': new_msg}), 201

if __name__ == "__main__":
    server.run(debug=False)
    