app.factory('teamFactory', function($http) {

    return {
        getAllTeams: function() {
            return $http.get('/api/teams')
        },
        getUserTeams: function(userId) {
            return $http.get('/api/users/' + userId)
        },
        getThisTeamsGmailThreads: function(team) {
            return $http.get('/api/google/getAllEmails/' + team._id)
                .then(function(threads) {
                    return threads.data
                })
        },
        /////////for state
        getThisTeamsGmailThreadsId: function(teamId) {
            return $http.get('/api/google/getAllEmails/' + teamId)
                .then(function(threads) {
                    return threads.data
                })
        },
        /////////////////
        getThisEmailFromTheThread: function(threadId) {
            return $http.get('/api/google/'+ threadId)
                .then(function(fullEmail) {
                    return fullEmail.data
                })
        },
        createTeam: function(name, email) {
            return $http.post('/api/teams/createTeam', {
                name: name,
                email: email
            });
        },
        // getThisTeam: function(teamId){
        //     return $http.get('/api/teams/'+teamId)
        //     .then(function(team){
        //         return team.data
        //     })
        // }
    };

});