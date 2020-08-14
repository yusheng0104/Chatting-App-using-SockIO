import os

from flask import Flask, jsonify, render_template, request, redirect, url_for
from flask_socketio import SocketIO, emit

app = Flask(__name__)
app.config["SECRET_KEY"] = os.getenv("SECRET_KEY")
socketio = SocketIO(app)

names = []
channels = []
channel_selected = []
messages = []
users = {}

#Default page was set to login page, users logged in will be listed in the page
@app.route("/", methods=["POST", "GET"])
def login():
    if request.method == "POST":
        username = request.form.get("username")
        if username not in names:
            names.append(username)
            return render_template("login.html", names=names)
        return render_template("error.html", message="Username existed!!")
    return render_template("login.html", names=names)

#Send messages, created and selected channel information to createchannel.html
@app.route("/login/<string:name_in_channel>", methods=["GET", "POST"])
def createchannel(name_in_channel):
    return render_template("createchannel.html", name0=name_in_channel, \
    channel_selected= channel_selected, channels=channels, messages=messages)

#Create a channel
@socketio.on('create-channel')
def addchannel(newchannel):
    if newchannel["channelname"] not in channels:
        channels.append(newchannel["channelname"])
        socketio.emit('newchannel', newchannel, broadcast=True)

#Join a channel
@socketio.on('join_channel')
def joinchannel(selchannel):
    if selchannel["selected_channel"] in channels:
        channel_selected.append(selchannel["selected_channel"])
        socketio.emit('selcchannel', selchannel, broadcast=True)

#Receive message from client, only list the most recent 100 massges
@socketio.on('events')
def handleEvent(msg):
    print('recived events:' + str(msg))
    messages.append(msg)
    if (len(messages) > 100):
        messages.pop(0)
    socketio.emit('responses', msg, broadcast=True)

#Receive username and set its session_id
@socketio.on('username', namespace='/private')
def receive_username(username):
    users[username] = request.sid

#Receive private message and send to the desinated recipient
@socketio.on('private_message', namespace='/private')
def private_message(msg):
    recipient_id = users[msg['username']]
    message = msg['message']
    emit('new_private_message', message, room=recipient_id)


if __name__ == "__main__":
    app.run()
