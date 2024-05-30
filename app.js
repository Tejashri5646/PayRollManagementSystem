const express = require("express");
const app = express();
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
app.engine('ejs',ejsMate);
const mysql = require('mysql2');
const session = require("express-session");
const flash = require("connect-flash");
const passport = require('passport');
const bodyParser = require('body-parser');
const LocalStrategy = require('passport-local').Strategy;
const bcrypt = require('bcrypt');
const createUsersTableAndInsertUsers = require('./init/user');

const insertCastCodes = require("./init/castCode/insertCastCode");
const fetchCastCodes = require('./init/castCode/fetchCastCodes');
const deleteCastCode = require('./init/castCode/deleteCastCode');
const insertGradCodes = require("./init/gradMaster/insertGradCodes");
const fetchGradCodes = require("./init/gradMaster/fetchGradCodes");
const deleteGradCode = require("./init/gradMaster/deleteGradCodes");
const { getNextCode } = require('./utils/utils'); // Import the utility function

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
const sessionOptions = {
    secret:"mysupersecretcode",
    resave: false,
    saveUninitialized:true,
    cookie:{
        expires:Date.now() + 7* 24* 60 * 60 *1000,
        maxAge: 7*24*60*60*1000,
        httpOnly:true,
    }
}
app.use(session(sessionOptions));
app.use(flash());
app.set("view engine","ejs");
app.set("views",path.join(__dirname,"views"));
app.use(express.urlencoded({extended:true}));
app.use(methodOverride("_method"));
app.use(express.static(path.join(__dirname, 'public')));
app.use((req,res,next)=>{
    res.locals.success = req.flash("success");
    res.locals.error = req.flash("error");
    next();
});

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
    createUsersTableAndInsertUsers();

    return connection;
};
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.urlencoded({ extended: true }));
app.use(session({
    secret: 'your-secret-key',
    resave: false,
    saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());

// User model
const User = {
    findOne: (username, callback) => {
        const sql = 'SELECT * FROM Users WHERE username = ?';
        connection.query(sql, [username], (err, results) => {
            if (err) return callback(err);
            return callback(null, results[0]);
    });

    },
    findById: (id, callback) => {
        const sql = 'SELECT * FROM Users WHERE id = ?';
        connection.query(sql, [id], (err, results) => {
            if (err) return callback(err);
            return callback(null, results[0]);
        });
    }
};

// Passport configuration
passport.use(new LocalStrategy(async (username, password, done) => {
    try {
        const sql = 'SELECT * FROM Users WHERE username = ?';
        connection.query(sql, [username], async (err, user) => {
            if (err) return done(err);
            if (!user || !(await bcrypt.compare(password, user.password))) {
                return done(null, false, { message: 'Incorrect username or password' });
            }
            return done(null, user);
        });
    } catch (error) {
        return done(error);
    }
}));


passport.serializeUser((user, done) => {
    done(null, user.id);
});

passport.deserializeUser((id, done) => {
    User.findById(id, (err, user) => {
        done(err, user);
    });
});

// Login route
app.post('/login', passport.authenticate('local', {
    successRedirect: '/home',
    failureRedirect: '/login',
    failureFlash: true
}));

// Middleware to check if user is authenticated
function isAuthenticated(req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    }
    res.redirect('/login');
}

const connection = createConnectionAndTable();

app.get("/", (req, res) => {
    res.send("Hi I am root");
});

// Login Page
app.get("/login", (req, res) => {
    const currentDate = new Date();
    const formattedDate = formatDate(currentDate);
    res.render("./payrolls/index.ejs", { formattedDate });
});

app.post('/Home', (req, res) => {
    const { username, password } = req.body;

    User.findOne(username, async (err, user) => {
        if (err) {
            req.flash("error", "An error occurred");
            return res.redirect('/login');
        }

        if (!user || !(await bcrypt.compare(password, user.password))) {
            req.flash("error", "Incorrect username or password");
            return res.redirect('/login');
        }

        const currentDate = new Date();
        const formattedDate = formatDate(currentDate);
        res.render('payrolls/home', { formattedDate, username });
    });
});

app.get("/Home", isAuthenticated, (req, res) => {
    const currentDate = new Date();
    const formattedDate = formatDate(currentDate);
    const username = req.user.username;

    res.render("./payrolls/home.ejs", { formattedDate, username });
});
// Cast Master Page
app.get("/Home/castMaster", async (req, res) => {
    try {
        const currentDate = new Date();
        const formattedDate = currentDate.toISOString().split('T')[0]; // Format date as YYYY-MM-DD
        const { username } = req.query;

        // Fetch cast codes and the next code asynchronously
        const [castCodes, nextCode] = await Promise.all([
            fetchCastCodes(connection),
            getNextCode(connection, 'castCodes') // Use the utility function
        ]);

        // Render the template with the retrieved cast codes and next code
        res.render("payrolls/castMaster.ejs", { formattedDate, username, castCodes, nextCode });
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
app.post('/saveData', async (req, res) => {
    const { code, name } = req.body;

    // Check if the name already exists
    const query = 'SELECT * FROM castCodes WHERE name = ?';
    connection.query(query, [name], async (err, results) => {
        if (err) {
            console.error('Error checking if name exists:', err);
            return res.status(500).send('Error checking if name exists');
        }

        // If the name already exists, redirect with a flash error message
        if (results.length > 0) {
            req.flash("error", "Name already exists");
            return res.redirect("/Home/castMaster");
        }

        // Otherwise, insert the data
        const insertQuery = 'INSERT INTO castCodes (code, name) VALUES (?, ?)';
        connection.query(insertQuery, [code, name], (err, results) => {
            if (err) {
                console.error('Error inserting data:', err);
                return res.status(500).send('Error inserting data');
            }
            res.redirect("/Home/castMaster");
        });
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
        const [gradCodes, nextCode] = await Promise.all([
            fetchGradCodes(connection),
            getNextCode(connection, 'gradCodes') // Use the utility function
        ]);
        // Render the template with the retrieved cast codes
        res.render("payrolls/gradMast.ejs", { formattedDate, username, gradCodes,nextCode });
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

    // Check if the name already exists
    const query = 'SELECT * FROM gradCodes WHERE name = ?';
    connection.query(query, [name], async (error, results) => {
        if (error) {
            console.error('Error checking if name exists:', error);
            return res.status(500).send('Error checking if name exists');
        }

        // If the name already exists, redirect with a flash error message
        if (results.length > 0) {
            req.flash("error", "Name already exists");
            return res.redirect("/Home/gradMaster");
        }

        // Otherwise, insert the data
        const insertQuery = 'INSERT INTO gradCodes (code, name) VALUES (?, ?)';
        connection.query(insertQuery, [code, name], (err, results) => {
            if (err) {
                console.error('Error inserting data:', err);
                return res.status(500).send('Error inserting data');
            }
            res.redirect("/Home/gradMaster");
        });
    });
});

// SectionMaster

app.get("/Home/sectMaster",async (req,res)=>{
    try {
        const currentDate = new Date();
        const formattedDate = formatDate(currentDate);
        const { username } = req.body;

        // Fetch cast codes asynchronously
        const [sectCodes, nextCode] = await Promise.all([
            fetchSectCodes(connection),
            getNextCode(connection, 'sectCodes') // Use the utility function
        ]);

        // Render the template with the retrieved cast codes
        res.render("payrolls/sectMast.ejs", { formattedDate, username, sectCodes,nextCode });
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
        res.redirect("/Home/sectMaster");
    
    });
});

// Branch Master
app.get("/Home/branchMaster",async (req,res)=>{
    try {
        const currentDate = new Date();
        const formattedDate = formatDate(currentDate);
        const { username } = req.body;

        // Fetch cast codes asynchronously
        const [branchCodes, nextCode] = await Promise.all([
            fetchBranchCodes(connection),
            getNextCode(connection, 'branchCodes') // Use the utility function
        ]);
        // Render the template with the retrieved cast codes
        res.render("payrolls/branchMast.ejs", { formattedDate, username, branchCodes,nextCode });
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
        res.redirect("/Home/branchMaster");
    
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
app.get("/Home/employeeInfo",async (req,res)=>{
    const currentDate = new Date();
    const formattedDate = formatDate(currentDate);
    const {username} = req.body;
    const gradCodes = await fetchGradCodes();
    const branchCodes = await fetchBranchCodes();
    const sectCodes = await fetchSectCodes();
    res.render("payrolls/employeeInfo",{formattedDate,username,gradCodes,branchCodes,sectCodes});
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
app.get('/Home/employeeInfo/new',async (req,res)=>{
    const currentDate = new Date();
    const formattedDate = formatDate(currentDate);
    const {username} = req.body;
    const gradCodes = await fetchGradCodes();
    const branchCodes = await fetchBranchCodes();
    const sectCodes = await fetchSectCodes();
    res.render("payrolls/employeeInfo/newEmployeeInfo",{formattedDate,username,gradCodes,branchCodes,sectCodes});
});
app.post("/empsaveData", (req, res) => {
    const {
        eCode, eName, Type, gradCode, sectCode, branchCode, joiningDate, permDate, basic, ptDed, corrAddress,
        permAddress, FatherName, Caste, Gender, bDay, IdentityMark, KnownLang, Education, BloodGrp, Mothertongue
    } = req.body;

    if (!eCode || !eName || !Type) {
        console.log(eCode);
        return res.status(400).send("Employee code, name, and type are required");
    }

    const query = `
        INSERT INTO employeeInfo (
            eCode, eName, Type, gradCode, sectCode, branchCode, joiningDate, permDate, basic, ptDed, corrAddress,
            permAddress, FatherName, Caste, Gender, bDay, IdentityMark, KnownLang, Education, BloodGrp, Mothertongue
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;

    const values = [
        eCode, eName, Type, gradCode, sectCode, branchCode, joiningDate, permDate, basic, ptDed ? 1 : 0, corrAddress,
        permAddress, FatherName, Caste, Gender, bDay, IdentityMark, KnownLang, Education, BloodGrp, Mothertongue
    ];

    connection.query(query, values, (error, results) => {
        if (error) {
            console.error('Error saving employee data:', error);
            res.status(500).send("Error saving employee data");
            return;
        }
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