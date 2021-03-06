var router = require('express').Router();
module.exports = router;

var mongoose = require('mongoose');
var TeamModel = mongoose.model('Team');
var ThreadModel = mongoose.model('Thread');

var Utils = require('../../configure/utilityFunctions')

router.get('/getAllEmails/:id', function(req, res) {
	TeamModel.findById(req.params.id)
		.populate('threads')
		.exec(function(err, teams) {
			var options = {
				path: 'threads.assignedTo',
				model: 'User'
			};

			if (err) return res.json(500);
			TeamModel.populate(teams, options, function(error, teamsPopulated) {
				res.json(teamsPopulated.threads);
			});
		})
})


router.get('/syncInbox/:teamId', function(req, res) {
	var globalTeam;
	var googleResponse;
	TeamModel.findById(req.params.teamId)
		.then(function(team) {
			// console.log('found this team in database', team)
			globalTeam = team;
			return Utils.syncInbox(globalTeam)
		})
		.then(function(googleResp) {
			googleResponse = JSON.parse(googleResp)

			// console.log('googleResp', googleResp)
			return Utils.saveSync(googleResponse, globalTeam)
		})
		.then(function(saveResult) {
			console.log('saveResult', saveResult)
			globalTeam.historyId = googleResponse.historyId;
			return globalTeam.save()
		})
		.then(function() {
			res.status(200).send('complete')
		})
})

// PUT EVERYTHING ABOVE THIS WEIRD ROUTE
router.get('/:threadId', function(req, res) {
	ThreadModel.findById(req.params.threadId)
		.populate('messages')
		.populate('assignedTo')
		.populate('assignedBy')
		.exec()
		.then(function(thread) {
			// console.log(thread)
			thread.messages.forEach(function(message) {
					Utils.decode(message)
				})
				// console.log('the googleObj', thread.messages[0].googleObj.payload.parts)
			res.send(thread)
		})
})