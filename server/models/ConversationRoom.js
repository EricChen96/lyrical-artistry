var mongoose = require('mongoose');
const Schema = mongoose.Schema;

var conversationRoomSchema = new mongoose.Schema({
    room: {type: String, trim: true},
	participants: [{type: Schema.Types.ObjectId, required: true, ref: "User"}],
    last_message: Number,
},
{
    timestamps: true
});

const ConversationRoom = mongoose.model("ConversationRoom", conversationRoomSchema);
module.exports = ConversationRoom;