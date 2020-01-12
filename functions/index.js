const functions = require("firebase-functions");
const app = require("express")();
const { db } = require("./util/admin");
const FBAuth = require("./util/fbAuth");

const {
  getAllScreams,
  postScream,
  getScream,
  deleteScream,
  commentOnScream,
  likeScream,
  unlikeScream
} = require("./handlers/screams");
const {
  signup,
  login,
  uploadImage,
  addUserDetail,
  getAuthenticatedUser
} = require("./handlers/users");


//Scream Routes
app.get("/screams", getAllScreams);
app.post("/createScream", FBAuth, postScream);
app.get("/scream/:screamId", getScream);
app.delete("/scream/:screamId", FBAuth, deleteScream);
app.get("/scream/:screamId/like", FBAuth, likeScream);
app.get("/scream/:screamId/unlike", FBAuth, unlikeScream);
app.post("/scream/:screamId/comment", FBAuth, commentOnScream);

//User Routes
//Signup
app.post("/signup", signup);
//login
app.post("/login", login);
//upload image
app.post("/user/image", FBAuth, uploadImage);
//add user detail
app.post("/user", FBAuth, addUserDetail);
//like
app.get("/user", FBAuth, getAuthenticatedUser);

exports.createNotificationOnLike = functions
  .region("europe-west1")
  .firestore.document("likes/{id}")
  .onCreate(snapshot => {
    return db
      .doc(`/screams/${snapshot.data().screamId}`)
      .get()
      .then(doc => {
        if (
          doc.exists &&
          doc.data().userHandle !== snapshot.data().userHandle
        ) {
          return db.doc(`/notifications/${snapshot.id}`).set({
            createdAt: new Date().toISOString(),
            recipient: doc.data().userHandle,
            sender: snapshot.data().userHandle,
            type: "like",
            read: false,
            screamId: doc.id
          });
        }
      })
      .catch(err => console.error(err));
  });
exports.deleteNotificationOnUnLike = functions
  .region("europe-west1")
  .firestore.document("likes/{id}")
  .onDelete(snapshot => {
    return db
      .doc(`/notifications/${snapshot.id}`)
      .delete()
      .catch(err => {
        console.error(err);
        return;
      });
  });
exports.createNotificationOnComment = functions
  .region("europe-west1")
  .firestore.document("comments/{id}")
  .onCreate(snapshot => {
    return db
      .doc(`/screams/${snapshot.data().screamId}`)
      .get()
      .then(doc => {
        if (
          doc.exists &&
          doc.data().userHandle !== snapshot.data().userHandle
        ) {
          return db.doc(`/notifications/${snapshot.id}`).set({
            createdAt: new Date().toISOString(),
            recipient: doc.data().userHandle,
            sender: snapshot.data().userHandle,
            type: "comment",
            read: false,
            screamId: doc.id
          });
        }
      })
      .catch(err => {
        console.error(err);
        return;
      });
  });

exports.api = functions.region("europe-west1").https.onRequest(app);
