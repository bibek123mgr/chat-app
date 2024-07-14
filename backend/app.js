const express = require('express');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const connection = require('./database/connection.js');
const authMiddleware = require('./middleware/authMiddleware.js');
const { PORT } = require('./config/config.js');
const { Server } = require('socket.io');
const app = express();
const Port = PORT || 3000;

app.use(express.json());
app.use(cookieParser());
connection();

const corsOptions = {
  origin: 'http://localhost:5173',
  credentials: true,
};

app.use(cors(corsOptions));

//routes import
const authRoute = require('./routes/auth/authRoute.js');
const profileRoute = require('./routes/user/userRoute.js');
const groupRoute = require('./routes/user/groupRoute.js');
const requestRoute = require('./routes/user/requestRoute.js');
const messageController = require('./routes/user/messageRoute.js');

app.use('/api/v1/auth', authRoute);
app.use('/api/v1', profileRoute, groupRoute, requestRoute, messageController);

const server = app.listen(Port, () => {
  console.log('I am listening on port', Port);
});

const userSocketIDs = new Map();
const onlineUsers = new Set();

const io = new Server(server, {
  cors: {
    origin: 'http://localhost:5173',
    methods: ['GET', 'POST'],
    credentials: true,
  },
});

io.use((socket, next) => {
  cookieParser()(socket.request, socket.request.res || {}, (err) => {
    if (err) return next(err);
    authMiddleware.isAuthSocket(socket, next);
  });
});

io.on('connection', (socket) => {
  const userId = socket.request.user.id; // Assuming `isAuthSocket` sets `user` in `socket.request`
  userSocketIDs.set(userId, socket.id);
  console.log(userSocketIDs);

  socket.on('NEW_USER', (data) => {
    console.log(data);
    socket.emit('NEW_USER', { data });
  });

  socket.on('disconnect', () => {
    userSocketIDs.delete(userId);
  });
});
