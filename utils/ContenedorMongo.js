const mongoose=require('mongoose')
const {Types}=require('mongoose')

class ContenedorMongo{
    constructor (nombreCollecion,schema){
        this.colleccion=mongoose.model(nombreCollecion,schema)
    }

    async save(object){
        try{
            const document=new this.colleccion(object)
            this.colleccion(document).save()
            console.log(document.productos)
        }catch(error){
            throw new Error(`Error: ${error}`)
        }
    }

    async getAll(){
        const data=await this.colleccion.find()
        return data
    }

    async getById(id){
        const dataId=await this.colleccion.findOne({_id:id})
        return dataId
    }

    async updateById(id,object){
            const product=await this.colleccion.updateOne({_id:id},{$set:{
                title:object.title,
                price:object.price,
                image:object.image,
                description:object.description,
            }})
            console.log(product)
        return product
    }
    
    async updateByCartId(id,object){
        const product=await this.colleccion.findOne({_id:id})
        this.colleccion(object).save()
    }


    async deleteById(id){
        const borrar=await this.colleccion.deleteOne({_id:id})
        return borrar
    }

}


module.exports=ContenedorMongo