Meteor.startup(function() {
	// code to run on server at startup
	// count recipes entry
	var num = Files.find().count();
	if (num === 0) {
		var fixtures = [
			{
				username: 'fu1',
				firstName: 'John1',
				lastName: 'Smith',
				email: 'fu-1@opt.net',
				phone: '555-555-5555',
				streetAdd: '8 Milk Street',
				town: 'Compton',
				state: 'NY',
				joinDate: new Date(),
				econtact: {
					eName: 'Jane Smith',
					phone: '555-555-5555'
				},
				prefs: 'deaf',
				admin: false
			},
			{
				username: 'fu2',
				firstName: 'John2',
				lastName: 'Smith',
				email: 'fu-2@opt.net',
				phone: '555-555-5555',
				streetAdd: '8 Milk Street',
				town: 'Compton',
				state: 'NY',
				joinDate: new Date(),
				econtact: {
					eName: 'Jane Smith',
					phone: '555-555-5555'
				},
				prefs: 'deaf',
				admin: false
			},
			{
				username: 'fu3',
				firstName: 'John3',
				lastName: 'Smith',
				email: 'fu-3@opt.net',
				phone: '555-555-5555',
				streetAdd: '8 Milk Street',
				town: 'Compton',
				state: 'NY',
				joinDate: new Date(),
				econtact: {
					eName: 'Jane Smith',
					phone: '555-555-5555'
				},
				prefs: 'deaf',
				admin: false
			},
			{
				username: 'kp4',
				firstName: 'John4',
				lastName: 'Smith',
				email: 'fu-4@opt.net',
				phone: '555-555-5555',
				streetAdd: '8 Milk Street',
				town: 'Compton',
				state: 'NY',
				joinDate: new Date(),
				econtact: {
					eName: 'Jane Smith',
					phone: '555-555-5555'
				},
				prefs: 'deaf',
				admin: true
			},

			// ^users, files:

			{
				owner: 'fu1',
				fileName: 'my_FakeFileAA.py',
				ancestor: 'master-fakeFileA.py',
				content: '',
				type: 'python',
				creationDate: new Date(),
				modifiedDate: new Date(),
				private: true
			},
			{
				owner: 'fu1',
				fileName: 'FakeFileAB.py',
				ancestor: 'master-fakeFileA.py',
				content: '',
				type: 'python',
				creationDate: new Date(),
				modifiedDate: new Date(),
				private: true
			},
			{
				owner: 'fu1',
				fileName: 'myFakeFileBA.py',
				ancestor: 'master-fakeFileB.py',
				content: '',
				type: 'python',
				creationDate: new Date(),
				modifiedDate: new Date(),
				private: true
			},
			{
				owner: 'fu1',
				fileName: 'myFakeFileBB.py',
				ancestor: 'master-fakeFileB.py',
				content: '',
				type: 'python',
				creationDate: new Date(),
				modifiedDate: new Date(),
				private: true
			},
			{
				owner: 'fu1',
				fileName: 'default-1A.web',
				ancestor: 'default.web',
				content: ['', '', ''],
				type: 'web',
				creationDate: new Date(),
				modifiedDate: new Date(),
				private: true
			},
			{
				owner: 'fu1',
				fileName: 'default-1B.web',
				ancestor: 'default.web',
				content: ['', '', ''],
				type: 'web',
				creationDate: new Date(),
				modifiedDate: new Date(),
				private: true
			},
			{
				owner: 'fu2',
				fileName: 'default-2A.web',
				ancestor: 'default.web',
				content: ['', '', ''],
				type: 'web',
				creationDate: new Date(),
				modifiedDate: new Date(),
				private: true
			},
			{
				owner: 'fu3',
				fileName: 'default-3A.web',
				ancestor: 'default.web',
				content: ['', '', ''],
				type: 'web',
				creationDate: new Date(),
				modifiedDate: new Date(),
				private: true
			},
			{
				owner: 'fu3',
				fileName: 'default-3B.web',
				ancestor: 'default.web',
				content: ['', '', ''],
				type: 'web',
				creationDate: new Date(),
				modifiedDate: new Date(),
				private: true
			},
			{
				owner: 'fu3',
				fileName: 'default-3C.web',
				ancestor: 'default.web',
				content: ['', '', ''],
				type: 'web',
				creationDate: new Date(),
				modifiedDate: new Date(),
				private: true
			},
			{
				owner: 'fu3',
				fileName: 'default-3D.web',
				ancestor: 'default.web',
				content: ['', '', ''],
				type: 'web',
				creationDate: new Date(),
				modifiedDate: new Date(),
				private: true
			},
			{
				owner: 'fu3',
				fileName: 'default-3E.web',
				ancestor: 'default.web',
				content: ['', '', ''],
				type: 'web',
				creationDate: new Date(),
				modifiedDate: new Date(),
				private: true
			},

			{
				owner: 'kp4',
				fileName: 'default.web',
				ancestor: 'default.web',
				content: ['', '', ''],
				type: 'web',
				creationDate: new Date(),
				modifiedDate: new Date(),
				private: false
			}
		];

		fixtures.forEach(function(element) {
			Files.insert(element);
		});
	}
});

