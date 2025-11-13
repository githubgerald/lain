#!/usr/bin/python3
from flask import Flask, jsonify, request, send_from_directory
from flask_cors import CORS

server = Flask(__name__)
CORS(server)  # https://stackoverflow.com/a/46637194

# serverside
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

# clientside
@server.route("/")
def get_webcli_index():
    return send_from_directory("static", "index.html")
@server.route("/assets/<asset_type>/<asset_file>", methods=["GET"])
def get_webcli_assets(asset_type, asset_file):
    return send_from_directory("assets/"+asset_type, asset_file)

if __name__ == "__main__":
    server.run(debug=False)
