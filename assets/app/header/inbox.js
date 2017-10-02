app.directive('inbox', function (bunkerData, $state, $location, $anchorScroll) {
	return {
		templateUrl: '/assets/app/header/inbox.html',
		scope: {
			visible: '=ngIf'
		},
		controllerAs: 'inbox',
		bindToController: true,
		link: function (scope) {
			var elementsToSkip = 'li[ng-class="{active: header.inboxOpened}"], [inbox]';

			$(document)
				.on('click.bunker.inbox', scope.inbox.close)
				.on('click.bunker.inbox', elementsToSkip, function (e) { e.stopPropagation() })

			scope.$on('$destroy', function () {
				$(document).off('click.bunker.inbox');
			});
		},
		controller: function () {
			var inbox = this;

			inbox.messages = bunkerData.inbox;
			bunkerData.markInboxRead();

			inbox.clearInbox = function () {
				bunkerData.clearInbox();
				inbox.visible = false;
			};

			inbox.close = function () {
				inbox.visible = false;
			};

			inbox.goToRoom = function (message) {
				inbox.visible = false;

				//check if room still has message loaded
				var room = _.find(bunkerData.rooms, {_id: message.room});

				// go to loaded room's message
				if(_.some(room.$messages, {_id: message._id})){
					return $state.go('chat.room', {roomId: message.room})
						.then(function () {
							// scroll to message
							$location.hash(message._id);
							$anchorScroll();
						});
				}

				// otherwise load room history view
				var date = moment(message.createdAt).format('YYYY-MM-DD');
				$state.go('roomHistory', {roomId: message.room, date: date, message: message._id});
			};
		}
	};
});
