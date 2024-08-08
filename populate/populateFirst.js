const axios = require('axios');
const faker = require('faker');

const { MongoClient, ServerApiVersion } = require('mongodb');
const uri = "mongodb+srv://jeannemorin:7rJ7j7ARBwax6xBa@cluster0.5gdev.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";


MONGO_URL="mongodb+srv://jeannemorin:7rJ7j7ARBwax6xBa@cluster0.5gdev.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";

const client = new MongoClient(uri, {
    serverApi: {
      version: ServerApiVersion.v1,
      strict: true,
      deprecationErrors: true,
    }
  });

  const newUser = {
    name: "jeanne",
    password: "password"
  };

  async function createListing(client){
    const result = await client.db("sample_reso").collection("users").insertOne(newUser);
    console.log(`New listing created with the following id: ${result.insertedId}`);
}

// Function to register a user
const registerUser = async (client, user) => {
    const result = await client.db("sample_reso").collection("users").insertOne(user);
    console.log(`New User created with the following id: ${result.insertedId}`);
};

// Function to add an event
const addEvent = async (client, event) => {
  const result = await client.db("sample_reso").collection("events").insertOne(event);
  console.log(`New event created with the following id: ${result.insertedId}`);
};

// Generate a random event with markdown about text
const generateEvent = (attendees, status) => (
    {
  coverImageUrl: faker.image.imageUrl(),
  title: faker.company.catchPhrase(),
  author: faker.name.findName(),
  location: faker.address.city(),
  city: faker.address.city(),
  adress: faker.address.streetAddress(),
  dateTime: faker.date.future(),
  formattedDate: faker.date.future().toLocaleString(),
  status,
  price: faker.commerce.price(),
  about: faker.lorem.paragraphs(faker.datatype.number({ min: 5, max: 10 }), '\n\n'),
  ticketingUrl: faker.internet.url(),
  maxTicket: faker.datatype.number({ min: 50, max: 500 }),
  numberofInterrested: faker.datatype.number({ min: 1, max: 100 }),
  numberTicketsSold: faker.datatype.number({ min: 1, max: 50 }),
  attendees
});

const main = async () => {

    try {
        // Connect the client to the server	(optional starting in v4.7)
        await client.connect();
        // Send a ping to confirm a successful connection

        const users = [];
        for (let i = 0; i < 30; i++) {
            const username = faker.internet.userName();
            const password = faker.internet.password();
            const user = {username: username, password: password};
            await registerUser(client, user);

            users.push(user);
        }

        const userIds = users.map((user, index) => index + 1);

        for (let i = 0; i < 30; i++) {
            const attendees = faker.random.arrayElements(userIds, faker.datatype.number({ min: 1, max: 30 }));
            const event = generateEvent(attendees, faker.random.arrayElement(['price', 'free', 'sold_out']));
            await addEvent(client, event);
        }

        console.log('Users and events have been added.');
}
catch {
    console.log("Failed connexion")
}
await client.close();
};

main();
