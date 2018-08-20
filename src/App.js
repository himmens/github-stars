import './App.css';
import React from 'react';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';
import {hot} from 'react-hot-loader';
import {CartesianGrid, Legend, Line, LineChart, Tooltip, XAxis, YAxis} from 'recharts';
import {getStarsHistory} from './store/actions';
import {getAllHistory} from './store/reducer';

class App extends React.Component {
  constructor(props) {
    super(props);
    this.onInputKeyDown = this.onInputKeyDown.bind(this);
  }

  onInputKeyDown(event) {
    if (event.keyCode === 13) { // ENTER
      const {dispatch} = this.props;
        dispatch(getStarsHistory(event.target.value.split(',')));
    }
  }

  formatXAxis(time) {
    const date = new Date(time);
    const day = date.getDate();
    const month = date.getMonth() + 1;
    const year = date.getFullYear();
    // const hours = date.getHours();
    // const minutes = date.getMinutes();
    // return `${hours < 10 ? '0'+hours : hours}:${minutes < 10 ? '0'+minutes : minutes}`;
    return `${day < 10 ? '0' + day : day}/${month < 10 ? '0' + month : month}/${year}`;
  }

  render() {
    const {history} = this.props;
    console.log('render history:', history);
    const colors = ['#8884d8', '#82ca9d', '#11ca9d', '#62119d'];

    const mergedData = [];
    const repos = Object.keys(history);
    for (let p of repos) {
      const arr = history[p];
      for (let i = 0; i < arr.length; i++) {
        mergedData.push({date: arr[i].date, [p]: arr[i].value});
      }
    }
    console.log('mergedData:', mergedData);

    return (
      <div className="App">
        <input
          width="100%"
          defaultValue={'facebook/react,angular/angular,vuejs/vue'}
          onKeyDown={this.onInputKeyDown}
        />

        <LineChart width={500} height={300} data={mergedData}>
          <XAxis
            dataKey="date"
            type="number"
            domain={['dataMin', 'dataMax']}
            tickFormatter={this.formatXAxis}
          />
          <YAxis />
          <CartesianGrid stroke="#eee" strokeDasharray="5 5"/>
          <Tooltip labelFormatter={this.formatXAxis}/>
          <Legend />
          {repos.map((key, index) => (
            <Line
              key={key}
              dataKey={key}
              name={key}
              type="monotone"
              stroke={colors[index]}
            />
          ))}
        </LineChart>
      </div>
    );
  }
}

App.propTypes = {
  dispatch: PropTypes.func.isRequired,
  history: PropTypes.objectOf(PropTypes.array).isRequired,
};

function mapStateToProps(state) {
  return {
    history: getAllHistory(state),
  };
}

export default connect(mapStateToProps)(hot(module)(App));