# Chatting APP using Python and SockIO


In this package, the files included are listed as following:

application.py: In this file, usernames, created channels, channel for joining, and messages are stored in list.
Users for private message and its session_id is stored in a dict.
Socketio.on createchannel, join_channel, msg events, private_message and its recipient were included.
The most recent 100 messages were controled in handleEvent()

login.html: Login.html was set to default page for the server. If logged in, the username will be stored on webpage,
can could link to createchannel page.

createchannel.html: In this page, a channel could be created, and an existed channel could be joined. Also a chat window, 
and a place for sending private message were also included.

error.html: Throw error message

layout.html: template for other html, not well appled to other pages due to limited time

index.js


Work not done well:
Join channel function is not completed. Failed to removed the stored channel information generated by previous users. Because of that,
the join channel function couldn't be set up.



