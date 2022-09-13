const {faker}= require('@faker-js/faker')
const express=require('express')
const {Router}= require('express')
const router=Router()

function generarProductos(n){
    const productos=[]
    for (let i=0; i<n;i++){
        const _producto={
            id:i+1,
            title:faker.commerce.productName(),
            price:faker.commerce.price(150,2000,0,'$'),
            image:faker.image.food()
        }
        productos.push(_producto)
    }
    return productos
}

router.use(express.json());
router.use(express.urlencoded({extended: true}));

router.get('/',(req,res)=>{
    const cant=req.query.cant || 5
    const productos=generarProductos(cant)
    res.json(productos)
})

module.exports=router