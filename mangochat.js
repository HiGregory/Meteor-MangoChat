// This code is running on both the client and server.
Messages = new Mongo.Collection("msgs");

//This code below only runs on the server. 
if (Meteor.isServer) {
  Meteor.publish("messages", function () {
    // This code is a standard MongoDB query that limits the amount of messages to 5 for this web app. 
    return Messages.find({}, {sort: {createdAt: -1}, limit: 5});
  });
}

// This code below only runs on the client
if (Meteor.isClient) {
  Meteor.subscribe("messages");
}

Meteor.methods({
  sendMessage: function (message) {
    //The code does not permit anyone to make a message without signing in first. 
    if (! Meteor.userId()) {
      throw new Meteor.Error("not-authorized");
     }

    Messages.insert({
      text: message,
      createdAt: new Date(),
      username: "anonymous"
    });
  }
});

if (Meteor.isClient) {
  Template.body.helpers({
    recentMessages: function () {
      return Messages.find({}, {sort: {createdAt: 1}});
    }
  });

  Template.body.events({
    "submit .new-message": function (event) {
      var text = event.target.text.value;

      Meteor.call("sendMessage", text);

      event.target.text.value = "";
      return false;
    }
  });

//The code below allows the user to log in with their username and password. 
  Accounts.ui.config({
  passwordSignupFields: "USERNAME_ONLY"
   });
}

