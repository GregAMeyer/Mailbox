app.controller('fullemailCtrl', function($scope, $sce) {
	$scope.extractField = function(messageObj, fieldName) {
		return messageObj.googleObj.payload.headers.filter(function(header) {
			return header.name === fieldName;
		})[0];
	};
	$scope.parseBody = function(body){
		var regex = /On [A-z]{3}, [A-z]{3} [0-9]{1,2}, [0-9]{4} at [0-9]{1,2}:[0-9]{1,2} [A,P]M, /;
		// $scope.myHTML = body;
		if (body) return (body.split(regex))[0];
		return body;
	};

	// $scope.html = $sce.trustAsHtml($scope.someHtml);
})