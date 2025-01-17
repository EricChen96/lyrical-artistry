import axios from "axios";

const API = {
  // Gets a single user by id
  getUser: () => {
    return axios.get("/api/user");
  },
  
  // sign up a user to our service
  signUpUser: ({ username, password, firstName, lastName, email }) => {
    return axios.post("api/signup", {
      username,
      password,
      firstName,
      lastName,
      email
    });
  },

  getTracks: (trackName) => {
    return axios.get(`/api/tracks/${trackName}`);
  },
  getLyrics: (trackID) => {
    return axios.get(`/api/lyrics/${trackID}`);
  },
  postQuotes: (quoteObject) => {
    return axios.post(`/api/user/quotes`, quoteObject);
  },
  deleteQuote: (quoteID) => {
    return axios.delete(`/api/user/quotes/${quoteID}`);
  },
  getAllUserQuotes: () => {
    return axios.get(`/api/user/quotes`);
  },
  postImage: (imageObject) => {
    return axios.post(`/api/user/files`, imageObject, { headers: {privacy: imageObject.privacy} });
  },
  getAllUserImages: () => {
    return axios.get("/api/user/images");
  },
  getAllPublicImages: ()=> {
    return axios.get("/api/publicImages");
  },
  deletePicture: (imageID) => {
    return axios.delete(`/api/user/images/${imageID}`);
  },
  addFriends: (friendID) => {
    return axios.post(`/api/user/friends/${friendID}`)
  },
  getFriendsList: () => {
    return axios.get("/api/user/friendsList");
  },
  updateConversations: (conversation) => {
    return axios.put(`/api/user/conversation`, conversation);
  },
  postChatRoom: (chatRoomData) => {
    return axios.post("/api/user/chatRoom", chatRoomData);
  },
  postMessage: (chatRoom) => {
    return axios.post("/api/user/:roomId/message", chatRoom);
  },
  getChatRoom: (chatRoom) => {
    return axios.get("/api/user/:roomId", chatRoom);
  },
  updateMessageMarkRead: () => {
    return axios.put("/api/user/:roomId/mark-read");
  }
};

export default API;
