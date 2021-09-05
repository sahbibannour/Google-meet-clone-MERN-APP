if (process.env.NODE_ENV != 'production') {
    require('dotenv').config();
}


const http = require('http');
const app = require('./app');
const axios = require('axios')
const port = 5000;
const apiUrl = `http://localhost:${port}`
const server = http.createServer(app);
const io = require('socket.io')(server, { cors: { origin: '*' } })

server.listen(port, () => {
    console.log('web socket is successfully launched')
    io.on('connection', (socket) => {

        socket.on("join room", async ({ roomID, user, state }) => {
            socket.join(roomID)
            let responseMeet = await axios.get(`${apiUrl}/meet/${roomID}`)
            let meet = responseMeet.data.meet
            if (!meet) {
                await axios.post(`${apiUrl}/meet`, { room: roomID, admin: user, users: [{ socketId: socket.id, user, state }] })

                meet = { room: roomID, users: [{ socketId: socket.id, user, state }] }

            } else {
                axios.patch(`${apiUrl}/meet/add-user/${roomID}`, { user: { socketId: socket.id, user: user, state } })
                meet.users.push({ socketId: socket.id, user: user, state });

            }
            const usersInTheRoom = meet.users.filter(user => user.socketId != socket.id)
            socket.emit("all users", usersInTheRoom);

            socket.on("user-disable-video", async ({ value }) => {

                socket.to(roomID).emit('disable-user-video', { userId: socket.id, value })
                await axios.patch(`${apiUrl}/meet/user-video/${roomID}`, { socketId: socket.id, value })


            })

            socket.on("user-disable-audio", async ({ value }) => {

                socket.to(roomID).emit('disable-user-audio', { userId: socket.id, value })
                await axios.patch(`${apiUrl}/meet/user-audio/${roomID}`, { socketId: socket.id, value })

            })

            socket.on("send-message-meet", async ({ message }) => {

                socket.to(roomID).emit('receive-message-meet', { message })

            })

            socket.on('disconnect', async () => {
                socket.to(roomID).emit('user-disconnect', socket.id)
                await axios.patch(`${apiUrl}/meet/remove-user/${roomID}`, { socketId: socket.id })
            })
        });
        socket.on('request-join-room', async ({ roomId, user }) => {
            const responseMeet = await axios.get(`${apiUrl}/meet/${roomId}`)
            let meet = responseMeet.data.meet
            const admins = meet.users.filter(userObj => userObj.user._id === meet.admin)
            admins.forEach(admin => {
                socket.to(admin.socketId).emit('request-received', { user, socketId: socket.id })
            })
        })

        socket.on('accept-user-request', ({ socketId }) => {
            socket.to(socketId).emit('request-accepted', { socketId })
        })
        socket.on("sending signal", payload => {
            io.to(payload.userToSignal).emit('user joined', { signal: payload.signal, callerID: payload.callerID, user: payload.user, state: payload.state });
        });

        socket.on("returning signal", payload => {
            io.to(payload.callerID).emit('receiving returned signal', { signal: payload.signal, id: socket.id, user: payload.user, state: payload.state });
        });

    })
})


