// Be sure to never run anything on postLogin > onRendered that I would regret
//   since I use BlazeLayout.reset(), albeit to reset pythonEnv, webEnv.

// initialize session variables
Session.set('nextLang', 'WebDev');
Session.set('amendPage', [false, '', ''])

function currEnv(s) {
	if (s === 'WebDev') {
		return 'pythonEnv';
	} else if (s === 'Python') {
		return 'webEnv';
	} else {
		return null;
	}
}

function nav2filesList(inp) {
	// input 'inp' is either 'changeFile' or 'saveFile' 
	Session.set('amendPage', [true, currEnv(Session.get('nextLang')), inp]);
	// ^[(whether or not your on an amended page), (the previous page), (the amended page you're entering)]
	FlowRouter.go('/filesList'); // take you to filesList 'inp'
}

nav_back = function() {
	FlowRouter.go('/editor/' + Session.get('amendPage')[1]);
	Session.set('amendPage', [false, '', '']);
}

Template.postLogin.helpers({
	switchLang: function() {
		return Session.get('nextLang');
	},
	hiddenAmend: function() {
		// removes all non-relevent buttons when you enter an "amended" page e.g. Settings
		var sesh = Session.get('amendPage');
		return sesh[0] ? "display:none;" : ""
	},
	hiddenAmend_back: function() {
		// whether the back button is hidden/displayed
		var sesh = Session.get('amendPage');
		return !sesh[0] ? "display:none;" : ""
	},
});

Template.postLogin.events({
	'click #logout': function(event) {
		if (Session.get('nextLang') === 'WebDev') { // you're on Python
			if (Session.get('modifPy')) { // you have new content to save
				if (confirm("You didn't save your work! Click 'Ok' to continue anyway, click 'Cancel' otherwise.")) {
					Meteor.logout();
					FlowRouter.go('/');
				}
			} else if (!Session.get('modifPy')) {
				Meteor.logout();
				FlowRouter.go('/');
			}
		} else if (Session.get('nextLang') === 'Python') { // you're on WebDev
			if (Session.get('modifWeb')) { // you have new content to save
				if (confirm("You didn't save your work! Click 'Ok' to continue anyway, click 'Cancel' otherwise.")) {
					Meteor.logout();
					FlowRouter.go('/');
				}
			} else if (!Session.get('modifWeb')) {
				Meteor.logout();
				FlowRouter.go('/');
			}
		}
	},
	'click #settings': function(event) {
		Session.set('amendPage', [true, currEnv(Session.get('nextLang')), 'settings']);
		// ^[(whether or not your on an amended page), (the previous page), (the amended page you're entering)]
		FlowRouter.go('/settings');
	},
	'click #nav_back': function(event) {
		nav_back();
	},
	'click #save_file': function(event) {
		if (Session.get('nextLang') === 'WebDev') { // you're on Python
			if (Session.get('modifPy')) { // you have new content to save
				if (Session.get('openFile') && Session.get('openFile')['WebDev'] && Session.get('openFile')['WebDev'].private) { // will only look at first condition if its false
					var contents4doc = Session.get('pyContents');
					Meteor.call('updateFile', Meteor.user().username, contents4doc, function(err, result) {
						if (err) {
							sAlert.error(err.reason);
						} else {
							sAlert.success('File updated!');
						}
					});
					Session.set('modifPy', false);
				} else {
					nav2filesList('saveFile');
				}
			}
		} else if (Session.get('nextLang') === 'Python') { // you're on WebDev
			if (Session.get('modifWeb')) { // you have new content to save
				if (Session.get('openFile') && Session.get('openFile')['Python'] && Session.get('openFile')['Python'].private) { // will only look at first condition if its false
					var contents4doc = [Session.get('htmlContents'), Session.get('cssContents'), Session.get('jsContents')];
					Meteor.call('updateFile', Meteor.user().username, contents4doc, function(err, result) {
						if (err) {
							sAlert.error(err.reason);
						} else {
							sAlert.success('File updated!');
						}
					});
					Session.set('modifWeb', false);
				} else {
					nav2filesList('saveFile');
				}
			}
		}
	},
	'click #change_file': function(event) {
		nav2filesList('changeFile');
	},
	'click #new_project': function(event) {
		if (Session.get('nextLang') === 'WebDev') { // you're on Python
			if (Session.get('modifPy')) { // you have new content to save
				if (confirm("You didn't save your work! Click 'Ok' to continue anyway, click 'Cancel' otherwise.")) {
					initSessions(Session.get('nextLang'));
					BlazeLayout.reset();
					BlazeLayout.render('pythonEnv');
				}
			} else if (!Session.get('modifPy')) {
				initSessions(Session.get('nextLang'));
				BlazeLayout.reset();
				BlazeLayout.render('pythonEnv');
			}
		} else if (Session.get('nextLang') === 'Python') { // you're on WebDev
			if (Session.get('modifWeb')) { // you have new content to save
				if (confirm("You didn't save your work! Click 'Ok' to continue anyway, click 'Cancel' otherwise.")) {
					initSessions(Session.get('nextLang'));
					BlazeLayout.reset();
					BlazeLayout.render('webEnv');
				}
			} else if (!Session.get('modifWeb')) {
				initSessions(Session.get('nextLang'));
				BlazeLayout.reset();
				BlazeLayout.render('webEnv');
			}
		}
	},
	'click #language_toggle': function(event) {
		if (Session.get('nextLang') === 'WebDev') { // you're on Python
			Session.set('nextLang', 'Python');
			FlowRouter.go('/editor/webEnv');
		} else if (Session.get('nextLang') === 'Python') { // you're on WebDev
			Session.set('nextLang', 'WebDev');
			FlowRouter.go('/editor/pythonEnv');
		}
	}
});

