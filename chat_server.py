#!/usr/bin/python3
from flask import Flask, jsonify, request, send_from_directory
from flask_cors import CORS

server = Flask(__name__)
CORS(server)  # https://stackoverflow.com/a/46637194


@server.route("/api/v0/chats/<int:chat_id>", methods=["GET"])
def get_chat(chat_id):
    response = []
    with open("./chats/" + str(chat_id) + ".txt") as file:
        for line in file:
            response.append(line.rstrip())  # append to array and strip of newline
    return jsonify({"messages": response})

@server.route("/api/v0/chats/<int:chat_id>", methods=["POST"])
def receive_msg(chat_id):
    new_msg = request.json["msg"]
    chOpen = open("./chats/" + str(chat_id) + ".txt", "a")
    chOpen.write(new_msg + "\n")
    chOpen.close()
    return jsonify({"messaged": new_msg}), 201

@server.route("/")
def index():
    return send_from_directory("static", "index.html")

if __name__ == "__main__":
    server.run(debug=False)
