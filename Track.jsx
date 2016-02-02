// Track component - represents a single todo item
Track = React.createClass({
  propTypes: {
      // This component gets the track to display through a React prop.
      // We can use propTypes to indicate it is required
      track: React.PropTypes.object.isRequired,
      showPrivateButton: React.PropTypes.bool.isRequired
  },

  toggleChecked() {
    // Set the checked property to the opposite of its current value
    Meteor.call("setChecked", this.props.track._id, ! this.props.track.checked);
  },

  togglePrivate() {
    Meteor.call("setPrivate", this.props.track._id, ! this.props.track.private);
  },

  deleteThisTrack() {
    Meteor.call("removeTrack", this.props.track._id);
  },

  render() {
    // Give tracks a different className when they are checked off,
    // so that we can style them nicely in CSS
    const trackClassName = (this.props.track.checked ? "checked" : "") + " " + (this.props.track.private ? "private" : "");

    return (
      <li className={trackClassName}>
        <button className="delete" onClick={this.deleteThisTrack}>
          &times;
        </button>

        <input
          type="checkbox"
          readOnly={true}
          checked={this.props.track.checked}
          onClick={this.toggleChecked} />

        { this.props.showPrivateButton ? (
          <button className="toggle-private"
            onClick={this.togglePrivate}>
            { this.props.track.private ? "Private" : "Public" }
          </button>
        ) : ''}

        <span className="text">
          <strong>{this.props.track.username}</strong>: {this.props.track.text}
          
        </span>
      </li>
    );
  }

});