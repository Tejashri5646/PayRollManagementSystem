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

app.get("/",(req,res)=>{
    res.send("Hi I am root");
});
app.get("/Home", async (req, res) => {
    console.log("Hello from Home")
    res.render("./payrolls/index.ejs");
});
app.listen(8080,()=>{
    console.log("Server listening at port 8080");
});
