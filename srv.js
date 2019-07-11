// DB
const { Pool } = require('pg')
const db = new Pool({
    database: 'ddd',
    user: 'uuu',
    password: 'ppp'
})


// REST
const polka = require('polka')
// const cors = require('cors')()
const assets = require('sirv')('public')
const { handler } = polka()
    .use(assets)
    .get('/', async (req, res) => {
        let ret = await db.query('select now() as now')
        res.end(JSON.stringify(ret.rows[0]))
    })

// TLS
const cert = require('fs').readFileSync('cert')
const key = require('fs').readFileSync('key')
const server = require('https').createServer({ cert: cert, key: key }, handler)

// WSS
const io = require('socket.io')(server)
io.on('connect', socket => {
    console.log(`${socket.id}`);
    socket.emit('hi', socket.id)

    socket.on('hello', data => console.log(data))

    socket.on('client ts', data => {
        console.log(`${socket.id} ts ${data}`);
        console.log(typeof (data));

        socket.broadcast.emit('srv ts', new Date())
        socket.emit('srv ts', new Date())
    })
})

server.listen(3000, () => console.log(`run on https://localhost:3000`))