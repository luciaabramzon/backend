  const express = require("express");
const { Server: HTTPServer } = require("http");
const { Server: SocketServer } = require("socket.io");
const events = require("./socket_events");
const Contenedor = require("./utils/contenedor");
const contenedor = new Contenedor("./data.json");
const fakerTest = require("./test/faker");
const app = express();
const message=contenedor.getAll()
const httpServer = new HTTPServer(app);
const socketServer = new SocketServer(httpServer);

const connection = require("./database");
connection();

const { Chat } = require("./schema/schema");

app.use(express.static("public"));
app.use("/api/productos-test", fakerTest);

app.get("/", (req, res) => {
  res.sendFile(__dirname + "/public/index.html");
});

const { normalize, schema } = require("normalizr");

const author = new schema.Entity("author", {}, { idAttribute: "email" });

const mensaje = new schema.Entity("mensaje", {
  author: author,
  idAttribute: "id",
});

const normalizarMensajes = (mensajesConId) =>
  normalize(mensajesConId, schemaMensajes);

async function getMensNormalizados() {
  const mensajes = await contenedor.getAll();
  const normalizados = normalizarMensajes({ id: "mensajes", mensajes });
  return normalizados;
}

const schemaMensajes = new schema.Entity(
  "mensajes",
  {
    mensajes: [mensaje],
  },
  { idAttribute: "id" }
);


socketServer.on("connection",async (socket) => {
  console.log("Nuevo client conectado");
  socketServer.emit(
    events.UPDATE_MESSAGES,
    "Bienvenido al WebSocket",
    await getMensNormalizados()
  );

  socket.on(events.POST_MESSAGE,async (msg) => {
    const _msg = {
      author: {
        id: msg.email,
        nombre: msg.nombre,
        email: msg.email,
        edad: msg.edad,
        alias: msg.alias,
        avatar: msg.avatar,
      },
      mensaje: msg.mensaje,
    };

    contenedor.save(_msg);
    socketServer.sockets.emit(events.NEW_MESSAGE, await getMensNormalizados());
   
  });

});

const PORT = process.env.PORT || 3000;
httpServer.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
