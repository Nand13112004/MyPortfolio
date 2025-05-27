const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
const port = 3000;

// Replace with your MongoDB connection string
const mongoURI = 'mongodb+srv://nand13112004:N1a3n1d1@cluster0.oelixeb.mongodb.net/sample_mflix?retryWrites=true&w=majority&appName=Cluster0';


mongoose.connect(mongoURI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const db = mongoose.connection;
db.on('error', (error) => console.error('MongoDB connection error:', error));
db.once('open', () => console.log('Connected to MongoDB database'));

const messageSchema = new mongoose.Schema({
  name: String,
  email: String,
  message: String,
}, { timestamps: true });

const Message = mongoose.model('Message', messageSchema);

app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use(express.static(__dirname));

app.post('/contact', async (req, res) => {
  const { name, email, message } = req.body;

  if (!name || !email || !message) {
    return res.status(400).send('All fields are required.');
  }

  try {
    const newMessage = new Message({ name, email, message });
    await newMessage.save();
    console.log('New message saved:', newMessage);
    res.status(200).send('Message sent successfully!');
  } catch (err) {
    console.error('Error saving message:', err);
    res.status(500).send('Error saving message.');
  }
});

app.get('/messages', async (req, res) => {
  try {
    const messages = await Message.find().select('name email message').exec();
    res.json(messages);
  } catch (err) {
    console.error('Error fetching messages:', err);
    res.status(500).send('Error fetching messages.');
  }
});

app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
