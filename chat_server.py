#!/usr/bin/python3
from flask import Flask, jsonify, request
import os

os.system('clear')
HOST=str("127.0.0.1") # ignore
PORT=int(5010) # ignore
app = Flask(__name__)

@app.route('/api/chats/<int:chat_id>', methods=['GET'])
def get_chat(chat_id):
    chOpen = open("./chats/"+str(chat_id)+".txt")#
    chRead = chOpen.read()
    chOpen.close()
    return jsonify({'messages': chRead})

@app.route('/api/chats/<int:chat_id>', methods=['POST'])
def receive_msg(chat_id):
    new_msg = request.json['msg']
    chOpen = open("./chats/"+str(chat_id)+".txt", "a")
    chOpen.write(new_msg+"\n")
    chOpen.close()
    return jsonify({'messaged': new_msg}), 201

if __name__ == "__main__":
    app.run(debug=True)