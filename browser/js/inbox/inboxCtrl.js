app.controller('inboxCtrl', function($rootScope, $scope, $state, threads, Socket, teamFactory, team, inboxFactory) {
	$scope.inboxTeam = $scope.team || team;
	$scope.threads = threads;
	// console.log('these are the users threads:', assignedThreads)
	$scope.assignedTo;

	$rootScope.$on('threadAssignment', function() {
		$scope.refreshThreads();
	})

	$scope.goToTeamThread = function(threadId) {
		console.log('still hitting this')
		$state.go('home.teamId.threadId', {
			threadId: threadId
		})
	};

	$scope.goToUserThread = function(threadId) {
		console.log('trying to go to user')
		$state.go('home.userId.threadId', {
			threadId: threadId
		})
	};

	$rootScope.$on('synced', function() {
		console.log('heard it')
		$scope.refreshThreads();
	})

	$scope.refreshThreads = function() {
		console.log('log this');
		if ($scope.inboxTeam) {
			teamFactory.getThisTeamsGmailThreadsId($scope.inboxTeam._id)
				.then(function(threads) {
					$scope.threads = threads;
				})
		} else {
			console.log('user assignments')
		}
	};

	$scope.cleanName = function(name) {
		var regex = / <.+>/
		return name.replace(regex, '')
	}

	$scope.simplifyDate = function(date) {
		return moment(date * 1).format("MMM DD h:mm a")
	}

	$scope.syncInbox = function() {
		console.log('syncing')
		inboxFactory.syncInbox($scope.inboxTeam._id)
	}
})