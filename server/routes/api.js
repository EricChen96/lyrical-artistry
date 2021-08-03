const { Router } = require("express");
const db = require("../models");
const isAuthenticated = require("../config/isAuthenticated");
const auth = require("../config/auth");
const apiRouter = new Router();

const path = require("path");
require("dotenv").config({ path: path.resolve(__dirname, ".env") });
const multer = require("multer");
var multerS3 = require('multer-s3');
const AWS = require("aws-sdk");
const { ChatRoom } = require("../models");
const BUCKET_NAME = process.env.AWSBucket;
const USER_KEY = process.env.AWSAccessKeyId;
const USER_SECRET = process.env.AWSSecretKey;
const s3 = new AWS.S3({
  accessKeyId: USER_KEY,
  secretAccessKey: USER_SECRET,
});

// LOGIN ROUTE
apiRouter.post("/api/login", (req, res) => {
  auth
    .logUserIn(req.body.username, req.body.password)
    .then((dbUser) => res.json(dbUser))
    .catch((err) => res.status(400).json(err));
});

// SIGNUP ROUTE
apiRouter.post("/api/signup", (req, res) => {
  db.User.create(req.body)
    .then((data) => res.json(data))
    .catch((err) => res.status(400).json(err));
});

// Any route with isAuthenticated is protected and you need a valid token
// to access
apiRouter.get("/api/user", isAuthenticated, (req, res) => {
  db.User.findById(req.user.id)
    .then((data) => {
      if (data) {
        res.json(data);
      } else {
        res.status(404).send({ success: false, message: "No user found" });
      }
    })
    .catch((err) => res.status(400).send(err));
});


apiRouter.get(`/api/search/:user`, (req, res) => {
db.User.find({ username: { $regex: req.params.user } })
    .then((data) => {
      if (data) {
        res.json(data);
      } else {
        res.status(404).send({ success: false, message: "No user found" });
      }
    })
    .catch((err) => res.status(400).send(err));
});

apiRouter.post("/api/user/quotes", isAuthenticated, (req, res) => {
  db.Quote.create(req.body)
    .then(({ _id }) => db.User.findOneAndUpdate({ _id: req.user.id }, { $push: { quotes: _id } }, { new: true }))
    .then(dbUser => {
      res.json(dbUser);
    }).catch(err => {
      res.json(err);
    })
});

apiRouter.delete("/api/user/quotes/:quoteID", isAuthenticated, (req, res) => {
  db.Quote.findById({ _id: req.params.quoteID }).then(dbModel => dbModel.remove()).catch(err => {
    res.json(err);
  })
})

apiRouter.get("/api/user/quotes", isAuthenticated, (req, res) => {
  db.User.findById(req.user.id).populate("quotes").then(dbUser => {
    res.json(dbUser.quotes);
  }).catch(err => {
    res.json(err);
  })
})


apiRouter.get("/api/user/images", isAuthenticated, (req, res) => {
  db.User.findById(req.user.id).populate("images").then(dbUser => {
    res.json(
      dbUser.images.map((imageDoc) => {
        //Convert mongoose Document class to JS object
        const image = imageDoc.toObject();
        return image;
      })
    );
  }).catch(err => {
    res.json(err);
  })
})

apiRouter.get("/api/publicImages", isAuthenticated, (req, res) => {
  db.Image.find({ privacy: "public" }).then(dbImages => {
    res.json(
      dbImages.map((imageDoc) => {
        //Convert mongoose Document class to JS object
        const image = imageDoc.toObject();
        return image;
      })
    );
  }).catch(err => {
    res.json(err);
  })
})

var upload = multer({
  storage: multerS3({
    s3: s3,
    bucket: BUCKET_NAME,
    key: function (req, file, cb) {
      cb(null, Date.now().toString() + ".png")
    },
    contentType: multerS3.AUTO_CONTENT_TYPE,
    acl: `public-read`,
  })
});

// sends to S3
apiRouter.post("/api/user/files", upload.single("image"), isAuthenticated, (req, res) => {
  const image = {
    imageS3Url: req.file.location,
    name: req.file.originalname,
    privacy: req.headers.privacy
    // public: req.publicStatus
  }
  db.Image.create(image)
    .then(({ _id }) => db.User.findOneAndUpdate({ _id: req.user.id }, { $push: { images: _id } }, { new: true }))
    .catch((err) => {
      console.log(err);
    })
});

apiRouter.delete("/api/user/images/:imageID", isAuthenticated, (req, res) => {
  db.Image.findById({ _id: req.params.imageID }).then(dbModel => {
    console.log(dbModel);
<<<<<<< HEAD
<<<<<<< HEAD
    const s3Key = dbModel.imageS3Url.replace("https://lyrical-artistry-s3.s3.amazonaws.com/", "");
=======
    const s3Key = dbModel.imageS3Url.replace(`https://${BUCKET_NAME}.s3.amazonaws.com/`,"");
>>>>>>> 42ef3c16fac182c276f85b7196abefe2b27e81ba
=======
    const s3Key = dbModel.imageS3Url.replace(`https://${BUCKET_NAME}.s3.amazonaws.com/`, "");
>>>>>>> 672db133e860bcd7d1c67d05b8ac106fdaacc6c5
    var params = { Bucket: BUCKET_NAME, Key: s3Key };
    s3.deleteObject(params, function (err, data) {
      if (err) console.log(err, err.stack);  // error
    });
    dbModel.remove()
  }).catch(err => {
    res.json(err);
  })
});

apiRouter.get("/api/user/friendsList", isAuthenticated, (req, res) => {
  db.FriendsList.find({ owner: req.user.id }).populate("friends").then(dbFriends => {
    res.json(dbFriends[0].friends);
  }).catch(err => {
    res.json(err);
  })
});

//Updating Friend List
apiRouter.post("/api/user/friends/:friendID", isAuthenticated, (req, res) => {
  db.FriendsList.findOneAndUpdate({ owner: req.user.id }, { $addToSet: { friends: req.params.friendID } }).then(() => {
    console.log("it works");
  });
});

//Initiate Chatroom
apiRouter.post("/api/user/chatRoom", isAuthenticated, (req, res) => {
  const participants = req.body;
  const allUserIds = [...participants];
  db.ChatRoom.initiateChat(allUserIds).then((chatRoom) => {
    res.json({ success: true, chatRoom });
  }).catch(err => {
    res.json(err);
  });
});


apiRouter.post("/api/user/:roomId/message", isAuthenticated, (req, res) => {
  const roomId = req.params.roomId;
  const messagePayload = {
    messageText: req.body.messageText
  };
  const currentLoggedUser = req.userId;
  const post = db.ChatMessage.createPostInChatRoom(roomId, messagePayload, currentLoggedUser).then(() => {
    global.io.sockets.in(roomId).emit('new message', { message: post });
    return res.status(200).json({ success: true, post });
  }).catch(err =>
    res.json(err));
});

apiRouter.get("/api/user/:roomId", isAuthenticated, async (req, res) => {
  const roomId = req.params.roomId;
  const room = await db.ChatRoom.getChatRoomByRoomId(roomId);
  if (!room) {
    return res.status(400).json({
      success: false,
      message: "No room exists for this id"
    });
  }
  const users = await db.User.getUserByIds(room.participants);
  const options = {
    page: parseInt(req.query.page) || 0,
    limit: parseInt(req.query.limit) || 10,
  };
  const conversation = await db.Message.getConversationByRoomId(roomId, options);
  res.json({
    success: true,
    conversation,
    users
  })


})

apiRouter.put("/api/user/:roomId/mark-read", isAuthenticated, async (req, res) => {
  try {
    const roomId = req.params.roomId;
    const room = await db.ChatRoom.getChatRoomByRoomId(roomId);
    if (!room) {
      return res.status(400).json({
        success: false,
        message: "No room exists for this id",F
      })
    }
  } catch (error) {
    console.log(error);
    return res.status(500).json({success: false, error});
  }
})

module.exports = apiRouter;
