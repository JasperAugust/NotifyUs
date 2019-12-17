const router = require('express').Router();
let Report = require('../models/report.model');

/*  GET    /reports                         
    POST   /reports                         
    GET    /reports/{reportID}              
    PATCH  /reports/{reportID}              
    DELETE /reports/{reportID}              
*/

router.route('/').get((req, res) => {
  Report.find()
    .then(reports => {
      res.send(reports);
    })
    //todo error handling
    .catch(err => res.status(400).json('Error: ' + err));
});

router.route('/').post((req, res) => {
  const username = req.body.username;
  const description = req.body.description;
  const category = req.body.category;
  const location = req.body.location;
  const photo = req.body.photo;

  const newReport = new Report({
    username,
    description,
    category,
    location,
    photo,
  });

  newReport
    .save()
    .then(() => res.json('Report added!'))
    //todo error handling
    .catch(err => res.status(400).json('Error: ' + err));
});

router.route('/:id').get((req, res) => {
  Report.findById(req.params.id)
    .then(report => res.json(report))
    //todo error handling
    .catch(err => res.status(400).json('Error: ' + err));
});

router.route('/:id').delete((req, res) => {
  Report.findByIdAndDelete(req.params.id)
    .then(report => res.json('Report deleted'))
    //todo error handling
    .catch(err => res.status(400).json('Error: ' + err));
});

router.route('/:id').patch((req, res) => {
  Report.findByIdAndUpdate(req.params.id)
    .then(report => {
      report.username = req.body.username;
      report.description = req.body.description;
      report.category = req.body.category;
      report.location = req.body.location;
      report.photo = req.body.photo;

      report
        .save()
        .then(() => res.json('Report updated'))
        //todo error handling
        .catch(err => res.status(400).json('Error: ' + err));
    })
    //todo error handling
    .catch(err => res.status(400).json('Error: ' + err));
});

module.exports = router;
