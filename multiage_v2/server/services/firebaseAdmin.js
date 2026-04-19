const admin = require("firebase-admin");

let firebaseApp = null;

function getFirebaseAdminApp() {
  if (firebaseApp) {
    return firebaseApp;
  }

  const projectId = process.env.FIREBASE_PROJECT_ID;
  const clientEmail = process.env.FIREBASE_CLIENT_EMAIL;
  const privateKey = process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, "\n");

  if (!projectId || !clientEmail || !privateKey) {
    throw new Error("Firebase Admin credentials are not configured");
  }

  firebaseApp = admin.initializeApp({
    credential: admin.credential.cert({
      projectId,
      clientEmail,
      privateKey,
    }),
  });

  return firebaseApp;
}

async function verifyFirebaseIdToken(idToken) {
  const app = getFirebaseAdminApp();
  return app.auth().verifyIdToken(idToken);
}

module.exports = {
  verifyFirebaseIdToken,
};
