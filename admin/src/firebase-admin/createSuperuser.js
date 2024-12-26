import { auth, db } from './firebaseAdmin.js';

async function createSuperuser(email, password) {
    try {
        
        const userRecord = await auth.createUser({
            email: email,
            password: password,
        });
        console.log(`User created with UID: ${userRecord.uid}`);

        // Set custom claims for the user
        await auth.setCustomUserClaims(userRecord.uid, { superuser: true });
        console.log(`Custom claims set for user: ${userRecord.uid}`);

        // Add user to the Realtime Database
        await db.ref('admin_users/' + userRecord.uid).set({
            email: email,
            superuser: true,
        });

        console.log('Superuser created successfully');
    } catch (error) {
        console.error('Error creating superuser:', error);
    }
}


createSuperuser('sandil.saar@gmail.com', '123456789');
