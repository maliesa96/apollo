# Apollo

![Apollo admin view](https://github.com/maliesa96/apollo/blob/master/screenshots/admin_page.png)

Apollo is an open source, real-time polling application akin to platforms such as Poll Everywhere and Survey Monkey. It uses Django Channels for to add websocket support to Django and Redis as the websocket channel layer.
The end goal is to have a reliable, easy to setup web application that can be installed on a Raspberry Pi and will serve as a viable alternative to the paid services mentioned, particularly in academic and corporate environments.

At this time Apollo's functionality is limited to:
* Starting either a multiple choice, binary (yes/no), or numeric poll
* viewing real-time responses in a bar graph/pie chart
* exporting and downloading the results in CSV format

## Usage

Make sure you have redis installed via docker, then run:

`docker run -p 6379:6379 -d redis:2.8`

This starts the redis server. We then use daphne to listen for both HTTP and Websocket requests on 0.0.0.0:8001.

`daphne -p 8001 -b 0.0.0.0 apollo.asgi:application`



TODO:
* Add login functionality
* implement the private and anonymous poll options
* implement the poll history page
* implement the recent polls column
