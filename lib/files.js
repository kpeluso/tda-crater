Files = new Mongo.Collection('files');
Users = new Mongo.Collection('quaqua');

Meteor.methods({
	deleteFile: function(fileName, owner) {
		// this gets called when a user clicks the Delete button in filesList
		if (!Meteor.userId()) {
			throw new Meteor.Error('Not Authorized', 'User is not logged in!');
		}
		var file = Files.findOne(
			{$and: [
				{fileName: fileName},
				{fileName: {$exists: true}},
				{owner: owner},
				{private: true}
				]
			});
		Files.remove(file); // remove from the collection
	},
	insertFile: function(preFile) {
		// this occurs whenever a user attempts to save a file with a null openFil>nextLang sesh
		if (!Meteor.userId()) {
			throw new Meteor.Error('Not Authorized', 'User is not logged in!');
		}
		// prevent injection
		if (check(preFile, {
				owner: String,
				fileName: String,
				ancestor: Match.OneOf(null, String),
				content: String,
				type: String,
				creationDate: Date,
				modifiedDate: Date,
				private: Boolean
			})) {
			throw new Meteor.Error('Not Authorized', 'You are not sending us appropriate data!');
		}
		Files.insert(preFile); // insert into the collection
	},
	updateFile: function(oldFile, owner, contents) {
		// this occurs whenever a user saves a file with a nonnull openFil>nextLang sesh
		if (!Meteor.userId()) {
			throw new Meteor.Error('Not Authorized', 'User is not logged in!');
		}
		// check to see if user is actually the owner of the file
		var file = Files.findOne(oldFile._id);
		if (Meteor.userId() != file.owner) {
			// user could've sent any data, but we want the one in the database,
			//   so we find do Files.findOne(oldFile._id).owner instead of data.owner
			throw new Meteor.Error('Not Authorized', 'User is not the right owner!');
		}
		// prevent injection
		if (check(oldFile, {
				_id: String,
				owner: String,
				fileName: String,
				ancestor: Match.OneOf(null, String),
				content: String,
				type: String,
				creationDate: Date,
				modifiedDate: Date,
				private: Boolean
			})) {
			throw new Meteor.Error('Not Authorized', 'You are not sending us appropriate data!');
		}
		// we may assume that the openFil>nextLang sesh exists by virtue of user arriving here
		var newFile = jQuery.extend(true, {}, oldFile);
		newFile.modifiedDate = new Date(); newFile.owner = owner; newFile.contents = contents;
		Files.update(oldFile, newFile); // update the db collection
	}
});

