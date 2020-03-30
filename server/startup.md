# Server Documentation
------
## Starting Mongo Locally
#### Installation
First, install
[MongoDB Compass Community](https://docs.mongodb.com/manual/installation/#mongodb-community-edition-installation-tutorials) edition.

Once you have this installed, open your command prompt/terminal and type `mongo --version` to make
sure that it has been installed. If you get an error, then MongoDB was not properly installed.

In your terminal, navigate to the **Snip Snap**. Then run `mongod --dbpath="./server/data"` to
startup the MongoDB server for Snip Snap. This terminal must remain open to be able to access
the database.

Now run the MongoDB Compass Community edition you previously downloaded.
Click [Fill in connection fields individually]() next to New Connection.
Leave the fields blank and click connect.
This application allows you to visualize and modify the data in your database.

#### Starting the Node Server
To start the node server, navigate to the `Snip Snap` directory and run `node server/server.js`.
If you ran `mongod --dbpath="./server/data"` with no errors, the node server should've started
successfully.

Now the server should be up and running locally.
