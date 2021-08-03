import { useEffect, useState, useRef } from "react";
import API from "../util/API";
import { io } from "socket.io-client";
import { useImmer } from "use-immer";
const SERVER = "http://localhost:3000";

function Gallery() {
  const [conversations, setConverastions] = useState([]);
  const [friends, setFriends] = useState([]);
  const [chat, setChat] = useImmer([]);
  const textEl = useRef(null);
  const usernameEl = useRef(null);
  const friendsEl = useRef(null);
  const [chatRoomParticipants, setChatRoomParticipants] = useState([]);
  // var socket = socketClient(SERVER, {
  //   autoConnect: false
  // });

  const socket = io(SERVER, {
    autoConnect: false
  })
  // const socket = io.connect(SERVER);

  const onMessage = () => {
    var username = usernameEl.current.value;
    var message = textEl.current.value;
    socket.emit("private_chat", {
      to: username,
      message: message
    })
  }



  const onPageLoad = () => {
    API.getUser().then((res) => {
      const username = res.data.username;
      socket.emit("register", username);
      socket.connect();
    })
  }

  const onAddFriend = (friendID) => {
    API.addFriends(friendID);
  }
  
  const onAddToChatRoom = (participantId) => {
    let containerParticipants = [...chatRoomParticipants]
    if(containerParticipants.filter(e => e.id === participantId.id).length <= 0) {
      containerParticipants.push(participantId);
    }
    setChatRoomParticipants(containerParticipants);
  }

  const createChatRoom = () => {
    let participants = [];
    for(let i = 0; i < chatRoomParticipants.length; i++) {
      participants.push(chatRoomParticipants[i].id);
    }
    console.log(participants);
    API.postChatRoom(participants);
  }
  useEffect(() => {
    onPageLoad();
    return () => socket.disconnect();
  }, [])
  
  useEffect(() => {
  }, [chatRoomParticipants])


  useEffect(() => {
    socket.on("private_chat", function (data) {
      var username = data.username;
      var message = data.message;
      setChat((draft) => {
        draft.push({ username, message })
        console.log(chat);
      })
    })
  }, [])

  useEffect(() => {
    API.getFriendsList().then((friendsID) => {
      console.log(friendsID.data);
      setFriends(friendsID.data);
    })
  }, [])


  return (


    <div className="container-fluid portfolio-bg" style={{ marginTop: "50px", backgroundColor: "white" }}>
      <input type="text" ref={friendsEl}></input>
      <button onClick={() => onAddFriend(friendsEl.current.value)}>Add friend</button>
      {friends.map((user) => (
        <div>
          <div style={{color: "red"}}>{user.username}</div>
          <button onClick={() => onAddToChatRoom({username: user.username, id: user._id})}>Add Friend To Chat</button>
        </div>
      ))}
      <div style={{color:"red"}}>Create New Chatroom</div>
      <div style={{color:"red"}}>Participants:</div>
      {chatRoomParticipants.map((participants) => (
        <div style={{color: "blue"}}>
          {participants.id}
        </div>
      ))}
      <button onClick={()=> createChatRoom()}>Create ChatRoom</button>
      {chat.map((chatBlock) => (
        <div>
          <div>{chatBlock.username}</div>
          <div>{chatBlock.message}</div>
        </div>
      ))}
      <input type="text" ref={usernameEl}></input>
      <input type="text" ref={textEl}></input>
      <button onClick={() => onMessage()}>Submit Text</button>
    </div>
  );
}
export default Gallery;