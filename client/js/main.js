var React = require('react');
var ReactDOM = require('react-dom');
var request = require('axios');

var Card = React.createClass({
  render: function() {
    if (!this.props.model) { return false; }

    return <ol className="card">
      {
        this.props.model.words.map(function (word) {
          return <li key={ word }>{ word }</li>;
        })
      }
    </ol>;
  }
});

var Button = React.createClass({
  handleClick: function (event) {
    event.stopPropagation();

    this.props.onPress();
  },
  render: function () {
    return <div className="button button--success"
        onClick={ this.handleClick }>
      Success!
    </div>;
  }
});

var Main = React.createClass({
  getInitialState: function () {
    return {
      card: null
    };
  },
  componentDidMount: function () {
    request.post('/game', {
      teams: [1,2]
    }).then(function (response) {
      var game = response.data;

      return request.get('/card', {
        params: {
          team: game.teams[0]
        }
      }).then(function (response) {
        this.setState({
          card: response.data
        });
      }.bind(this));

    }.bind(this));

  },
  render: function () {
    return <div>
      <Card model={ this.state.card } />
      <Button onPress={ this.handleSuccess } />
    </div>;
  },
  handleSuccess: function () {
    return request.put('/game/' + this.state.gameId, {
      team: this.state.teamId,
      state: 'success',
      card: this.state.cardId,
      line: this.state.line
    });
  }
});

ReactDOM.render(
  <Main />,
  document.getElementById('example')
);
