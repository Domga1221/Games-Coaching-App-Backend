const express = require('express');
const cors = require('cors');
const path = require('path'); // NodeJS module to deal with filepaths - unused

// body-parser, express-session, cookie-parser
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const session = require('express-session');

// import DB connection
const connection = require('./config/db.connection.js');

const app = express();

// Body Parser Middleware
app.use(express.json());
    //app.use(express.urlencoded({extended: false}));
app.use(
    cors({
        origin: ["http://localhost:3000"],
        methods: ["GET", "POST", "DELETE"],
        credentials: true,
    })
);
// express-session
app.use(
    session({
        key: "coachId",
        secret: "secret",
        resave: false,
        saveUninitialized: false,
        cookie: {
            maxAge: 365 * 24 * 60 * 60 * 1000, // expires in 1 yeears
        }
    })
);


const PORT = process.env.PORT || 5000;


// Seissions API Routes
//app.use('/api/sessions', require('./routes/api/sessions_coach'));

// Sessions students API Routes
app.use('/api/sessions_student', require('./routes/api/sessions_student'))



// Students API Routes
//app.use('/api/students', require('./routes/api/students'));



// coach auth
//app.use('/coachauth', require('./routes/auth/coach_auth'));

// student auth
app.use("/studentauth", require('./routes/auth/student_auth'));


// connect to DB
connection.connect(function(error) {
    if(error){
        console.error('error connection ' + error.stack);
        return;
    }
    console.log('connected as id ' + connection.threadId);
})


// listen
app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
