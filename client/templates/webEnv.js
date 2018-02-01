Template.webEnv.helpers({
	'file': function() {
		return {}
	}
});

function panelToggleClick(event, template) {
	// button CSS
	template.$('#' + event.target.id).toggleClass("web_active");
	template.$('#' + event.target.id).removeClass("web_highlightedButton");
	var panelId = template.$('#' + event.target.id).attr("id") + "Panel";
	// edit hidden panel count
	template.$('#'+ event.target.id + 'Panel').toggleClass("web_hidden");
	var numberOfActivePanels = 4 - template.$('.web_hidden').length;
	// reform all panel sizes
	template.$('#web_htmlPanel').width(($(window).width() / numberOfActivePanels) - 10);
	template.$('#web_cssPanel').width(($(window).width() / numberOfActivePanels) - 10);
	template.$('#web_jsPanel').width(($(window).width() / numberOfActivePanels) - 10);
	template.$('#web_outputPanel').width(($(window).width() / numberOfActivePanels) - 10);
}

function aceContent(option) {
	// option: true = set, false = get
	// content from Ace
	Tracker.autorun(function (e) {
		var editor1 = AceEditor.instance("web_htmlPanel", {
			theme:"dawn",
			mode:"html"
		});
		if(editor1.loaded === true){
			e.stop();
			if (option) {
				Session.set("htmlContent", editor1.getValue());

				console.log(Session.get("htmlContent"));

			} else if (!option) {
				editor1.insert(Session.get("htmlContent"));
			}
		}
	});
	Tracker.autorun(function (e) {
		var editor2 = AceEditor.instance("web_cssPanel", {
			theme:"dawn",
			mode:"css"
		});
		if(editor2.loaded === true){
			e.stop();
			if (option) {
				Session.set("cssContent", editor2.getValue());

				console.log(Session.get("cssContent"));

			} else if (!option) {
				editor2.insert(Session.get("cssContent"));
			}
		}
	});
	Tracker.autorun(function (e) {
		var editor3 = AceEditor.instance("web_jsPanel", {
			theme:"dawn",
			mode:"javascript"
		});
		if(editor3.loaded === true){
			e.stop();
			if (option) {
				Session.set("jsContent", editor3.getValue());

				console.log(Session.get("jsContent"));

			} else if (!option) {
				editor3.insert(Session.get("jsContent"));
			}
		}
	});
}

Template.webEnv.events({
	'click #web_html': function(event, template) {
		panelToggleClick(event, template);
	},
	'mouseenter #web_html': function(event, template) {
		template.$('#web_html').addClass("web_highlightedButton");
	},
	'mouseleave #web_html': function(event, template) {
		template.$('#web_html').removeClass("web_highlightedButton");
	},
	'click #web_css': function(event, template) {
		panelToggleClick(event, template);
	},
	'mouseenter #web_css': function(event, template) {
		template.$('#web_css').addClass("web_highlightedButton");
	},
	'mouseleave #web_css': function(event, template) {
		template.$('#web_css').removeClass("web_highlightedButton");
	},
	'click #web_js': function(event, template) {
		panelToggleClick(event, template);
	},
	'mouseenter #web_js': function(event, template) {
		template.$('#web_js').addClass("web_highlightedButton");
	},
	'mouseleave #web_js': function(event, template) {
		template.$('#web_js').removeClass("web_highlightedButton");
	},
	'click #web_output': function(event, template) {
		panelToggleClick(event, template);
	},
	'mouseenter #web_output': function(event, template) {
		template.$('#web_output').addClass("web_highlightedButton");
	},
	'mouseleave #web_output': function(event, template) {
		template.$('#web_output').removeClass("web_highlightedButton");
	},
	'change .web_panel, keyup .web_panel, mouseup .web_panel': function(event, template) {
		Session.set('modifWeb', true);
		aceContent(true);
		// display in output
		var ed1 = Session.get("htmlContent"); var ed2 = Session.get("cssContent"); var ed3 = Session.get("jsContent");
		template.$("iframe").contents().find("html").html("<html><head><style type='text/css'>" + ed2 + "</style></head><body>" + ed1 + "</body></html>");
		document.getElementById("web_outputPanel").contentWindow.eval(ed3);
		template.$(".web_panel").height($(window).height() - template.$("#web_header").height() - 90); // reset height
	},
	'mouseup .web_panel': function(event, template) {
		aceContent(true);
		// display in output
		var ed1 = Session.get("htmlContent"); var ed2 = Session.get("cssContent"); var ed3 = Session.get("jsContent");
		template.$("iframe").contents().find("html").html("<html><head><style type='text/css'>" + ed2 + "</style></head><body>" + ed1 + "</body></html>");
		document.getElementById("web_outputPanel").contentWindow.eval(ed3);
		template.$(".web_panel").height($(window).height() - template.$("#web_header").height() - 90); // reset height
	}
});

Template.webEnv.onRendered(function() {
	aceContent(false);
	// initial panel sizing
	this.$(".web_panel").height($(window).height() - this.$("#web_header").height() - 90);
	this.$(".web_panel").width(($(window).width() / 2) - 10);
	// display in output
	var ed1 = Session.get("htmlContent"); var ed2 = Session.get("cssContent"); var ed3 = Session.get("jsContent");
	this.$("iframe").contents().find("html").html("<html><head><style type='text/css'>" + ed2 + "</style></head><body>" + ed1 + "</body></html>");
	document.getElementById("web_outputPanel").contentWindow.eval(ed3);
	this.$('#web_htmlPanel').click(); // simulate click event on html panel to load content on output panel
});

