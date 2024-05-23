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
const insertGradCodes = require("./init/gradMaster/insertGradCodes");
const fetchGradCodes = require("./init/gradMaster/fetchGradCodes");
const deleteGradCode = require("./init/gradMaster/deleteGradCodes");

const insertSectCodes = require("./init/sectMaster/insertSectCodes");
const fetchSectCodes = require("./init/sectMaster/fetchSectCodes");
const deleteSectCode = require("./init/sectMaster/deleteSectCodes");

const fetchBranchCodes = require("./init/branchMaster/fetchBranchCodes");
const deleteBranchCode = require("./init/branchMaster/deleteBranchCodes");
// const castCode = require("./init/castcodes");
const insertEmpInfo = require("./init/EmployeeInfo/insertEmpInfo");
const fetchEmpInfo = require("./init/EmployeeInfo/fetchEmpInfo");
const deleteEmpInfo = require("./init/EmployeeInfo/deleteEmpInfo");


const { createConnection } = require("net");
const {createCastTable} = require("./init/castCode/insertCastCode");
const {createGradeTable} = require("./init/gradMaster/insertGradCodes");
const {createSectTable} = require("./init/sectMaster/insertSectCodes");
const {createBranchTable} = require("./init/branchMaster/insertBranchCodes");
const {createEmpInfoTable} = require("./init/EmployeeInfo/insertEmpInfo");

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
    createGradeTable();
    createSectTable();
    createBranchTable();
    createEmpInfoTable();
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
    const username = req.query.username; // Extract username from URL parameters
    const currentDate = new Date();
    const formattedDate = formatDate(currentDate);
    
    res.render("./payrolls/home.ejs",{ formattedDate, username });
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
// Route to handle saving data
app.post("/saveData", (req, res) => {
    const { code, name } = req.body;
    // Code to save data to the databasect the user or send a response
    if (!code) {
        return res.status(400).send("Code field is required");
    }

    // Insert data into the database
    const query = "INSERT INTO castCodes (code, name) VALUES (?, ?)";
    connection.query(query, [code, name], (error, results) => {
        if (error) {
            console.error('Error saving data:', error);
            res.status(500).send("Error saving data");
            return;
        }
        console.log('Data saved successfully');
        res.redirect("/Home/castMaster");
    
    });
});
// Grade Master (e.g., using a MongoDB or SQL query)
    // Once saved, you can redire
app.get("/Home/gradMaster",async (req,res)=>{
    try {
        const currentDate = new Date();
        const formattedDate = formatDate(currentDate);
        const { username } = req.body;

        // Fetch cast codes asynchronously
        const gradCodes = await fetchGradCodes(connection);

        // Render the template with the retrieved cast codes
        res.render("payrolls/gradMast.ejs", { formattedDate, username, gradCodes });
    } catch (err) {
        // Handle errors
        console.error('Error in /Home/gradMaster:', err);
        res.status(500).send('Internal Server Error');
    }
});
app.delete("/Home/gradMaster/:id", async (req, res) => {
    try {
        const codeToDelete = req.params.id;

        // Delete the cast code from the database
        const affectedRows = await deleteGradCode(codeToDelete);

        // If the code was deleted from the database, respond with success
        if (affectedRows > 0) {
            res.redirect('http://localhost:8080/Home/gradMaster');
        } else {
            // If the code was not found in the database, respond with error
            res.status(404).send(`grad code ${codeToDelete} not found`);
        }
    } catch (error) {
        // Handle any errors that occur during the deletion process
        console.error('Error deleting grade code:', error);
        res.status(500).send('Internal Server Error');
    }
});
// Route to handle saving data
app.post("/gradsaveData", (req, res) => {
    const { code, name } = req.body;
    // Code to save data to the databasect the user or send a response
    if (!code) {
        return res.status(400).send("Code field is required");
    }

    // Insert data into the database
    const query = "INSERT INTO gradCodes (code, name) VALUES (?, ?)";
    connection.query(query, [code, name], (error, results) => {
        if (error) {
            console.error('Error saving data:', error);
            res.status(500).send("Error saving data");
            return;
        }
        console.log('Data saved successfully');
        res.redirect("/Home/gradMast");
    
    });
});
// SectionMaster

app.get("/Home/sectMaster",async (req,res)=>{
    try {
        const currentDate = new Date();
        const formattedDate = formatDate(currentDate);
        const { username } = req.body;

        // Fetch cast codes asynchronously
        const sectCodes = await fetchSectCodes(connection);

        // Render the template with the retrieved cast codes
        res.render("payrolls/sectMast.ejs", { formattedDate, username, sectCodes });
    } catch (err) {
        // Handle errors
        console.error('Error in /Home/sectMaster:', err);
        res.status(500).send('Internal Server Error');
    }
});
app.delete("/Home/sectMaster/:id", async (req, res) => {
    try {
        const codeToDelete = req.params.id;

        // Delete the cast code from the database
        const affectedRows = await deleteSectCode(codeToDelete);

        // If the code was deleted from the database, respond with success
        if (affectedRows > 0) {
            res.redirect('http://localhost:8080/Home/sectMaster');
        } else {
            // If the code was not found in the database, respond with error
            res.status(404).send(`sect code ${codeToDelete} not found`);
        }
    } catch (error) {
        // Handle any errors that occur during the deletion process
        console.error('Error deleting sect code:', error);
        res.status(500).send('Internal Server Error');
    }
});
// Route to handle saving data
app.post("/sectsaveData", (req, res) => {
    const { code, name } = req.body;
    // Code to save data to the databasect the user or send a response
    if (!code) {
        return res.status(400).send("Code field is required");
    }

    // Insert data into the database
    const query = "INSERT INTO sectCodes (code, name) VALUES (?, ?)";
    connection.query(query, [code, name], (error, results) => {
        if (error) {
            console.error('Error saving data:', error);
            res.status(500).send("Error saving data");
            return;
        }
        console.log('Data saved successfully');
        res.redirect("/Home/sectMast");
    
    });
});

// Branch Master
app.get("/Home/branchMaster",async (req,res)=>{
    try {
        const currentDate = new Date();
        const formattedDate = formatDate(currentDate);
        const { username } = req.body;

        // Fetch cast codes asynchronously
        const branchCodes = await fetchBranchCodes(connection);

        // Render the template with the retrieved cast codes
        res.render("payrolls/branchMast.ejs", { formattedDate, username, branchCodes });
    } catch (err) {
        // Handle errors
        console.error('Error in /Home/branchMaster:', err);
        res.status(500).send('Internal Server Error');
    }
});
app.delete("/Home/branchMaster/:id", async (req, res) => {
    try {
        const codeToDelete = req.params.id;

        // Delete the cast code from the database
        const affectedRows = await deleteBranchCode(codeToDelete);

        // If the code was deleted from the database, respond with success
        if (affectedRows > 0) {
            res.redirect('http://localhost:8080/Home/branchMaster');
        } else {
            // If the code was not found in the database, respond with error
            res.status(404).send(`branch code ${codeToDelete} not found`);
        }
    } catch (error) {
        // Handle any errors that occur during the deletion process
        console.error('Error deleting branch code:', error);
        res.status(500).send('Internal Server Error');
    }
});
// Route to handle saving data
app.post("/branchsaveData", (req, res) => {
    const { code, name } = req.body;
    // Code to save data to the databasect the user or send a response
    if (!code) {
        return res.status(400).send("Code field is required");
    }

    // Insert data into the database
    const query = "INSERT INTO branchCodes (code, name) VALUES (?, ?)";
    connection.query(query, [code, name], (error, results) => {
        if (error) {
            console.error('Error saving data:', error);
            res.status(500).send("Error saving data");
            return;
        }
        console.log('Data saved successfully');
        res.redirect("/Home/branchMast");
    
    });
});
// Modify
app.get("/Home/castMaster/castModify",(req,res)=>{
    const currentDate = new Date();
    const formattedDate = formatDate(currentDate);
    const {username} = req.body;
    res.render("payrolls/castModify",{formattedDate,username,castCodes});
})
// Employee Information
app.get("/Home/employeeInfo",(req,res)=>{
    const currentDate = new Date();
    const formattedDate = formatDate(currentDate);
    const {username} = req.body;
    res.render("payrolls/employeeInfo",{formattedDate,username});
});
app.get("/Home/employeeInfo/view", async (req, res) => {
    try {
        const currentDate = new Date();
        const formattedDate = formatDate(currentDate);
        const username = req.query.username;

        // Fetch employee information asynchronously
        const employeeInfo = await fetchEmpInfo();

        // Render the template with the retrieved employee information
        
        res.render("payrolls/employeeInfo/view.ejs", { formattedDate, username, employeeInfo });
    } catch (err) {
        // Handle errors
        console.error('Error in /Home/employeeInfo:', err);
        res.status(500).send('Internal Server Error');
    }
});
app.delete("/Home/employeeInfo/:id", async (req, res) => {
    try {
        const eCodeToDelete = req.params.id;

        // Delete the employee information from the database
        const affectedRows = await deleteEmpInfo(eCodeToDelete);

        // If the employee information was deleted from the database, respond with success
        if (affectedRows > 0) {
            res.redirect('http://localhost:8080/Home/employeeInfo');
        } else {
            // If the employee information was not found in the database, respond with error
            res.status(404).send(`Employee with code ${eCodeToDelete} not found`);
        }
    } catch (error) {
        // Handle any errors that occur during the deletion process
        console.error('Error deleting employee information:', error);
        res.status(500).send('Internal Server Error');
    }
});
app.get('/Home/employeeInfo/new',(req,res)=>{
    const currentDate = new Date();
    const formattedDate = formatDate(currentDate);
    const {username} = req.body;
    res.render("payrolls/employeeInfo/newEmployeeInfo",{formattedDate,username});
});
app.post("/empsaveData", (req, res) => {
    const { eCode, eName, Type, gradCode, sectCode, branchCode, joiningDate, permDate, basic, ptDed, corrAddress, permAddress, FatherName, FAddress, Caste, Gender, bDay, IdentityMark, KnownLang, Education, BloodGrp, Mothertongue } = req.body;
    
    // Code to save employee information to the database
    if (!eCode || !eName || !Type) {
        return res.status(400).send("Employee code, name, and type are required");
    }

    // Insert data into the database
    const query = "INSERT INTO employeeInfo (eCode, eName, Type, gradCode, sectCode, branchCode, joiningDate, permDate, basic, ptDed, corrAddress, permAddress, FatherName, FAddress, Caste, Gender, bDay, IdentityMark, KnownLang, Education, BloodGrp, Mothertongue) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";
    connection.query(query, [eCode, eName, Type, gradCode, sectCode, branchCode, joiningDate, permDate, basic, ptDed, corrAddress, permAddress, FatherName, FAddress, Caste, Gender, bDay, IdentityMark, KnownLang, Education, BloodGrp, Mothertongue], (error, results) => {
        if (error) {
            console.error('Error saving employee data:', error);
            res.status(500).send("Error saving employee data");
            return;
        }
        console.log('Employee data saved successfully');
        res.redirect("/Home/employeeInfo");
    });
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
