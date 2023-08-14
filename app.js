import express from "express"
import cors from "cors"
import {Server} from "socket.io"
import http from "http"

const app=express()
const port=4000||process.env.PORT


let users=[{}]
app.use(cors())



const server=http.createServer(app)

const io=new Server(server)

io.on("connection",(socket)=>{
    console.log("New Connection")

    socket.on('joined',({user})=>{
        users[socket.id]=user
        console.log(`${user} has Joined`)
        socket.broadcast.emit('userJoined',({user:"Admin",message:`${users[socket.id]} has joined`}))
        socket.emit('welcome',({user:"Admin",message:`Welcome to the chat,${users[socket.id]}`}))
    })

    socket.on('message',({message,id})=>{
        io.emit('sendMessage',{user:users[id],message,id})
    })

    socket.on('disconect',()=>{
        socket.broadcast.emit('leave',({user:"Admin",message:`${users[socket.id]} has left`}))
        console.log("User left")
    })

})



server.listen(port,()=>{
    console.log(`Server is Listening on port:${port}`)
})
