# dedotated-wam

Server side code in Express, Socket.io and MongoDB

## Welcome to dedotated-wam
This repo is the server side repo code for handling our game server logic. 

It communicates with the client using socket.io within express for real-time communication, and (hopefully) communicates with the Unity server by using GET and POST methods using plain express.js

#### To do
- Get a mongoDB instance running :white_check_mark:
- Figure out mongo database structure
- Get things storing/retreiving out of mongo database :white_check_mark:
- After that try to send/receive basic data from [mobilia](https://github.com/polygon-studios/mobilia)  (front-end client code)

As of Sept 11th the following:
### Server
This code is hosted on a digitalocean droplet with IP address http://45.55.90.100/
And has:
- Nginx for rebooting/persistence
- Nginx to be able to use port :80 instead of :3000


### Code
Has:
- Node, NPM, ExpressJS, Nginx
- Form demo storing info in the session (no connection to mongo)
- Code base is stored in /home/iryanclarke/dedotated-wam
- Has an example codebase running that connects to and works with the persistent monga database


### Server commands:
- sudo start dedotated-wam
- sudo stop dedotated-wam
- sudo restard dedotated-wam


