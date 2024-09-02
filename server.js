const webpush = require('web-push');
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();

const publicVapidKey = 'BGCOvhGtv8aUncRP-YVpc5nRFKUih7HVaGcaRFQ7jyRuMa9BMKFIG7V7cIYU1jFkOCBqutdcqzSG7bM0cSw59iw';
const privateVapidKey = 'GywNcbwVElL0woJLJh9VpNLZoVcNLs6ig1B9hOqbz4Q';

webpush.setVapidDetails('mailto:example@yourdomain.org', publicVapidKey, privateVapidKey);


app.use(cors());
app.use(bodyParser.json());

app.post('/subscribe', (req, res) => {
    const subscription = req.body;
    console.log('Subscription received:', subscription);

    
    res.status(201).json({ message: 'Subscription successful' });

   
    const payload = JSON.stringify({ title: 'Push Notification', body: 'This is a test push notification' ,icon:'./png.jpg',tag:"push notification"});
  
    webpush.sendNotification(subscription, payload)
        .then(response => console.log('Push sent:', response.json))
        .catch(error => { 
            console.error('Error sending push:', error);
            res.status(500).json({ error: 'Failed to send notification' });
        });
});
app.get('/login', (req, res) => {
    res.status(201).json({ message:"login Successful" });
    // const result = JSON.stringify({ content:"this is login page response from server"});
    res.status(201).json({ content:"this is login page response from server"})
})
app.listen(5500, () => {
    console.log('Server running on http://localhost:5500');
});
