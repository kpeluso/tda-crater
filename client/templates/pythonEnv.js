// ace editor from atmosphere.js > arch:ace-editor
// http://www.skulpt.org/#

import skulpt from 'skulpt';

var totalPanels = 3;

Template.pythonEnv.helpers({
	'file': function() {
		return {}
	}
});

// output functions are configurable.  This one just appends some text
// to a pre element.
function outf(text) {
	var mypre = document.getElementById("py_outputPanel");
	mypre.innerHTML = mypre.innerHTML + text;
}

function builtinRead(x) {
	if (Sk.builtinFiles === undefined || Sk.builtinFiles["files"][x] === undefined)
		throw "File not found: '" + x + "'";
	return Sk.builtinFiles["files"][x];
}

function panelToggleClick(event, template) {
	// button CSS
	template.$('#' + event.target.id).toggleClass("py_active");
	template.$('#' + event.target.id).removeClass("py_highlightedButton");
	var panelId = template.$('#' + event.target.id).attr("id") + "Panel";
	// edit hidden panel count
	template.$('#'+ event.target.id + 'Panel').toggleClass("py_hidden");
	var numberOfActivePanels = totalPanels - template.$('.py_hidden').length;
	// reform all panel sizes
	template.$('#py_inPanel').width(($(window).width() / numberOfActivePanels) - 10);
	template.$('#py_outputPanel').width(($(window).width() / numberOfActivePanels) - 10);
	template.$('#py_turtlePanel').width(($(window).width() / numberOfActivePanels) - 10);
}

function aceContent(option) {
	// automatically update content from Ace
	Tracker.autorun(function (e) {
		// console.log("python editor loaded");
		var editorPy = AceEditor.instance("py_inPanel", {
			theme:"dawn",
			mode:"python"
		});
		if(editorPy.loaded === true){
			e.stop();
			if (option) {
				Session.set("pyContent", editorPy.getValue());
			} else if (!option) {
				editorPy.insert(Session.get("pyContent"));
			}
		}
	});
}

Template.pythonEnv.events({
	'click #py_run': function(event, template) {
		// get content from Ace
		Tracker.autorun(function (e) {
			var editorPy = AceEditor.instance("py_inPanel", {
				theme:"dawn",
				mode:"python"
			});
			if(editorPy.loaded === true){
				e.stop();
				Session.set("pyContent", editorPy.getValue());
			}
		});
		// Skulpt
		var prog =  Session.get("pyContent");
		var mypre = document.getElementById("py_outputPanel");
		mypre.innerHTML = '';
		// // this is to test if the turtle library has been loaded
		// Sk.onAfterImport = function(library) {
		// 	switch(library) {
		// 		case 'turtle':
		// 			console.log('turtle loaded');
		// 			break;
		// 	}
		// }
		Sk.pre = "py_outputPanel"; // output
		Sk.configure({
			inputfun: function(prompt) {
				return window.prompt(prompt); // for raw_input() functionality
			},
			inputfunTakesPrompt: true,
			output: outf,
			read: builtinRead
		});
		(Sk.TurtleGraphics || (Sk.TurtleGraphics = {})).target = 'py_turtlePanel';
		var myPromise = Sk.misceval.asyncToPromise(function() {
			return Sk.importMainWithBody("<stdin>", false, prog, true);
		});
		myPromise.then(function(mod) {
			// console.log('Python - success');
		}, function(err) {
			console.log(err.toString());
		});
		template.$(".py_panel").height($(window).height() - template.$("#py_header").height() - 90); // resize output panel
	},
	'click #py_in': function(event, template) {
		panelToggleClick(event, template);
	},
	'mouseenter #py_in': function(event, template) {
		template.$('#py_in').addClass("py_highlightedButton");
	},
	'mouseleave #py_in': function(event, template) {
		template.$('#py_in').removeClass("py_highlightedButton");
	},
	'click #py_output': function(event, template) {
		panelToggleClick(event, template);
	},
	'mouseenter #py_output': function(event, template) {
		template.$('#py_output').addClass("py_highlightedButton");
	},
	'mouseleave #py_output': function(event, template) {
		template.$('#py_output').removeClass("py_highlightedButton");
	},
	'click #py_turtle': function(event, template) {
		panelToggleClick(event, template);
	},
	'mouseenter #py_turtle': function(event, template) {
		template.$('#py_turtle').addClass("py_highlightedButton");
	},
	'mouseleave #py_turtle': function(event, template) {
		template.$('#py_turtle').removeClass("py_highlightedButton");
	},
	'change .py_panel, keyup .py_panel': function(event, template) {
		Session.set("modifPy", true);
		aceContent(true);
		template.$(".py_panel").height($(window).height() - template.$("#py_header").height() - 90); // reset height
	},
	'mouseup .py_panel': function(event, template) {
		aceContent(true);
		template.$(".py_panel").height($(window).height() - template.$("#py_header").height() - 90); // reset height
	}
});

Template.pythonEnv.onRendered(function() {
	aceContent(false);
	// initial panel sizing
	this.$(".py_panel").height($(window).height() - this.$("#py_header").height() - 90);
	this.$(".py_panel").width(($(window).width() / 2) - 10);
});

