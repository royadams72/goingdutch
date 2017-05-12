var io = require('socket.io'),
    http = require('http'),
    server = http.createServer();
    io(server, 'origins', 'https://going-dutch.herokuapp.com:* http://localhost:*');
    io({transports: [ 'websocket', 'xhr-polling']});
    io = io.listen(server);
var port = process.env.PORT || 3000; // Use the port that Heroku provides or default to 3000
    io.sockets.on('connection', function(socket){
      //socket.join('groupname');
      console.log('User connected');

    socket.on('disconnect', () => {
        console.log('User disconnected...');
    })

    socket.on('invite', (currBillAmount, totalBillAmount, groupname, address) => {
      io.emit('invit', {type: 'new-invite',currBillAmount: currBillAmount, totalBillAmount: totalBillAmount, groupname: groupname, address: address});

    })

    socket.on('group', function(groupname) {
             socket.join(groupname);
         });

    socket.on('completed', function(groupname) {
      io.sockets.in(groupname).emit('receipt-completed',{type: 'completed-receipt'});
        io.of('/').in(groupname).clients(function(error, clients){
         if (error) throw error;
           for(var i=0; i <clients.length; i++){
              io.sockets.connected[clients[i]].disconnect(true)
           }
        });
    });

    socket.on('update-receipt', (totalBillAmount, groupname, userAmount, username) => {
          console.log("Sent on= "+groupname);
      io.sockets.in(groupname).emit('receipt-updated', {type: 'receipt-updated', totalBillAmount: totalBillAmount, groupname: groupname, userAmount: userAmount, username: username});
      })
    });

    server.listen(port, function(){
      console.log('Server started');
    })
