app.directive('inputBox', function ($stateParams, bunkerData, emoticons, keycode) {
	return {
		template: `
		<div class="container-fluid message-input" 
			ng-show="$root.roomId">
			<div class="row">
				<form class="col-md-10 no-gutter">
					<textarea rows="1" class="form-control"></textarea>
				</form>
			</div>
		</div>
		`,
		link: function (scope, elem) {
			var searching;
			var searchTerm = "";
			var inputBox = $('textarea', elem);
			var container = $('.message-input', elem);

			container.qtip({
				content: {
					text: 'Open at the mouse position!'
				},
				position: {
					my: 'bottom left',
					at: 'top left'
				},
				show: {
					event: false
				}
			});

			var tooltip = container.qtip('api');

			inputBox.keydown(e => {
				var key = keycode(e);
				// console.log(key);

				var handler = handlers[key];
				if (handler) {
					var allDone = handler(e);
					if (allDone) return;
				}

				console.log(searching, key)

				if (!searching) return;
				searchers[searching](key);
			});

			var handlers = {
				'enter': enterHandler,
				'backspace': backspaceHandler,
				';': emoticonHandler
			};

			function emoticonHandler(e) {
				if (!e.shiftKey) return;

				if (searching == 'emoticons') {
					searching = null;
					tooltip.toggle(false);
					return;
				}

				searching = 'emoticons';
				tooltip.toggle(true);

				return true;
			}

			function enterHandler(e) {
				e.preventDefault();

				return bunkerData.createMessage($stateParams.roomId, inputBox.val())
					.then(() => inputBox.val(''));
			}

			function backspaceHandler() {
				if (!searchTerm.length) {
					searching = null;
				}

				searchTerm = searchTerm.slice(0, -1);
			}

			var searchers = {
				'emoticons': searchForEmoticons,
				null: _.noop
			};

			function searchForEmoticons(key) {
				// only allow single letters/numbers on search term
				var singleLetterNumber = /^[\w\d\._]{1}$/g;
				if(singleLetterNumber.test(key)){
					searchTerm += key;
				}

				var matchingEmoticons = _.filter(emoticons.names, name => name.indexOf(searchTerm) == 0);

				console.log(searchTerm, matchingEmoticons)
			}
		}
	}
});
