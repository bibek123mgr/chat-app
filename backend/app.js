const express = require('express');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const connection = require('./database/connection.js');
const authMiddleware = require('./middleware/authMiddleware.js');
const { PORT } = require('./config/config.js');
const { Server } = require('socket.io');
const app = express();
const port = PORT || 3000;

app.use(express.json());
app.use(cookieParser());
connection();

const corsOptions = {
  origin: 'http://localhost:5173',
  credentials: true,
  methods: ["POST", "GET", "PATCH", "DELETE"]
};


app.use(cors(corsOptions));

// Routes import
const authRoute = require('./routes/auth/authRoute.js');
const profileRoute = require('./routes/user/userRoute.js');
const groupRoute = require('./routes/user/groupRoute.js');
const requestRoute = require('./routes/user/requestRoute.js');
const messageRoute = require('./routes/user/messageRoute.js');
const { getMembers } = require('./lib/helper.js');
const messageController = require('./controllers/user/messageController.js');

app.use('/api/v1/auth', authRoute);
app.use('/api/v1', profileRoute, groupRoute, requestRoute, messageRoute);

const server = app.listen(port, () => {
  console.log('I am listening on port', port);
});

const userSocketIDs = new Map();

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

io.on('connection', (socket,next) => {
  const userId = socket.request.user.id;
  userSocketIDs.set(userId, socket.id);
  socket.on('NEW_USER', (data) => {
    console.log('New user data:', data);
    socket.emit('NEW_USER', { data });
  });

  socket.on('NEW_MESSAGE', async (data) => {
    try {
      const chatsData = await messageController.sendMessage(data.content, data.id, userId)
      console.log(chatsData)
      const members = await getMembers(data.id);
        const flatMembers = members.flat();
        for (const memberId of flatMembers) {
          const stringId=memberId.toString()
          const socketId = userSocketIDs.get(stringId);
          if (socketId) {
            io.to(socketId).emit('NEW_MESSAGE',chatsData);
          } 
        }
    } catch (error) {
      console.error('Error fetching members:', error);
    }
  });

  socket.on('disconnect', () => {
    userSocketIDs.delete(userId);
  });
});
