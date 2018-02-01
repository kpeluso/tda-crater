function editOpenFileSesh(This) {
	var newSesh = jQuery.extend(true, {}, Session.get('openFile'));
	newSesh[Session.get('nextLang')] = This;
	Session.set('openFile', newSesh);
}

function nL2ext(nextLang) {
	if (nextLang === 'WebDev') {
		return '.py';
	} else if (nextLang === 'Python') {
		return '.web';
	}
}

function openFile(This, nL) {
	editOpenFileSesh(This);
	if (nL === 'WebDev') { // you're in Python mode
		var newSeshFile = Session.get('openFile')[Session.get('nextLang')];
		Session.set('pyContent', newSeshFile.content);
		Session.set('modifPy', false);
	} else if (nL === 'Python') { // you're in Web mode
		var newSeshFile = Session.get('openFile')[Session.get('nextLang')];
		Session.set('htmlContent', newSeshFile.content[0]);
		Session.set('cssContent', newSeshFile.content[1]);
		Session.set('jsContent', newSeshFile.content[2]);
		Session.set('modifWeb', false);
	}
}

function ValidateFileName(inputText) {
	var userFormat=  /^[a-zA-Z0-9\-\_]{1,40}$/;
	if (inputText) {
		if (userFormat.test(inputText)) {
			return true;
		} else {
			alert('Ensure your new file name is UNIQUE, no longer than 40 characters, and only has alphanumeric characters, dashes, or underscores (no spaces allowed)!');
			return false;
		}
	} else {
		return false
	}
}

Template.filesList.helpers({
	'currFile': function() {
		if (Session.get('openFile')) {
			if (Session.get('openFile')[Session.get('nextLang')]) {
				return Files.findOne(
					{$and: [
						{fileName: Session.get('openFile')[Session.get('nextLang')].fileName},
						{fileName: {$exists: true}},
						{owner: {$exists: Meteor.user().username}}
						]
					}
				);
			}
		}
		return {fileName: '[unnamed file]', modifiedDate: new Date()};
	},
	'readableModifiedDate': function() {
		return moment(this.modifiedDate).format('MMMM Do YYYY, h:mm:ss a');
	},
	'not_currFile': function() {
		var currType = Session.get('nextLang') === 'WebDev' ? 'python' : 'web';
		var file;
		if (Session.get('openFile')) {
			if (Session.get('openFile')[Session.get('nextLang')]) {
				var fileName = Session.get('openFile')[Session.get('nextLang')].fileName; // get fileName from openFile session variable
				file = Files.find(
					{$and: [
						{fileName: {$ne: fileName}}, // not the current file
						{fileName: {$exists: true}}, // not a user document
						{type: currType} // current file type
						]
					}) || {}; // do second only if first is undefined
			}
		} else {
			file = Files.find(
				{$and: [
					{fileName: {$exists: true}},
					{type: currType}
					]
				}) || {}; // do second (empty brackets) only if first is undefined
		}
		return file;
	},
	'changeDisp': function() {
		var sesh = Session.get('amendPage');
		return sesh[2] === 'saveFile' ? "display:none;" : "";
	},
	'nonPublic': function() {
		return this.private ? "" : "display:none;";
	}
});

Template.filesList.events({
	'click .fL_deleteButton': function(event) {
		if (confirm("Are you sure you'd like to permanently delete this file?")) {
			Meteor.call('deleteFile', this.fileName, this.owner, function(err, result) {
				if (err) {
					sAlert.error(err.reason);
				} else {
					sAlert.success('File deleted!');
				}
			});
		}
	},
	'click .fL_changeButton': function(event) {
		if (Session.get('nextLang') === 'WebDev') { // you're in Python mode
			if (Session.get('modifPy')) { // user is attempting to change file while working on an unsaved file
				if (confirm("Are you sure you want to continue without saving the file you're already working on?")) {
					openFile(this, Session.get('nextLang'));
				} else {
					alert("I'll direct you back to the editor now so you could save your file. Then, it's up to you to click \"Save Project\".");
				}
			} else { // user is attempting to change file while working on a saved file
				openFile(this, Session.get('nextLang'));
			}
		} else if (Session.get('nextLang') === 'Python') { // you're in Web mode
			if (Session.get('modifWeb')) {
				if (confirm("Are you sure you want to continue without saving the file you're already working on?")) {
					openFile(this, Session.get('nextLang'));
				} else {
					alert("I'll direct you back to the editor now so you could save your file. Then, it's up to you to click \"Save Project\".");
				}
			} else {
				openFile(this, Session.get('nextLang'));
			}
		}
		nav_back(); // return to the editor client was previously on
	}
});

Template.filesList.onRendered(function() {
	var sesh = Session.get('amendPage');
	if (sesh[2] === 'saveFile') {
		// If user satisfies conditions to arrive here, then they're trying to:
		//   (A) Save a new file from no file.
		//   (B) Save an edited file from a public file.
		// let the user choose a unique name for the file
		var newName;
		while (!ValidateFileName(newName)) {
			var newName = prompt('Choose a unique name for your new file (no spaces or special characters except underscores ( _ ) and dashes ( - )).');
			var newFileName = newName + nL2ext(Session.get('nextLang'));
			if (Files.findOne({fileName: newFileName, owner: Meteor.user().username})) {
				newName = newName + '$'; // invalidate newName due to non-uniqueness
			}
		}
		// insert new file into the collection
		if (Session.get('nextLang') === 'WebDev') { // you're in Python mode
			var content4doc = Session.get('pyContent');
			var type4doc = 'python';
			Session.set('modifPy', false);
		} else if (Session.get('nextLang') === 'Python') { // you're in Web mode
			var content4doc = [Session.get('htmlContent'), Session.get('cssContent'), Session.get('jsContent')];
			var type4doc = 'web';
			Session.set('modifWeb', false);
		}
		var ancestor4doc = Session.get('openFile') && Session.get('openFile')[Session.get('nextLang')] ? Session.get('openFile')[Session.get('nextLang')].fileName : null;
		var preFile = {
			owner: Meteor.user().username,
			fileName: newFileName,
			ancestor: ancestor4doc,
			content: content4doc,
			type: type4doc,
			creationDate: new Date(),
			modifiedDate: new Date(),
			private: true
		}
		Meteor.call('insertFile', preFile, function(err, result) {
				if (err) {
					sAlert.error(err.reason);
				} else {
					sAlert.success('New file created!');
					Session.set('openFile', preFile);
				}
			});
		nav_back(); // return to the editor client was previously on
	}
});

