//if (Meteor.user() != null) {
	Tracker.autorun(() => {
		// console.log(Meteor.user());
		Meteor.subscribe('publicFiles', Meteor.user());
	});
//}

// It keeps vomiting errors in the Meteor Terminal when
//   I don't use the above conditional, however when I do
//   use it, no data gets sent to the user. I don't get it.

