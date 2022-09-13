const {normalize,schema,denormalize}=require('normalizr')
const fs=require('fs')  
const { Chat } = require("../schema/schema");
const { Router } = require("express");
const router = Router();
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
  

  const normalizedData = normalize(
    { id: "mensajes", mensajes: data },
    schemaMensajes
  );

  const denormalizedData=denormalize(normalizedData.result,schemaMensajes ,normalizedData.entities)

  const filename='./normalized_data/data_normalizada.json'

  
    try{
      fs.writeFileSync(filename,JSON.stringify(normalizedData,null))
      console.log('done')
  }catch(err){
      console.log(err)
  }



/*   async function mensajes() {
    const mensajes=await Chat.find()
    const normalizedPost = normalize(
      { id: "mensajes", mensajes: mensajes},
      schemaMensajes
    );  
    console.log(mensajes)
    console.log(normalizedPost)
   return normalizedPost
  }

  router.get("/", async (req, res) => {
    const mensaje= await mensajes()
    res.json(mensaje);
  }); */

  router.get("/", async (req, res) => {
    res.json(normalizedData);
  })

module.exports = router;