// App component - represents the whole app
App = React.createClass({

  // This mixin makes the getMeteorData method work
  mixins: [ReactMeteorData],

  // Loads items from the Tasks collection and puts them on this.data.Tasks
  getMeteorData() {
    return {
      tasks: Tasks.find({}).fetch()
    }
  },

  renderTasks() {
    return this.data.tasks.map((task) => {
      return <Task key={task._id} task={task} />;
    });
  },

  handleSubmit(event) {
    event.preventDefault();

    // Find the text field via the React ref
    var text = React.findDOMNode(this.refs.textInput).value.trim();

    Tasks.insert({
      text: text,
      createdAt: new Date()
    });

    // Clear form
    React.findDOMNode(this.refs.textInput).value = "";

  },

  render() {
    return (
      <div className="container">
        <header>
          <h1>Pirate Radio</h1>

          
          <form className="new-task" onSubmit={this.handleSubmit} >
            <input type="text" ref="textInput" placeholder="Type to add new tasks" />
          </form>

        </header>

        <ul>
          {this.renderTasks()}
        </ul>
      </div>
    );
  }
});