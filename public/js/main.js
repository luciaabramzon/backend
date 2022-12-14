const socket = io();

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

socket.on("connect", () => {
  console.log("Conectado al servidor");
});

socket.on("UPDATE_MESSAGES", async (msg, allMessages) => {
  document.getElementById("posts").innerHTML = "";
 const message=await allMessages
 const denormalizado = normalizr.denormalize(
  message.result,
  schemaMensajes,
  message.entities
)
console.log(denormalizado.mensajes)
denormalizado.mensajes
    .sort((a,b) => a.date - b.date)
    .forEach(msg => appendMessage(msg));
   const normalized=Math.round(JSON.stringify(message).length/1024)
  document.getElementById('peso').innerHTML=normalized
});


socket.on("NEW_MESSAGE",async (msg) => {
  const message=await msg
  const denormalizado = normalizr.denormalize(
    message.result,
    schemaMensajes,
    message.entities
  )
  appendMessage(denormalizado);
})

async function appendMessage(msg) {
  const m= await msg.author
 document.getElementById("posts").innerHTML += `
    <div class="post ui card">
      <div class="content">
       <img  src=${m.avatar} style="width:10%"> <b>${m.nombre} (${msg.id}):</b> ${msg.mensaje}
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

 
;
 
