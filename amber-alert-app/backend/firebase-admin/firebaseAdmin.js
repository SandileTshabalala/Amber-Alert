//import admin from 'firebase-admin';
import serviceAccount from './ambert-alert-firebase-adminsdk.json' assert { type: 'json' };

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: "https://ambert-alert-default-rtdb.firebaseio.com"
});



// const auth = admin.auth();

 export{ admin };