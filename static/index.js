document.addEventListener('DOMContentLoaded', () => {
  // Connect to websocket
  var socket = io.connect(location.protocol + '//' + document.domain + ':' + location.port);
  //When connected, configure buttons
  socket.on('connect', () => {
    document.querySelector('#create-channel').onclick = () => {
      const name = document.querySelector('#newchannel').value;
      socket.emit('create-channel', { 'channelname': name });
      document.querySelector('#newchannel').value = "";
      return false;
    };


    document.querySelector('#button3').onclick = () => {
      const sel_channel = document.querySelector('#joinchannel').value;
      localStorage.setItem('channel', sel_channel);
      var channel_joined =  localStorage.getItem("channel");
      socket.emit('join_channel', { 'selected_channel': channel_joined});
      document.querySelector('#joinchannel').value = "";
      return false;

    };

    document.querySelector('#button2').onclick = function () {
      //Obtain the username and message
      let name = document.querySelector('#username').innerText;
      let message = document.querySelector('#message').value;
      //Obtain the timeofstamp
      const date0 = new Date();
      function addZero(i) {
        if (i < 10) {
          i = "0" + i;
        }
        return i;
      }
      seconds = date0.getSeconds()
      const mytime = date0.getFullYear() + "-" +
        (addZero(date0.getMonth() + 1)) + "-" +
        date0.getDate() + " at " +
        date0.getHours() + ":" +
        date0.getMinutes() + ":" +
        addZero(date0.getSeconds());
      //Send username, timeofstamp and message to server
      socket.emit('events', {
        username: name,
        inputmessage: message,
        timeofstamp: mytime
      })
      document.querySelector('#message').value = "";
      return false;
    };
  });
  // receive channel added
  socket.on('newchannel', function (data) {
    if (data.channelname !== "") {
      const ol = document.createElement('ol');
      ol.innerHTML = `${data.channelname}`;
      document.querySelector('#channel_list').append(ol);
    };
  });

  //Join an existed channel
  socket.on('selcchannel', function (data) {
    const ol = document.createElement('ol');
    ol.innerHTML = data.selected_channel;
    document.querySelector("#chatchannel").append(ol);

  });

  //Send the messages to the webpage
  socket.on('responses', function (msg) {
    if (typeof msg.username !== 'undefined') {
      const ol = document.createElement('ol');
      ol.innerHTML = `${msg.timeofstamp}: ${msg.username} says: ${msg.inputmessage}`;
      document.querySelector('#messages').append(ol);
    };
  });

 //Set up private message using name
  var private_socket = io('http://127.0.0.1:5000/private')
  private_socket.emit('username', document.querySelector('#username').innerText);

  document.querySelector('#send_private_message').onclick = function () {
    var recipient = document.querySelector('#send_to_username').value;
    var message_to_send = document.querySelector('#private_message').value;

    private_socket.emit('private_message', { 'username': recipient, 'message': message_to_send });
  };
  //send message to the recipient
  private_socket.on('new_private_message', function (data) {
    alert(data);
  });
});
