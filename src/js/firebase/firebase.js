const firebaseConfig = {
  apiKey: "AIzaSyAF2PlmTwicfmshs3ggoUSA7wGCrv5QXD0",
  authDomain: "future-restaurant-concept.firebaseapp.com",
  databaseURL: "https://future-restaurant-concept.firebaseio.com",
  projectId: "future-restaurant-concept",
  storageBucket: "future-restaurant-concept.appspot.com",
  messagingSenderId: "198112196640",
  appId: "1:198112196640:web:3ce29e532d9d74bbbe2445",
  measurementId: "G-JK3RVD0MXC"
};
// Initialize Firebase
firebase.initializeApp(firebaseConfig);

// Make auth and firestore references
const auth = firebase.auth();
const dataBase = firebase.firestore();

export { auth, dataBase };

console.log("Init.js");