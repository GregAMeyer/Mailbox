app.controller('fullemailCtrl', function($scope, thread, threadFactory, $location, $anchorScroll, $rootScope, $state, $firebaseArray, userFactory) {

    $scope.thread;
    // $scope.team;
    $scope.assignedTo = thread.assignedTo ? thread.assignedTo.firstName : 'Assign';
    $scope.assignedBy = thread.assignedBy ? thread.assignedBy.firstName : null;
    $scope.deflectButton;
    $scope.replyOrCancel = 'Reply';

    // $scope.teammates;

    // $scope.getTeamMembers = function(teamId) {
    //     console.log('fullemailCtrl getting team members', teamId)
    //     userFactory.getTeamMembers(teamId)
    //     .then(function(teammates) {
    //         $scope.teammates = teammates;
    //         $scope.teammates.forEach(function(teammate) {
    //             if ($scope.onlineUsers.indexOf(teammate._id) > -1) {
    //                 teammate.isOnline = true;
    //             }
    //         })
    //     })
    // }

    // $scope.getTeamMembers($scope.team);

    $scope.gotoBottom = function() {
        $scope.thread = thread;
        // $location.hash('bottom');
        // $anchorScroll();
        setTimeout(function() {
            $location.hash('bottom');
            $anchorScroll();
        }, 10);
    };
    $scope.gotoBottom()

    if (window.location.pathname.indexOf("users") > -1) {
        $scope.deflectButton = true;
    }

    //   $scope.gotoBottomForChat = function(){
    // setTimeout(function(){
    // 	var duration = 200;
    // 	var offset = 30; //pixels; adjust for floating menu, context etc
    // 	var someElement = angular.element(document.getElementById('end'));
    // 	// $document.scrollToElement(someElement, offset, duration);
    // 	$document.scrollToElementAnimated(someElement).then(function(){
    // 		console.log('supposed to have scrolled', someElement )
    // 	})
    // }, 1500);
    //   };

    //   $scope.gotoBottomForChat = function() {
    // $scope.thread = thread;
    // setTimeout(function(){
    //   		$location.hash('bottom');
    //   		//$location.hash('end'); //either one works
    //     		$anchorScroll();
    // 		} , 1000);
    //   };

    // var someElement = angular.element(document.getElementById('end'));
    //  $document.scrollToElementAnimated(someElement);

    $scope.extractField = function(messageObj, fieldName) {
        return messageObj.googleObj.payload.headers.filter(function(header) {
            return header.name.toLowerCase() === fieldName.toLowerCase();
        })[0];
    };

    $scope.extractDate = function(messageObj) {
        return $scope.extractField(messageObj, "Date").value.split(" ").slice(0, 5).join(" ");
    }

    $scope.parseBody = function(body) {
        var regex = /On [A-z]{3}, [A-z]{3} [0-9]{1,2}, [0-9]{4} at [0-9]{1,2}:[0-9]{1,2} [A,P]M, /;
        if (body) return (body.split(regex))[0];
        return body;
    };

    $scope.showReply = function(index) {
        $scope.thread.messages[index].showReply = !$scope.thread.messages[index].showReply;
        $scope.replyOrCancel === 'Reply' ? $scope.replyOrCancel = 'Cancel' : $scope.replyOrCancel = 'Reply'
    };

    $scope.oneAtATime = false;

    $scope.status = {
        isFirstOpen: true,
        isFirstDisabled: false
    };

    var ref = new Firebase('https://amber-fire-4541.firebaseio.com');
    var threadRef = ref.child('thread-' + $scope.thread._id)
    $scope.chatMessages = $firebaseArray(threadRef);
    $scope.sendMessage = function(chatMessage) {
        chatMessage.name = $scope.user.firstName;
        $scope.chatMessages.$add(chatMessage)
        $scope.chatMessage.text = '';
    };

    $scope.assign = function(userChoice, threadToAssign, user) {
        threadFactory.assignUserToThread(userChoice._id, threadToAssign._id, user._id)
            .then(function(threadFound) {
                $scope.assignedTo = threadFound.data.assignedTo.firstName;
                if (window.location.pathname.indexOf("users") > -1) {
                    $state.go('home.userId', {
                        userId: $rootScope.user._id
                    }, {
                        reload: true
                    });
                } else {
                    $rootScope.$broadcast('threadAssignment');
                }
            })
    }

    $scope.createSnippet = function(body, from){
        console.log(from.length)
        var num = 60-from.length
        if (body.length > num) body = body.slice(0,num)+'...'
        return body;
    }
})

// threadFactory.assignUserToThread(userChoice._id, thread._id, user._id)
//     .then(function(thread) {
//         $scope.assignedTo = thread.data.assignedTo.firstName;
//         // if ($scope.thread.assignedTo && ($scope.thread.assignedTo._id === $rootScope.user._id)) {

//         //     // $state.go('home.userId', {
//         //     //     userId: $rootScope.user._id
//         //     // }, {
//         //     //     reload: true
//         //     // });
//         // }


//         //only broadcast this event for team inboxes
//         $rootScope.$broadcast('threadAssignment');