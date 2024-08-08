const eventRepository = require('../repositories/eventRepository');
const Event = require('../models/eventModel');

class EventService {
  async getEventById(id) {
    return eventRepository.getById(id);
  }

  async getAllEvents() {
    return eventRepository.getAll();
  }

  async createEvent(event) {
    return eventRepository.create(event);
  }

  async updateEvent(id, event) {
    return eventRepository.update(id, event);
  }

  async deleteEvent(id) {
    return eventRepository.delete(id);
  }

  async search(filters) {
    const validFilters = Object.keys(Event.schema.paths);
    const invalidFilters = Object.keys(filters).filter(key => !validFilters.includes(key));
    
    if (invalidFilters.length > 0)
      throw new Error(`Invalid parameter ${invalidFilters[0]}`, {cause: "FiltersError"});
    return eventRepository.search(filters);
  }

  async getUpcomingEvents() {
    return eventRepository.getUpcoming();
  }

  async getPastEvents() {
    return eventRepository.getPast();
  }

  async getAttendees(id) {
    return eventRepository.getById(id);
  }

  async getNumberofInterested(id) {
    return eventRepository.getById(id).numberofInterested;
  }

  async getTicketingUrl(id) {
    return eventRepository.getById(id).ticketingUrl;
  }
}

module.exports = new EventService();
