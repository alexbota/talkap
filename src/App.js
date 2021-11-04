import React, { useState } from "react";
import firebase from "firebase/compat/app";
import "firebase/compat/firestore";
import { getAuth, signInWithRedirect, GoogleAuthProvider } from "firebase/auth";
import { useAuthState } from "react-firebase-hooks/auth";
import { useCollectionData } from "react-firebase-hooks/firestore";
import "./App.css";

firebase.initializeApp({
  apiKey: "AIzaSyCbdjLIReOfH5jwCU1MiLPiPkh7alqdu4E",
  authDomain: "talkap-2108d.firebaseapp.com",
  projectId: "talkap-2108d",
  storageBucket: "talkap-2108d.appspot.com",
  messagingSenderId: "867254405162",
  appId: "1:867254405162:web:8ce55afe8b4664ed9b9b53",
});

const auth = getAuth();
const firestore = firebase.firestore();

function App() {
  const [user] = useAuthState(auth);

  return (
    <div className="App">
      <header>
        <h1>⚛️🔥💬</h1>
        <SignOut />
      </header>

      <section>{user ? <ChatRoom /> : <SignIn />}</section>
    </div>
  );
}

function SignIn() {
  const signInWithGoogle = () => {
    const provider = new GoogleAuthProvider();
    signInWithRedirect(auth, provider);
  };

  return <button onClick={signInWithGoogle}>Sign in with Google</button>;
}

function SignOut() {
  return (
    auth.currentUser && <button onClick={() => auth.signOut()}>Sign Out</button>
  );
}

function ChatRoom() {
  const messagesRef = firestore.collection("messages");
  const query = messagesRef.orderBy("createdAt").limit(25);

  const [messages] = useCollectionData(query, { idField: "id" });

  const [formValue, setFormValue] = useState("");

  const sendMessage = async (e) => {
    e.preventDefault();

    const { uid, photoURL } = auth.currentUser;

    await messagesRef.add({
      text: formValue,
      createdAt: firebase.firestore.FieldValue.serverTimestamp(),
      uid,
      photoURL,
    });

    setFormValue("");
  };

  return (
    <>
      <div>
        {messages &&
          messages.map((msg) => <ChatMessage key={msg.id} message={msg} />)}
      </div>

      <form onSubmit={sendMessage}>
        <input
          value={formValue}
          onChange={(e) => setFormValue(e.target.value)}
        />
        <button type="submit">Send</button>
      </form>
    </>
  );
}

function ChatMessage(props) {
  const { text, uid, photoURL } = props.message;

  const messageClass = uid === auth.currentUser.uid ? "sent" : "received";
  return (
    <div className={`message ${messageClass}`}>
      <img src={photoURL} alt="" />
      <p>{text}</p>
    </div>
  );
}
export default App;
