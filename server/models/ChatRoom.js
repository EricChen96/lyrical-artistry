var mongoose = require('mongoose');
const Schema = mongoose.Schema;

var chatRoomSchema = new mongoose.Schema(
    {
        room: { type: String, trim: true },
        participants: [{ type: Schema.Types.ObjectId, required: true, ref: "User" }],
        last_message: Number,
    },
    {
        timestamps: true
    }
);

chatRoomSchema.statics.initiateChat = async function (participantsIds) {
    try {
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
                type: availableRoom._doc.type,
            };
        }

        const newRoom = await this.create({ participantsIds });
        return {
            isNew: true,
            message: "creating a new chatroom",
            chatRoomId: newRoom._doc._id,
            type: newRoom._doc.type,
        };
    } catch(error) {
        console.log("error on start chat method", error);
        throw error;
    }
}



const ChatRoom = mongoose.model("ConversationRoom", chatRoomSchema);
module.exports = ChatRoom;