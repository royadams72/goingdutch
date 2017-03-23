var io = require('socket.io'),
    http = require('http'),
    server = http.createServer(),
    io = io.listen(server);

    io.on('connection', function(socket){
      console.log('User connected');

      socket.on('disconnect', () => {
        console.log('User disconnected...');
      })

      socket.on('message', (message, username) => {
        io.emit('message', {type: 'new-message', text: message, username: username});
      })
    });


    server.listen(3000, function(){
      console.log('Server started');
    })
