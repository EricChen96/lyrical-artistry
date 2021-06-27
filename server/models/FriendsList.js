var mongoose = require('mongoose');
const Schema = mongoose.Schema;

var friendsListSchema = new mongoose.Schema({
	owner: {
        type: {type: Schema.Types.ObjectId, ref: "User",}
    }, 
	friends: [{type: Schema.Types.ObjectId, ref: "User"}]
	
});

const FriendsList = mongoose.model("FriendsList", friendsListSchema);
module.exports = FriendsList;