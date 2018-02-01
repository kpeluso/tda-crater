// Sometimes publish a query, sometimes publish everything
Meteor.publish('publicFiles', function (who) {
	var currentUser = who.username;
	if (currentUser === 'kp4') { // *** EDIT MASTER USER HERE ***
		// user is an admin
		return Files.find();
	} else {
		// user is not an admin
		return Files.find({
			$or: [
				// gather user-owned files
				{$and: [
					{owner: currentUser},
					{owner: {$exists: true}}
					]
				},
				// gather public files
				{$and: [
					{private: {$ne: true}},
					{private: {$exists: true}}
					]
				},
				// gather user profile
				{$and: [
					{username: currentUser},
					{username: {$exists: true}}
					]
				}
			]
		});
	}
});

