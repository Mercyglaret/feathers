const feathers = require('@feathersjs/feathers');
const express = require('@feathersjs/express');
const socketio = require('@feathersjs/socketio');
const moment = require('moment');


//service
const api = express(feathers())
  .configure(express.rest())
  .use('/service', myService);

const app = express().use('/api/v1', api);

// Now call setup on the Feathers app with the server
api.setup(server);

//parse json
app.use(express.json());

//config Socket.io
app.configure(socketio());

//enable rest service
app.configure(express.rest());

//Register service
app.use('/todos', {
    async get(id) {
      return { id };
    }
  });


const mainApp = feathers();

mainApp.configure(socketio(function(io) {
  io.on('connection', function(socket) {
    socket.emit('news', { text: 'A client connected!' });
    socket.on('my other event', function (data) {
      console.log(data);
    });
  });
  
  // Registering Socket.io middleware
  io.use(function (socket, next) {
    // Exposing a request property to services and hooks
    socket.feathers.referrer = socket.request.referrer;
    next();
  });
}));

mainApp.listen(3030);

// Listen on port 3030
const server = app.listen(3030);

server.on('listening', () => console.log('Feathers application started'));