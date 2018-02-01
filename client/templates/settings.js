Template.settings.helpers({
	'currUser': function() {
		return {};
	}
});

Template.settings.events({
	'submit #settings_profileForm': function(event) {
		event.preventDefault();
		FlowRouter.go('/settings');
		alert('@Shogun, confirm the data model for user profiles before I proceed with this.')
	},
	'submit #settings_passForm': function(event) {
		event.preventDefault();
		var currPassVar = event.target.s_currPass.value;
		var newPassVar = event.target.s_newPass.value;
		var confirmPassVar = event.target.s_newPass_confirm.value;
		if (confirmPassVar === newPassVar) {
			Accounts.changePassword(currPassVar, newPassVar, function(err) {
				if (err) {
					sAlert.warning(err.reason);
				} else {
					FlowRouter.go('/settings');
					sAlert.success('Password changed successfully!');
				}
			})
		} else {
			FlowRouter.go('/settings');
			sAlert.warning('Your password does not match your re-typed password!');
		}
		event.target.reset(); // clear all form fields
	},
	'submit #settings_contactForm': function(event) {
		event.preventDefault();
		alert('Please email shogun@hotmail.com for assistance.');
	}
});

