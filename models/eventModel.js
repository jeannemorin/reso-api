const mongoose = require('mongoose');

const eventSchema = new mongoose.Schema({
  coverImageUrl: { 
    type: String, 
    required: [true, 'Oops! We need a cover image URL to make the event look fabulous!'] 
  },
  title: { 
    type: String, 
    required: [true, 'Come on! Give us a catchy title for the event.'] 
  },
  author: { 
    type: String, 
    required: [true, 'Who’s organizing this amazing event? We need an author!'] 
  },
  
  location: { 
    type: String 
  },
  address: { 
    type: String, 
    required: [true, 'Every event needs an address! Where should people go?'] 
  },
  city: { 
    type: String, 
    required: [true, 'Don’t forget the city! We need to know where the event is happening.'] 
  },

  dateTime: { 
    type: Date, 
    required: [true, 'When is the event? We need the date and time to add it to our calendar.'] 
  },
  formattedDate: { 
    type: String 
  },

  status: { 
    type: String, 
    enum: ['price', 'free', 'sold_out'],
    required: [true, 'Status is required! Is the event free, priced, or sold out?'] 
  },
  price: { 
    type: Number, 
    required: [function() {
      return this.status != 'free';}, 'We need the price of the event. Is it free or does it cost something?'] 
  },

  about: { 
    type: String, 
    required: [true, 'Tell us about the event! A description is needed to attract attendees.'] 
  },
  type: { 
    type: String, 
    enum: ['intern', 'extern'],
    required: [true, 'What type of event is it? Is it internal or external?'] 
  },
  ticketingUrl: { 
    type: String, 
    required: [true, 'We need a ticketing URL. How can people buy tickets?'] 
  },
  maxTicket: { 
    type: Number, 
    required: [true, 'Maximum tickets are needed! How many tickets are available?'] 
  },
  numberofInterrested: { 
    type: Number 
  },
  numberTicketsSold: { 
    type: Number 
  },
  attendees: { 
    type: [Number] 
  }
});

eventSchema.index({ city: 1, type: 1, status: 1 });

const Event = mongoose.model('Event', eventSchema);
module.exports = Event;
