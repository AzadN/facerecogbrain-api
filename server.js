const express=require('express');
//const bcrypt=require('bcrypt-nodejs');
const bcrypt=require('bcryptjs');
const cors=require('cors');
const knex=require('knex');

const register=require('./controllers/register');
const signin=require('./controllers/signin');
const profile=require('./controllers/profile');
const image=require('./controllers/image');

const db=knex({
  client: 'pg',
  connection: {
    host : '127.0.0.1',
    user : 'postgres',
    password : 'test',
    database : 'smart_brain'
  }
});

/*db.select('*').from('users').then(data=>{
	console.log(data);
});*/

const app=express();
app.use(cors());
app.use(express.urlencoded({extended: false}));
app.use(express.json());

//Demerits of having a variable instead of an actual database:-
//1. Necessity of looping through all user data for verificaation.
//2. Non-persistent data since root GET request leads to recreation of database variable.
app.get('/', (req, res)=>{
	res.send(database.users); 
})

app.post('/signin', (req,res)=> {signin.handleSignin(req,res,db,bcrypt)});

app.post('/register', (req, res)=> {register.handleRegistration(req,res,db,bcrypt)}); //Dependency injection

app.get('/profile/:id', (req, res)=> {profile.handleProfileFetch(req,res,db)});

app.put('/image', (req, res)=>{image.handleImage(req,res,db)});
app.post('/imageurl', (req, res)=>{image.handleAPICall(req,res)}); //Prevent leakage of Clarifai API key by moving this to server so that its not visible in the response

app.listen(process.env.PORT||3001, ()=>{
	console.log(`App is running on port ${process.env.PORT}`);
})

/* API Plan:-
1. Root Route (/) --> res : This is Working
2. Signin Route (/signin) --> POST = success/failure
3. Register Route (/register) --> POST = new user
4. Profile Info Access Route (/profile/:useriId) --> GET = user details
5. Image Endpoint (/image) --> PUT = user ranking based on number of scans w.r.t. other users  
*/