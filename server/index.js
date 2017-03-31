var io = require('socket.io'),
    http = require('http'),
    server = http.createServer(),
    io = io.listen(server);

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
            // var clients = io.sockets.clients(groupname); // all users from room `room`
            //  console.log(clients);
         });

      socket.on('update-receipt', (currBillAmount, totalBillAmount, groupname, userAmount, username) => {
          console.log("Sent on= "+groupname);
        // all users from room `room`

      io.sockets.in(groupname).emit('receipt-updated', {type: 'receipt-updated',currBillAmount: currBillAmount, totalBillAmount: totalBillAmount, groupname: groupname, userAmount: userAmount, username: username});
      })

    });


    server.listen(3000, function(){
      console.log('Server started');
    })
