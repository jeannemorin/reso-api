const eventService = require('../services/eventService');
const Event = require('../models/eventModel');

class EventController {
  async getEventById(req, res) {
    try {
      const event = await eventService.getEventById(req.params.id);
      if (!event) {
        res.status(404);
        throw new Error('Event not found');
      }
      res.json(event);
    } catch (err) {
      if (err.name === 'CastError' && err.kind === 'ObjectId') {
        res.status(404);
        res.json({ error : 'Event not found' });
      } else {
        res.status(500);
        res.json({ error: err.message });
      }
    }
  }

  async getAllEvents(req, res) {
    try {
      const events = await eventService.getAllEvents();
      res.json(events);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }

  async createEvent(req, res) {

    const newEvent = new Event(req.body);

    try {
      await newEvent.save();
    }
    catch (err) {
      res.status(400).json({ error: err.name });
      return;
    }

    try {
      const event = await eventService.createEvent(newEvent);
      res.status(201).json(event);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }

  async updateEvent(req, res) {
    try {
      const event = await eventService.updateEvent(req.params.id, req.body);
      if (!event) {
        res.status(404);
        throw new Error('Event not found');
      }
      res.json(event);
    } catch (err) {
      if (err.name === 'CastError' && err.kind === 'ObjectId') {
        res.status(404);
        res.json({ error : 'Event not found' });
      } else {
        res.status(500);
        res.json({ error: err.message });
      }
    }
  }

  async deleteEvent(req, res) {
    try {
      const event = await eventService.deleteEvent(req.params.id);
      if (!event) {
        res.status(404);
        throw new Error('Event not found');
      }
      res.status(204).end();
    } catch (err) {
      if (err.name === 'CastError' && err.kind === 'ObjectId') {
        res.status(404);
        res.json({ error : 'Event not found' });
      } else {
        res.status(500);
        res.json({ error: err.message });
      }
    }
  }

  async search(req, res) {
    try {
      const events = await eventService.search(req.body);
      if (events.length == 0) {
        res.status(204);
      }
      res.json(events);
    } catch (err) {
      if (err.cause === 'FiltersError') {
        res.status(404);
        res.json({ error : err.message });
      } else {
      res.status(500).json({ error: err.message });
      }
    }
  }

  async getUpcomingEvents(req, res) {
    try {
      const events = await eventService.getUpcomingEvents();
      res.json(events);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }

  async getPastEvents(req, res) {
    try {
      const events = await eventService.getPastEvents();
      res.json(events);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }

  async getAttendees(req, res) {
    try {
      const event = await eventService.getEventById(req.params.id);
      if (!event) {
        res.status(404);
        throw new Error('Event not found');
      }
      res.json({ attendees: event.attendees });
    } catch (err) {
      if (err.name === 'CastError' && err.kind === 'ObjectId') {
        res.status(404);
        res.json({ error : 'Event not found' });
      } else {
        res.status(500);
        res.json({ error: err.message });
      }
    }
  }

  async getNumberofInterested(req, res) {
    try {
      const event = await eventService.getEventById(req.params.id);
      if (!event) {
        res.status(404);
        throw new Error('Event not found');
      }
      res.json({ numberOfInterrested : event.numberofInterrested });
    } catch (err) {
      if (err.name === 'CastError' && err.kind === 'ObjectId') {
        res.status(404);
        res.json({ error : 'Event not found' });
      } else {
        res.status(500);
        res.json({ error: err.message });
      }
    }
  }

  async getTicketingUrl(req, res) {
    try {
      const event = await eventService.getEventById(req.params.id);
      if (!event) {
        res.status(404);
        throw new Error('Event not found');
      }
      res.json({ ticketingUrl : event.ticketingUrl });
    } catch (err) {
      if (err.name === 'CastError' && err.kind === 'ObjectId') {
        res.status(404);
        res.json({ error : 'Event not found' });
      } else {
        res.status(500);
        res.json({ error: err.message });
      }
    }
  }
}

module.exports = new EventController();
