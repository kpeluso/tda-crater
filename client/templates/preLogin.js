function ValidateEmail(inputText) {  
	var mailFormat = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
	// if (inputText.value.match(mailFormat)) {
	if (mailFormat.test(inputText)) {
		// document.form1.text1.focus();
		return true;
	} else {
		alert("Invalid email address - what you entered isn't an email!");
		// document.form1.text1.focus();
		return false;
	}
}

function ValidateUsername(inputText) {
	var userFormat=  /^[a-zA-Z0-9!@#$%^&*]{2,16}$/;
	if (userFormat.test(inputText)) {
		return true;
	} else {
		alert('Ensure your username contains only 2-16 alphanumeric characters!')
		return false;
	}  
}

function ValidatePassword(inputText) {
	var passFormat=  /^(?=.*[0-9])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{7,15}$/;
	if (passFormat.test(inputText)) {
		return true;
	} else {
		alert('Ensure your password is between 7 to 15 characters, contains at least one number, and contains a special character!')
		return false;
	}  
}

initSessions = function(nextLang) { // global function
	// set modif_ to false whenever a new project opened, saved project opened, at login, and when content is just
	//   saved (when pythonContent and all of htmlContent, etc. match the content in the input fields)
	// update _Content whenever any (new/old) project is modified
	if (nextLang === 'WebDev' || nextLang === 'both') {
		Session.set('modifPy', false);
		Session.set('pyContent', "print 'Hello World!'");
	}
	if (nextLang === 'Python' || nextLang === 'both') {
		Session.set('modifWeb', false);
		Session.set('htmlContent', '<p id="paragraph">Hello World!</p>');//"&lt;p id=&quot;paragraph&quot;&gt;Hello World!&lt;/p&gt;");
		Session.set('cssContent', "p {\n\tcolor: green;\n}");
		Session.set('jsContent', 'document.getElementById("paragraph").innerHTML = "Hello Student!";\nconsole.log("Hi from the DOM!");');
	}
	Session.set('openFile', undefined);
}

Template.preLogin.events({
	'submit #login-form': function(event) {
		event.preventDefault();
		// login with user credentials
		var userVar = event.target.username1.value;
		var passwordVar = event.target.password1.value;
		// anti-injection measure
		if (ValidateUsername(userVar)) {
			Meteor.loginWithPassword(userVar, passwordVar, function(error){
				if (error) {
					alert(error.reason);
				} else { // log the user in
					event.target.reset(); // clear all form fields
					initSessions('both'); // initialize session variables
					FlowRouter.go('/editor/pythonEnv'); // redirect to editor
					sAlert.info('View all your files by clicking "Change Project".');
				}
			});
		}
	},
	'submit #signup-form': function(event) {
		event.preventDefault();
		// gather form input data
		var userVar = event.target.username2.value;
		var passwordVar = event.target.password2.value;
		var confirmPasswordVar = event.target.confirm_password2.value;
		// password confirmation
		if (confirmPasswordVar === passwordVar) {
			// validate user credentials/form input
			//if (ValidateEmail(emailVar) && ValidatePassword(passwordVar)) {
			if (ValidateUsername(userVar) && ValidatePassword(passwordVar)) {
				Accounts.createUser({
					username: userVar,
					password: passwordVar
				});
				Meteor.loginWithPassword(userVar, passwordVar); // log the user in
				initSessions('both'); // initialize session variables
				FlowRouter.go('/editor/pythonEnv'); // redirect to editor
				sAlert.info('View all your files by clicking "Change Project".');
			}
		} else {
			alert('Your password does not match your re-typed password!')
		}
		event.target.reset(); // clear all form fields
	}
});

