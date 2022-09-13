 const socket = io();


socket.on("connect", () => {
  console.log("Conectado al servidor");
});

socket.on("UPDATE_MESSAGES", (msg, allMessages) => {
  document.getElementById("posts").innerHTML = "";
  allMessages
    .sort((a,b) => a.date - b.date)
    .forEach(msg => appendMessage(msg));
});

socket.on("NEW_MESSAGE", (msg) => {
  appendMessage(msg);
})

function appendMessage(msg) {
  document.getElementById("posts").innerHTML += `
    <div class="post ui card">
      <div class="content">
       <img  src=${msg.author.avatar} style="width:10%"> <b>${msg.author.nombre} (${msg.id}):</b> ${msg.mensaje}
        <hr/>
      </div>
    </div>
  `;
}

function enviarMensaje(){
  const nombre = document.getElementById("nombre").value;
  const email = document.getElementById("email").value;
  const edad = document.getElementById("edad").value;
  const alias = document.getElementById("alias").value;
  const avatar = document.getElementById("avatar").value;
  const mensaje = document.getElementById("mensaje").value;

  socket.emit("POST_MESSAGE", {nombre, email,edad,alias,avatar,mensaje});

} 

const author = new normalizr.schema.Entity(
  "author",
  {},
  { idAttribute: "userEmail" }
);

const mensaje = new normalizr.schema.Entity(
  "mensaje",
  { author: author },
  { idAttribute: "id" }
);

const schemaMensajes = new normalizr.schema.Entity(
  "mensajes",
  {
    mensajes: [mensaje],
  },
  { idAttribute: "id" }
);


fetch("/getData").then(async (data) => {
  const response = await data.json();
  const denormalizado = normalizr.denormalize(
    response.result,
    schemaMensajes,
    response.entities
  );

  console.log({
    original:JSON.stringify(data).length/1024,
    normalized:JSON.stringify(response).length/1024,
    denormalize:JSON.stringify(denormalizado).length/1024
  })  
  console.log(response)
  console.log(denormalizado)

});