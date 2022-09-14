const {normalize,schema}=require('normalizr')
const { Chat } = require("../schema/schema");
const data=require('../data.json')

const author= new schema.Entity('author',{},{idAttribute:'email'})

const mensaje= new schema.Entity('mensaje',{
   author: author ,
  idAttribute: "id" 
})

const schemaMensajes = new schema.Entity(
    "mensajes",
    {
      mensajes: [mensaje],
    },
    { idAttribute: "id" }
  );

  const normalizarMensajes = (mensajesConId) => normalize(mensajesConId, schemaMensajes)

  function getMensNormalizados() {
    const mensajes = data
    const normalizados = normalizarMensajes({ id: 'mensajes', mensajes })
    return normalizados
}

module.exports= getMensNormalizados 


