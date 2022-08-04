const express=require('express');
const app=express();
const http=require('http');
const server=http.createServer(app);
const { Server }=require('socket.io');
const io=new Server(server);

app.get('/',(req,res)=>{
    res.sendFile(__dirname+'/index.html');
});

io.on('connection', (socket) => {
    socket.client.nick = socket.client.id;
    console.log('usuario conectado');
    let date=new Date();
    date=`${date.getFullYear()}/${date.getMonth()+1}/${date.getDate()} ${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}`;
    //console.log(date);
    io.emit('chat message', '['+date+']'+' '+ socket.client.nick + " entrou");

    socket.on('chat message', (msg) => {
        let date=new Date();
        date=`${date.getFullYear()} / ${date.getMonth()+1} / ${date.getDate()} ${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}`;
        console.log('sid: ' + socket.client.id + '\tmessage: ' + msg);
        io.emit('chat message', '['+date+']'+' '+ socket.client.nick + " disse: " + msg);
    });

    socket.on('set nick', (msg) => {
        const oldNick = socket.client.nick
        io.emit('chat message', `${oldNick} trocou seu nome para ${msg}`);
        socket.client.nick = msg;
    });

    socket.on('typing', (msg) => {
        console.log(msg);
        io.emit('typing', `${socket.client.nick} ${msg}`);
    });

    socket.on('stop typing', (msg) => {
        io.emit('stop typing', `${socket.client.nick} ${msg}`);
    });

    socket.on('disconnect', () => {
        console.log('usuario desconectado');
        let date=new Date();
        date=`${date.getFullYear()}/${date.getMonth()+1}/${date.getDate()} ${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}`;
        io.emit('chat message', '['+date+']'+' '+ socket.client.nick + " saiu");
    });
});

const PORT = process.env.PORT;
console.log({PORT});
app.listen(PORT, async () => {
//    await dbcon();
    
    console.log(`Server iniciado na porta ${PORT}`)
});
