import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getFirestore, collection, getDocs, updateDoc, doc, query, orderBy, onSnapshot } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

const firebaseConfig = {
    apiKey: "AIzaSyBZft0Jw76iRKIxo1U9yt0EcjwlG7bZRAM",
    authDomain: "vishal-vaid-a56e3.firebaseapp.com",
    databaseURL: "https://vishal-vaid-a56e3-default-rtdb.firebaseio.com",
    projectId: "vishal-vaid-a56e3",
    storageBucket: "vishal-vaid-a56e3.firebasestorage.app",
    messagingSenderId: "1087977551260",
    appId: "1:1087977551260:web:1858dc6b666da2f3570459",
    measurementId: "G-DE9C93FT93"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export { db, collection, getDocs, updateDoc, doc, query, orderBy, onSnapshot };
