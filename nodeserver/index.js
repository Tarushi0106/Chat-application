const io = require('socket.io')(8000, {
    cors: {
        origin: "http://127.0.0.1:5500",
        methods: ["GET", "POST"]
    }
});

const users = {};

io.on("connection", socket => {
    console.log("New connection:", socket.id);

    socket.on("new-user-joined", name => {
        console.log("New user joined:", name);
        users[socket.id] = name;
        console.log("Current users:", users);
        socket.broadcast.emit('user-joined', name);  // Notify all other users
    });

    socket.on('send', message => {
        console.log("Message received:", message);
        socket.broadcast.emit('receive', { message: message, name: users[socket.id] });  // Broadcast message
    });

    socket.on('disconnect', () => {
        console.log("User disconnected:", users[socket.id]);
        delete users[socket.id];
        console.log("Current users:", users);
    });
});