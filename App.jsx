// App component - represents the whole app
App = React.createClass({

  // This mixin makes the getMeteorData method work
  mixins: [ReactMeteorData],


  getInitialState() {
    return {
      hideCompleted: false
    }
  },

  // Loads items from the Tracks collection and puts them on this.data.Tracks
  getMeteorData() {

    let query = {};

    if (this.state.hideCompleted) {
      // If hide completed is checked, filter tracks
      query = {checked: {$ne: true}};
    }

    return {
      tracks: Tracks.find(query, {sort: {createdAt: -1}}).fetch(),
      incompleteCount: Tracks.find({checked: {$ne: true}}).count(),
      currentUser: Meteor.user()
    };

  },

  renderTracks() {
    return this.data.tracks.map((track) => {
      const currentUserId = this.data.currentUser && this.data.currentUser._id;
      const showPrivateButton = track.owner === currentUserId;
      return <Track key={track._id} track={track} showPrivateButton={showPrivateButton} />;
    });
  },

  handleSubmit(event) {
    event.preventDefault();

    // Find the text field via the React ref
    var text = React.findDOMNode(this.refs.textInput).value.trim();
    var url = React.findDOMNode(this.refs.urlInput).value.trim();

    Meteor.call("addTrack", text);

    // Clear form
    React.findDOMNode(this.refs.textInput).value = "";

  },

  toggleHideCompleted() {
    this.setState({
      hideCompleted: !this.state.hideCompleted
    });
  },

  render() {
    return (
      <div className="container">
        <header>
          <h1>Pirate Radio ({this.data.incompleteCount})</h1>

          <label className="hide-completed">
            <input
              type="checkbox"
              readOnly={true}
              checked={this.state.hideCompleted}
              onClick={this.toggleHideCompleted} />
            Hide Track
          </label>

          <AccountsUIWrapper />

          { this.data.currentUser ?
            <form className="new-track" onSubmit={this.handleSubmit}>
              <input type="text" ref="textInput" placeholder="Song Name" />
              <input type="text" ref="urlInput"  placeholder="Youtube URL" />
              <input type="submit" value="Submit song to playlist" />
            </form> : ''
          }

        </header>

        <ul>
          {this.renderTracks()}
        </ul>
      </div>
    );
  }
});