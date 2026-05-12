const { getIO } = require('./socket');

const initVideoSocket = () => {
  const io = getIO();

  io.on('connection', (socket) => {
    // Signaling for Video Calls
    socket.on('call-user', ({ to, offer }) => {
      socket.to(to).emit('incoming-call', { from: socket.user.id, offer });
    });

    socket.on('answer-call', ({ to, answer }) => {
      socket.to(to).emit('call-answered', { from: socket.user.id, answer });
    });

    socket.on('ice-candidate', ({ to, candidate }) => {
      socket.to(to).emit('ice-candidate', { from: socket.user.id, candidate });
    });

    socket.on('end-call', ({ to }) => {
      socket.to(to).emit('call-ended', { from: socket.user.id });
    });
  });
};

module.exports = { initVideoSocket };
