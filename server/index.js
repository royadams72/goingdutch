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
      socket.join(groupname);
      io.sockets.in(groupname).emit('invit', {type: 'new-invite',currBillAmount: currBillAmount, totalBillAmount: totalBillAmount, groupname: groupname, address: address});
        console.log("groupname= "+groupname)
      })

      socket.on('items-updated', (currBillAmount, totalBillAmount, groupname, userAmount, username) => {
      io.sockets.in(groupname).emit('upDateItems', {type: 'items-update',currBillAmount: currBillAmount, totalBillAmount: totalBillAmount, groupname: groupname, userAmount: userAmount, username: username});
      })

    });


    server.listen(3000, function(){
      console.log('Server started');
    })
