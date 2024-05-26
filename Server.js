import express from 'express';
import { config } from 'dotenv';
import ConnectDB from './src/DB/db.js';
import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';
import cors from 'cors';
// import Routes
import authRouter from './src/Routes/auth.routes.js';

const app = express();
config();

// middlewares
app.use(express.json());
app.use('/api/auth', authRouter);
app.use(cors({
   origin: 'http://localhost:5173'
}))
// support parsing of application/json type post data
app.use(bodyParser.json());
app.use(cookieParser())

app.use((req, res, next) => {
   res.header('Access-Control-Allow-Origin', 'http://localhost:5173'); // Replace with your Vite app's URL
   res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
   res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
   next();
});

//support parsing of application/x-www-form-urlencoded post data
app.use(bodyParser.urlencoded({ extended: true }));

// server
const PORT = process.env.PORT || 5000;

ConnectDB().then(app.listen(PORT, () => console.log("MongoDB connected & Server is running on " + PORT))).catch(() => console.log("failed to Load Node App"))
app.get('/', (req, res) => res.json({ message: 'Server is running on ' + PORT }));
// app.listen(PORT, () => console.log("Server is running on " + PORT));