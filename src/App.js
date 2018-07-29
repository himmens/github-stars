import './App.css';
import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { hot } from 'react-hot-loader';
import { CartesianGrid, Legend, Line, LineChart, Tooltip, XAxis, YAxis } from 'recharts';
import { getDownloadsRanges } from './store/actions';

class App extends React.Component {
  componentDidMount() {
    const {dispatch} = this.props;
    dispatch(getDownloadsRanges('facebook/react'));
  }

  formatXAxis(time) {
    const date = new Date(time);
    const day = date.getDate();
    const month = date.getMonth() + 1;
    const year = date.getFullYear();
    const hours = date.getHours();
    const minutes = date.getMinutes();
    // return `${hours < 10 ? '0'+hours : hours}:${minutes < 10 ? '0'+minutes : minutes}`;
    return `${day < 10 ? '0'+day : day}/${month < 10 ? '0'+month : month}/${year}`;
  }

  render() {
    const {stars} = this.props;
    console.log('render stars:', stars);
    const repos = ['facebook/react'];
    const colors = ['#8884d8', '#82ca9d', '#11ca9d', '#62119d'];

    return (
      <div className="App">
        <LineChart width={500} height={300} data={stars}>
          <XAxis
            dataKey="date"
            type="number"
            domain={['dataMin', 'dataMax']}
            tickFormatter={this.formatXAxis}
          />
          <YAxis />
          <CartesianGrid stroke="#eee" strokeDasharray="5 5" />
          <Tooltip labelFormatter={this.formatXAxis} />
          <Legend />
          {repos.map((key, index) => (
            <Line
              key={key}
              type="monotone"
              dataKey="value"
              name={key}
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
  stars: PropTypes.arrayOf(PropTypes.object).isRequired,
};

function mapStateToProps(state) {
  return {
    stars: state.stars,
  };
}

export default connect(mapStateToProps)(hot(module)(App));