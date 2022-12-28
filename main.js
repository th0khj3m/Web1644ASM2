var express = require('express')
var app = express()

const hbs = require('hbs')
app.set('view engine', 'hbs')
hbs.registerHelper('ifcond', function(price) {
    if (price >= 50) {
        return 'green'
    }
    else {
        return 'blue'
    }
});

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
    const quantity = Number.parseFloat(req.body.txtProductQuantity)
    const picUrl = req.body.txtProductPic
    if (isNaN(name) || name.length < 5) {
        res.render('insert', {'warning': "Not enough length for name"})
    }
    else if (isNaN(price) || price < 8 || price > 999) {
        res.render('insert', {'warning' : "Invalid price"})
    }
    else if (isNaN(quantity) || (quantity < 8 || quantity > 999)) {
        res.render('insert', {'warning': "Invalid Quantity"})
    }
    else {
        const newProduct = { 
            name: name, 
            price: Number.parseFloat(price),
            quantity: Number.parseFloat(quantity),
            picture: picUrl
        }
        await insertNewProduct(newProduct)
        res.redirect('/')
    }

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
    const quantity = req.body.txtProductQuantity
    const picUrl = req.body.txtProductPic
    await updateProduct(id, name, price, quantity, picUrl)
    res.redirect('/')
})  

const PORT = process.env.PORT || 5000
app.listen(PORT, (req, res) => {
    console.log("Server is running at PORT: ", PORT)
})