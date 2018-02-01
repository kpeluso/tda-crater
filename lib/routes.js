// if (Meteor.isClient) {
// 	BlazeLayout.setRoot('#main-container');
// }

// python editor
FlowRouter.route('/editor/pythonEnv', {
	action: function(params, queryParams) {
		BlazeLayout.render('pythonEnv');
	}
});

// web editor
FlowRouter.route('/editor/webEnv', {
	action: function(params, queryParams) {
		BlazeLayout.render('webEnv');
	}
});

// files list, for file save and file change
FlowRouter.route('/filesList', {
	action: function(params, queryParams) {
		BlazeLayout.render('filesList');
	}
});

// user settings
FlowRouter.route('/settings', {
	action: function(params, queryParams) {
		BlazeLayout.render('settings');
	}
});

// on user logout
FlowRouter.route('/', {
	action: function(params, queryParams) {
		BlazeLayout.render('preLogin');
	}
});

