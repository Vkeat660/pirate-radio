Tracks = new Mongo.Collection("tracks");

if (Meteor.isClient) {
  // Code that is executed on the client only
  Accounts.ui.config({
    passwordSignupFields: "USERNAME_ONLY"
  });

  Meteor.subscribe("tracks");

  Meteor.startup(function () {
    // Use Meteor.startup to render the component after the page is ready
    React.render(<App />, document.getElementById("render-target"));

  });


  // YouTube API will call onYouTubeIframeAPIReady() when API ready.
    // Make sure it's a global variable.
    onYouTubeIframeAPIReady = function () {

        // New Video Player, the first argument is the id of the div.
        // Make sure it's a global variable.
        player = new YT.Player("player", {

            height: "400", 
            width: "600", 

            // videoId is the "v" in URL (ex: http://www.youtube.com/watch?v=LdH1hSWGFGU, videoId = "LdH1hSWGFGU")
            videoId: "LdH1hSWGFGU", 

            // Events like ready, state change, 
            events: {

                onReady: function (event) {

                    // Play video when player ready.
                    event.target.playVideo();
                }

            }

        });

    };

    YT.load();
}

if (Meteor.isServer) {
  Meteor.publish("tracks", function () {
    return Tracks.find({
      $or: [
        { private: {$ne: true} },
        { owner: this.userId}
      ]
    });
  });
}

Meteor.methods({
  addTrack(text, url) {
    // Make sure the user is logged in before inserting a track
    if (! Meteor.userId()) {
      throw new Meteor.Error("not-authorized");
    }

    Tracks.insert({
      text: text,
      url: url,
      createdAt: new Date(),
      owner: Meteor.userId(),
      username: Meteor.user().username
    });
  },

  removeTrack(trackId) {

    const track = Tracks.findOne(trackId);
    if (track.private && track.owner !== Meteor.userId()) {
      // If the track is private, make sure only the owner can delete
      throw new Meteor.Error("not-authorized");
    }

    Tracks.remove(trackId);
  },

  setChecked(trackId, setChecked) {
    const track = Tracks.findOne(trackId);
    if (track.private && track.owner !== Meteor.userId()) {
      // if the track is private, make sure only the owner can check it
      throw new Meteor.Error("not-authorized");
    }

    Tracks.update(trackId, {$set: {checked: setChecked}});
  },

  setPrivate(trackId, setToPrivate) {
    const track = Tracks.findOne(trackId);

    // Make sure only the track owner can make a track private
    if (track.owner !== Meteor.userId()) {
      throw new Meteor.Error("not-authorized");
    }

    Tracks.update(trackId, { $set: { private: setToPrivate} });

  }
});
