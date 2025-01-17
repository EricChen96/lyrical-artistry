var mongoose = require('mongoose');

var imageSchema = new mongoose.Schema({
	imageS3Url: String,
	name: String,
	privacy: {
		type: String,
		default: "public"
	}
	
});

const Image = mongoose.model("Image", imageSchema);
module.exports = Image;