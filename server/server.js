//Importing required modules
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
require('dotenv').config();
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt');
const session = require('express-session');
const cookieParser = require('cookie-parser');
const multer = require('multer');
const UserModel = require('./models/UserSchema');
const ProductModel = require('./models/ProductSchema');
const CartModel = require('./models/CartSchema');

//setuping middleware
const app = express();
const PORT = process.env.PORT || 3001;

app.use(bodyParser.json());
app.use(express.json());
app.use(cors({
    origin: ["http://localhost:3000"],
    methods: ["POST", "GET"],
    credentials: true
}
));
app.use(cookieParser());
app.use(session({
    name: "Let's-Buy", secret: "Key", cookie: { maxAge: 1000 * 60 * 60 * 24 }, resave: false,
    saveUninitialized: false,
}));

//database connection
mongoose.connect(process.env.MONGODB_URI);
app.use(express.static('public'));
//Storage for product imges
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'public/images/product-images'); // Set the destination folder for uploaded images
    },
    filename: (req, file, cb) => {
        cb(null, `${file.originalname}`); // Use the original filename for the uploaded image
    },
});
const upload = multer({ storage });

//api routes
//Route for Add product
app.post('/addProduct', upload.single('image'), (req, res) => {
    const { name, category, price, quantity, description } = req.body;
    const image = req.file ? `${req.file.originalname}` : '';
    const product = { name, category, price, quantity, description, image }
    const newProduct = new ProductModel(product);
    newProduct.save().then((savedproduct) => {
        res.json(true);
    }).catch((error) => {
        console.log(error);
        res.json(error);
    })
})
//Route for Signup
app.post('/signup', async (req, res) => {
    let user = req.body;
    const existingUser = await UserModel.find({ email: user.email });
    if (existingUser.length > 0) {
        res.json(false)
    } else {

        user.password = await bcrypt.hash(user.password, 10);

        const newUser = new UserModel(user);
        newUser.save().then((response) => {
            req.session.user = response;
            res.json(true)
        }).catch(err => res.json(err));
    }
});

//Login Route
app.post('/login', async (req, res) => {
    const { email, password } = req.body;
    const user = await UserModel.find({ email });
    //Check the user is exsiting or not
    if (user.length > 0) {
        const ispass = await bcrypt.compare(password, user[0].password);
        //Checking password is correct or not
        if (ispass) {
            req.session.user = user[0];
            res.json(true);
        } else {
            res.json(false);
        }
    } else {
        res.json('User not Found');
    }

});
//Route to fetch Profile of logged in user
app.get('/profile', (req, res) => {
    if (req.session.user) {
        res.json({ valid: true, user: req.session.user })
    } else {
        res.json(null)
    }

})
//Fetch All Product
app.get('/All-products', async (req, res) => {
    const allProducts = await ProductModel.find({});
    res.json(allProducts);
});
//Add to Cart Route
app.get('/addToCart/:id', async (req, res) => {
    const { id } = req.params;
    let userId = req.session.user._id;
    try {
        let userCart = await CartModel.findOne({ user: userId });
        if (userCart) {
            const existingProduct = userCart.products.findIndex(product => product.item.toString() == id);
            if (existingProduct !== -1) {
                userCart.products[existingProduct].count += 1;
            } else {
                userCart.products.push({ item: id, count: 1 })
            }
            await userCart.save().then((response) => {
                res.json(response)
            }).catch(err => res.json(err));
        } else {
            console.log('worked')
            userCart = new CartModel({ user: userId, products: [{ item: id, count: 1 }] });
            await userCart.save().then((response) => {
                res.json(response);
            }).catch((err) => {
                res.json(err);
            })

        }

    } catch (err) {
        res.json(err)
    }
})
//port running
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});