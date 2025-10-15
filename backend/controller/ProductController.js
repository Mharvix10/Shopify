const bcrypt = require('bcryptjs')
const Products = require('../model/ProductModel')
const Users = require('../model/UserModel')
const NodeCache = require( "node-cache" );
const cache = new NodeCache({stdTTL: 600});

const getProduct=async(req,res)=>{
    try {
        console.log("data fetch running")
        const {specialOffer} = req.query
        const pageSize = 20
        const page = parseInt(req.query.page) || 1
        const skip = (page-1) * pageSize
        const cachedProducts = cache.get("product")
        const cachedSpecialProducts = cache.get("specialProduct")


        // res.json({totalPage: totalPage})

        if(specialOffer=='true'){
            if(cachedSpecialProducts){
                res.json({product: cachedSpecialProducts})
                console.log("data from cache")
                return
            }

            const product = await Products.find({specialOffer: 'true'}).select('name price location imageUrl').limit(pageSize).skip().limit(5)
            cache.set("specialProduct", product)
            res.json({product: product})
        }

        else{
            const totalNoOfProducts = await Products.countDocuments()
            const totalPage = totalNoOfProducts / pageSize
            const roundedPage = Math.ceil(totalPage)
            console.log(`total page is ${totalPage} and document is ${roundedPage}`)

            if(cachedProducts){
                res.json({product: cachedProducts})
                console.log("data from cache")
                return
            }


            const product = await Products.find().select('name price imageUrl location').skip(skip).limit(pageSize).exec()
            cache.set("product", product)
            res.json({product: product, totalPage: roundedPage})
            
            

        }
    } catch (error) {
        console.log(error)
    }
    
}



const getCategoryProduct=async(req,res)=>{
    const cachedCategoryProduct = cache.get("categoryProduct")
    const {category} = req.params
    const pageSize = 5
    const page = parseInt(req.query.page) || 1
    const skip = (page-1) * pageSize
    const totalNoOfProducts = await Products.countDocuments({category: category})
    const totalPage = Math.ceil(totalNoOfProducts / pageSize)
        try {

            if(cachedCategoryProduct){
                res.json({product: cachedCategoryProduct})
                return
            }
            const product = await Products.find({category}).select('name price location imageUrl').skip(skip).limit(pageSize).exec()
            cache.set("categoryProduct", product)
            res.json({product: product, totalPage: totalPage})
            
        } catch (error) {
            console.log(error)
        }
}



const getProductByName=async(req, res)=>{
    console.log('name running')
    const {name} = req.params
    const pageSize = 5
    const page = parseInt(req.query.page) || 1
    const skip = (page-1) * pageSize
        try {
            const product = await Products.find({name: name}).select('name price location imageUrl').skip(skip).limit(pageSize).exec()
            res.json({product: product})
        } catch (error) {
            console.log(error)
        }
}



const getSingleProduct=async(req,res)=>{
    const {id} = req.params
        try {
            const product = await Products.findById(id)
            res.status(201).json({product: product})
            
        } catch (error) {
            console.log(error)
        }
}


const createProduct=async(req,res)=>{
    try {
        const email = req.query.email
        const user = await Users.findOne({email})

        const {name, brand, price, description, location, category, imageUrl, contact} = req.body
        if(!name|| !brand || !price || !description || !location || !category || !password || !imageUrl|| !contact){
            console.log('Please include all fields')
            res.json({message: 'Include all fields'})
        }

        if(user){
            console.log('creating product running')
            const product = await Products.create({
                name: name,
                brand: brand,
                price: price,
                location: location,
                category: category,
                userId: user._id,
                imageUrl: imageUrl,
                contact: contact,
                description: description
            })
            console.log('Products created successfully')
        }

    } catch (error) {
        console.log(error)
    }
}



const searchItems=async(req, res)=>{

        try {  
                const products = await Products.find({}).select('name brand')
                res.json({products}); 
            } catch (error) {  
                console.error('Error searching for products:', error);  
                res.status(500).json({ message: 'Internal Server Error', error: error.message });  
            }
}


const getBrandList = async(req,res)=>{
    const cachedBrandList = cache.get("brandList")
    const category = req.params.category
    try {
        if(cachedBrandList){
            res.json({brandItems: cachedBrandList})
            return
        }
        const brandList = await Products.distinct('brand', {category: category})
        console.log(brandList)
        cache.set("brandList", brandList)
        res.json({brandItems: brandList })
    } catch (error) {
        console.log(error)
    }
}

const getBrandProducts = async(req,res)=>{
    const cachedBrandProducts = cache.get("brandProducts")
    const {brand, category} = req.params
    try {
        if(cachedBrandProducts){
            res.json({products: cachedBrandProducts})
            return
        }
        const products = await Products.find({category: category, brand: brand}).select('name price location imageUrl').limit(20)
        cache.set("brandProducts", products)
        res.json({products: products })
        console.log(products)
    } catch (error) {
        console.log(error)
    }
}

const getStoreProducts=async(req, res)=>{
    const {email} = req.params
    const pageSize = 5
    const page = parseInt(req.query.page) || 1
    const skip = (page-1) * pageSize
    const totalNoOfProducts = await Products.countDocuments()
    const totalPage = Math.ceil(totalNoOfProducts / pageSize)
        try {
            console.log(`store email ${email}`)
            const user = await Users.findOne({email}).select('_id')
            const id = user._id
            const product = await Products.find({userId: id }).select('name price location imageUrl').skip(skip).limit(pageSize).exec()
            if(product.length==0){
                console.log('No products found')
            }else{
                res.json({product: product, totalPage: totalPage})
            }
        } catch (error) {
            console.log(error)
        }
}

    const deleteStoreItem=async(req, res)=>{
        console.log('delete running')
        const {email, id} = req.params
        try {
            const user = await Users.findOne({email}).select('_id')
            const userId = user._id
            const product = await Products.deleteOne({_id: id, userId: userId})
            res.json({product: product})
        } catch (error) {
            console.log(error)
        }
    }


module.exports = {getProduct, createProduct, getCategoryProduct, getSingleProduct, searchItems, getBrandList, getBrandProducts, getProductByName, getStoreProducts, deleteStoreItem}