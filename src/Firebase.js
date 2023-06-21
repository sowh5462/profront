// Import the functions you need from the SDKs you need
import firebase from "firebase/compat/app"
import 'firebase/compat/firestore';
import 'firebase/storage'
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDhp_vWbluRe-NlXaedGhGKXlOLUP5NYts",
  authDomain: "fir-8c4b3.firebaseapp.com",
  databaseURL: "https://fir-8c4b3-default-rtdb.firebaseio.com",
  projectId: "fir-8c4b3",
  storageBucket: "fir-8c4b3.appspot.com",
  messagingSenderId: "779351035899",
  appId: "1:779351035899:web:d3318fc3d17415c530c55e",
  measurementId: "G-R3XCP77ZB8"
};

// firebaseConfig 정보로 firebase 시작
firebase.initializeApp(firebaseConfig);



// 필요한 곳에서 사용할 수 있도록 내보내기
// 다른 곳에서 불러올때 firestore로 불러와야 함!!
export { firebase };