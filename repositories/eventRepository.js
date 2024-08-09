const Event = require('../models/eventModel');

class EventRepository {
  async getById(id) {
    return Event.findById(id);
  }

  async getAll() {
    return Event.find();
  }

  async create(eventData) {
    const event = new Event(eventData);
    return await event.save();
  }

  async update(id, event) {  
      return Event.findByIdAndUpdate(id, event, { new: true });
  }

  async delete(id) {
    return Event.findByIdAndDelete(id);
  }

  async search(filters) {
    return Event.find(filters).exec();
  }

  async getUpcoming() {
    return Event.find({ dateTime: { $gt: new Date() } }).exec();
  }

  async getPast() {
    return Event.find({ dateTime: { $lt: new Date() } }).exec();
  }
}

module.exports = new EventRepository();
