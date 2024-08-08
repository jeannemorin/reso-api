const express = require('express');
const router = express.Router();
const eventController = require('../controllers/eventController');
const authMiddleware = require('../middleware/authMiddleware');

router.use(authMiddleware);

router.get('/:id/attendees/', eventController.getAttendees);
router.get('/:id/interested/', eventController.getNumberofInterested);
router.get('/:id/ticketingUrl/', eventController.getTicketingUrl);

router.get('/', eventController.getAllEvents);
router.post('/', eventController.createEvent);
router.put('/:id', eventController.updateEvent);
router.delete('/:id', eventController.deleteEvent);
router.get('/search', eventController.search);
router.get('/upcoming', eventController.getUpcomingEvents);
router.get('/past', eventController.getPastEvents);
router.get('/:id', eventController.getEventById);


router.use(function(req, res){
    res.sendStatus(600);
 });

module.exports = router;
