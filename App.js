import React, { useState, useEffect } from "react";
import "./App.css";
import { db , auth} from "./firebase";
import Post from "./Post";
import Modal from '@material-ui/core/Modal';
import { makeStyles } from '@material-ui/core/styles';
import { Button, Input } from '@material-ui/core';
import ImageUpload from './ImageUpload';
import firebase from "firebase";
import InstagramEmbed from 'react-instagram-embed';

function getModalStyle() {
  const top = 50 ;
  const left = 50 ;

  return {
    top: `${top}%`,
    left: `${left}%`,
    transform: `translate(-${top}%, -${left}%)`,
  };
}

const useStyles = makeStyles((theme) => ({
  paper: {
    position: 'absolute',
    width: 400,
    backgroundColor: theme.palette.background.paper,
    border: '2px solid #000',
    boxShadow: theme.shadows[5],
    padding: theme.spacing(2, 4, 3),
  },
}));

function App() {
  const [posts, setPosts] = useState([]);
  const classes = useStyles();
  const [modalStyle] = useState(getModalStyle);
  const [open, setOpen] = useState(false);
  const [username,setUsername]=useState('');
  const [password,setPassword]=useState('');
  const [email,setEmail]=useState('');
  const [user,setUser]=useState(null);
  const [openSingIn,setOpenSignIn]=useState(false);

  useEffect(()=>{
   const unsubscribe= auth.onAuthStateChanged((authUser)=>{
      if(authUser){
          console.log(authUser);
          setUser(authUser);
         
      }else{
          setUser(null);
      }
    })
    return ()=>{
      unsubscribe();
    }
  },[user,username]);

  useEffect(() => {
    //code runs here
    //if [] is blank it will run only once
    db.collection("posts").orderBy('timestamp','desc').onSnapshot((snapshot) => {
      setPosts(
        snapshot.docs.map(doc => ({
          id: doc.id,
          post: doc.data(),
        }))
      );
    });
  }, []);
  const signUp=(event)=>{
    event.preventDefault();

    auth.createUserWithEmailAndPassword(email,password)
    .then((authUser)=>{
      return authUser.user.updateProfile({
        displayName:username
      })
    }).catch((error) => alert(error.message))
  }

  const signIn = (event) => {
    event.preventDefault();

    auth.signInWithEmailAndPassword(email,password).catch((error) => alert(error.message))
    setOpenSignIn(false);
  }


  return (
    <div className="app">

      <Modal
        open={open}
        onClose={()=>setOpen(false)} > 
      <div style={modalStyle} className={classes.paper}>
        <form className="app__signup">
        <center>
        <img
          className="app__headerImage"
          src="https://www.instagram.com/static/images/web/mobile_nav_type_logo.png/735145cfe0a4.png"
        />
        </center>
        <Input
        type ="text" placeholder="username"value={username} 
        onChange={(event)=>setUsername(event.target.value)}
        />
        <Input
        type ="password" placeholder="password"value={password} 
        onChange={(event)=>setPassword(event.target.value)}
        />
        <Input
        type ="text" placeholder="email"value={email} onChange={(event)=>setEmail(event.target.value)}
        />
      <Button type="submit" onClick={signUp}>Sign up</Button>  
        </form>
        </div>
      </Modal>
      <Modal
        open={openSingIn}
        onClose={()=>setOpenSignIn(false)} > 
      <div style={modalStyle} className={classes.paper}>
        <form className="app__signup">
        <center>
        <img
          className="app__headerImage"
          src="https://www.instagram.com/static/images/web/mobile_nav_type_logo.png/735145cfe0a4.png"
        />
        </center>
        <Input
        type ="text" placeholder="email"value={email} onChange={(event)=>setEmail(event.target.value)}
        />
        <Input
        type ="password" placeholder="password"value={password} 
        onChange={(event)=>setPassword(event.target.value)}
        /> 
      <Button type="submit" onClick={signIn}>Sign In</Button>  
        </form>
        </div>
      </Modal>      
      <div className="app__header"> 
        <img
          className="app__headerImage"
          src="https://www.instagram.com/static/images/web/mobile_nav_type_logo.png/735145cfe0a4.png"
        />
        {user ? (
          <Button onClick={()=> auth.signOut()}>Loguot
          </Button>
        ): (
          <div className="loginContainer">
            <Button onClick={()=> setOpenSignIn(true)}>Sign In
            </Button> 
            <Button onClick={()=> setOpen(true)}>Sign Up
            </Button>
          </div>
        )}
      </div>
      
      <div className="app__posts">
          <div className="app__postsLeft">
              {posts.map(({ id, post }) => (
            <Post
              key={id}
              postId={id}
              user={user}
              username={post.usermane}
              caption={post.caption}
              imageUrl={post.imageUrl}
            />
          ))}
          </div>
          <div className="app__postsRight">
              <InstagramEmbed
                  url=''
                  maxWidth={320}
                  hideCaption={false}
                  containerTagName='div'
                  protocol=''
                  injectScript
                  onLoading={() => {}}
                  onSuccess={() => {}}
                  onAfterRender={() => {}}
                  onFailure={() => {}}
                />
          </div> 
      </div>   
      {user?.displayName?(
        <ImageUpload username={user.displayName} />
      ) : (
        <h3 className="h3">U need to log in to upload</h3>
      )}  
    </div>      
  );
}

export default App;
