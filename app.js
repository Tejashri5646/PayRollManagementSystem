const express = require("express");
const app = express();
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
app.engine('ejs',ejsMate);
const mysql = require('mysql2');
const insertCastCodes = require("./init/castCode/insertCastCode");
const fetchCastCodes = require('./init/castCode/fetchCastCodes');
const deleteCastCode = require('./init/castCode/deleteCastCode');

// const castCode = require("./init/castcodes");
const { createConnection } = require("net");
const {createCastTable} = require("./init/castCode/insertCastCode");

app.set("view engine","ejs");
app.set("views",path.join(__dirname,"views"));
app.use(express.urlencoded({extended:true}));
app.use(methodOverride("_method"));
app.use(express.static(path.join(__dirname, 'public')));


const createConnectionAndTable = () => {
    const connection = mysql.createConnection({
        host: 'localhost',
        user: 'root',
        password: '#teju1357',
        database: 'payroll'
    });
   createCastTable();

    return connection;
};
const connection = createConnectionAndTable();
const users = [
    { username: 'user1', password: 'password1' },
    { username: 'user2', password: 'password2' }
];

app.get("/",(req,res)=>{
    res.send("Hi I am root");
});
// Login Page
app.get("/login", async (req, res) => {
    console.log("Hello from Login");
    const currentDate = new Date();
    const formattedDate = formatDate(currentDate);
    res.render("./payrolls/index.ejs",{formattedDate});
});
// Home Page after Logging in
app.post('/Home', (req, res) => {
    const { username, password } = req.body;
    const user = users.find(u => u.username === username && u.password === password);
    const currentDate = new Date();
    const formattedDate = formatDate(currentDate);
    if (user) {
        res.render('payrolls/home', { formattedDate, username }); // Render home page with username
    } else {
        res.redirect('/login'); // Redirect back to login page if login fails
    }
});


app.get("/Home", async (req, res) => {
    console.log("Hello from Home")
    res.render("./payrolls/home.ejs");
});

// Cast Master Page
app.get("/Home/castMaster",async (req,res)=>{
    try {
        const currentDate = new Date();
        const formattedDate = formatDate(currentDate);
        const { username } = req.body;

        // Fetch cast codes asynchronously
        const castCodes = await fetchCastCodes(connection);

        // Render the template with the retrieved cast codes
        res.render("payrolls/castMaster.ejs", { formattedDate, username, castCodes });
    } catch (err) {
        // Handle errors
        console.error('Error in /Home/castMaster:', err);
        res.status(500).send('Internal Server Error');
    }
});
app.delete("/Home/castMaster/:id", async (req, res) => {
    try {
        const codeToDelete = req.params.id;

        // Delete the cast code from the database
        const affectedRows = await deleteCastCode(codeToDelete);

        // If the code was deleted from the database, respond with success
        if (affectedRows > 0) {
            res.redirect('http://localhost:8080/Home/castMaster');
        } else {
            // If the code was not found in the database, respond with error
            res.status(404).send(`Cast code ${codeToDelete} not found`);
        }
    } catch (error) {
        // Handle any errors that occur during the deletion process
        console.error('Error deleting cast code:', error);
        res.status(500).send('Internal Server Error');
    }
});

// Modify
app.get("/Home/castMaster/castModify",(req,res)=>{
    const currentDate = new Date();
    const formattedDate = formatDate(currentDate);
    const {username} = req.body;
    res.render("payrolls/castModify",{formattedDate,username,castCodes});
})
// Employee Information
app.get("/employeeInfo",(req,res)=>{
    const currentDate = new Date();
    const formattedDate = formatDate(currentDate);
    const {username} = req.body;
    res.render("payrolls/employeeInfo",{formattedDate,username});
});
app.get("/payCorrection",(req,res)=>{
    const currentDate = new Date();
    const formattedDate = formatDate(currentDate);
    const {username} = req.body;
    res.render("payrolls/payCorrection",{formattedDate,username});
});
app.listen(8080,()=>{
    console.log("Server listening at port 8080");
});

function formatDate(date) {
    const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
    const day = days[date.getDay()];
    const month = months[date.getMonth()];
    const year = date.getFullYear();
    let hours = date.getHours();
    const minutes = String(date.getMinutes()).padStart(2, '0');
    const seconds = String(date.getSeconds()).padStart(2, '0');
    const meridiem = hours >= 12 ? 'PM' : 'AM';
    hours = hours % 12 || 12; // Convert to 12-hour format
    return `${day}, ${month}, ${year} | ${hours}:${minutes}:${seconds}:${meridiem}`;
  }
