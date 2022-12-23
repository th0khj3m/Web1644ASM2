var express = require('express')
var app = express()

app.set('view engine', 'hbs')
app.use(express.urlencoded({extended: true}))
app.use(express.static('public'));

const { insertNewProduct, getAllProducts, deleteProductById, updateProduct, findProductById } = require('./databaseHandler');

//creating 24 hours from milliseconds
const oneDay = 1000 * 60 * 60 * 24

app.get('/', async (req, res) => {
    let results = await getAllProducts()
    res.render('home', {results: results})
})

app.get('/insertProduct', (req, res) => {
    res.render('insert')
})

app.post('/insertProduct', async (req, res) => {
    const name = req.body.txtProductName
    const price = req.body.txtProductPrice
    const picUrl = req.body.txtProductPic
    const newProduct = { 
        name: name, 
        price: Number.parseFloat(price),
        picture: picUrl
    }
    await insertNewProduct(newProduct)
    res.redirect('/')
})

app.get('/deleteProduct', async (req, res) => {
    const id = req.query.id
    await deleteProductById(id)
    res.redirect('/')
})

app.get('/editProduct', async (req, res) => {
    const id = req.query.id
    const productToEdit = await findProductById(id)
    res.render("edit", {product: productToEdit})
})

app.post('/editProduct', async (req, res) => {
    const id = req.body.id
    const name = req.body.txtProductName
    const price = req.body.txtProductPrice
    const picUrl = req.body.txtProductPic
    await updateProduct(id, name, price, picUrl)
    res.redirect('/')
})  

const PORT = process.env.PORT || 5000
app.listen(PORT, (req, res) => {
    console.log("Server is running at PORT: ", PORT)
})