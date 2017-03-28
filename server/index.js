var io = require('socket.io'),
    http = require('http'),
    server = http.createServer(),
    io = io.listen(server);

    io.on('connection', function(socket){
      socket.join('some room');
      console.log('User connected');

      socket.on('disconnect', () => {
        console.log('User disconnected...');
      })


      socket.on('invite', (currBillAmount, totalBillAmount, groupname, address) => {
        io.emit('invit', {type: 'new-invite',currBillAmount: currBillAmount, totalBillAmount: totalBillAmount, groupname: groupname, address: address});
        console.log("currBillAmount= "+currBillAmount)
      })

      socket.on('items-updated', (currBillAmount, totalBillAmount, groupname, userAmount) => {
        io.emit('upDateItems', {type: 'items-update',currBillAmount: currBillAmount, totalBillAmount: totalBillAmount, groupname: groupname, userAmount: userAmount});
      })

    });


    server.listen(3000, function(){
      console.log('Server started');
    })
