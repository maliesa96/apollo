# Apollo

![Apollo admin view](https://github.com/maliesa96/apollo/blob/master/screenshots/admin_page.png)

Apollo is an open source, real-time polling application akin to platforms such as Poll Everywhere and Survey Monkey. It uses Django Channels to add websocket support to Django and Redis as the websocket channel layer.
The end goal is to have a reliable, easy to setup web application that can be installed on a Raspberry Pi and will serve as a viable alternative to the paid services mentioned, particularly in academic and corporate environments.

At this time Apollo's functionality is limited to:
* Starting either a multiple choice, binary (yes/no), or numeric poll
* viewing real-time responses in a bar graph/pie chart
* exporting and downloading the results in CSV format

## Usage

If you want devices on the network to be able to access Apollo, you'll have to make sure your server's LAN IP address is added to ALLOWED_HOSTS for Django to allow connections to it. In your settings.py file:

```
ALLOWED_HOSTS = [
  "192.168.1.10", //Replace with your IP address
  "127.0.0.1",
]
```

Make sure you have redis installed via docker, then run:

`docker run -p 6379:6379 -d redis:2.8`

This starts the redis server. We then use daphne to listen for both HTTP and Websocket requests on 0.0.0.0:8001.

`daphne -p 8001 -b 0.0.0.0 apollo.asgi:application`

Thats all there is to it. You can now create a poll by navigating to your server's IP address. In the above example, entering `http://192.168.1.10:8001` in the browser would take you to Apollo's home page. From here, you can enter your poll's title and options, and Apollo will automatically generate a room ID, shown in the top right corner of the admin page. Users can join this room and vote by entering in the URL manually (ex. `http://192.168.1.10:8001/xyz123`) or by going the home page and typing in the room ID with a hashtag (ex. `#xyz123`) in the input field.

Note that the admin page can only be accessed from the same browser session for now. In the future, the admin page will be linked to the poll creator's account.

TODO:
* Add login functionality
* implement the private and anonymous poll options
* implement the poll history page
* implement the recent polls column
