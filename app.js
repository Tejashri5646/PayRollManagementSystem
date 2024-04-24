const express = require("express");
const app = express();
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
app.engine('ejs',ejsMate);

app.set("view engine","ejs");
app.set("views",path.join(__dirname,"views"));
app.use(express.urlencoded({extended:true}));
app.use(methodOverride("_method"));
app.use(express.static(path.join(__dirname, 'public')));

const users = [
    { username: 'user1', password: 'password1' },
    { username: 'user2', password: 'password2' }
];

app.get("/",(req,res)=>{
    res.send("Hi I am root");
});

app.post('/login', (req, res) => {
    const { username, password } = req.body;
    const user = users.find(u => u.username === username && u.password === password);

    if (user) {
        res.render('payrolls/home', { username }); // Render home page with username
    } else {
        res.redirect('/'); // Redirect back to login page if login fails
    }
});

app.get("/login", async (req, res) => {
    console.log("Hello from Login");
    const currentDate = new Date();
    const formattedDate = formatDate(currentDate);
    res.render("./payrolls/index.ejs",{formattedDate});
});
app.get("/Home", async (req, res) => {
    console.log("Hello from Home")
    res.render("./payrolls/home.ejs");
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
