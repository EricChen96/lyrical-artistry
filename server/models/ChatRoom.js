var mongoose = require('mongoose');
const Schema = mongoose.Schema;

var chatRoomSchema = new mongoose.Schema(
    {
        participants: [{ type: Schema.Types.ObjectId, required: true, ref: "User" }],
        last_message: Number,
    },
    {
        timestamps: true
    }
);

chatRoomSchema.statics.getChatRoomByRoomId = async function (roomId) {
    try {
        const room = await this.findOne({ _id: roomId });
        return room;
    } catch (error) {
        throw error;
    }
}

chatRoomSchema.statics.initiateChat = async function (participantsIds) {
    try {
        console.log(participantsIds)
        const availableRoom = await this.findOne({
            participants: {
                $size: participantsIds.length,
                $all: [...participantsIds],
            }
        });
        if (availableRoom) {
            return {
                isNew: false,
                message: "retrieving an old chat room",
                chatRoomId: availableRoom._doc._id,
            };
        }

        const newRoom = await this.create({ participantsIds });
        return {
            isNew: true,
            message: "creating a new chatroom",
            chatRoomId: newRoom._doc._id,
        };
    } catch (error) {
        console.log("error on start chat method", error);
        throw error;
    }
}




const ChatRoom = mongoose.model("ConversationRoom", chatRoomSchema);
module.exports = ChatRoom;