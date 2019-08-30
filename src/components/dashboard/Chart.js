import React, { Fragment, useEffect } from "react";
import moment from "moment";
import {
  Card,
  CardHeader,
  CardContent,
  Typography,
  Grid
} from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import { connect } from "react-redux";
import Select from "react-select";
import makeAnimated from "react-select/animated";
import { LineChart, Line, XAxis, YAxis, Tooltip } from "recharts";
import * as actions from "../../store/actions";
import api from "../../store/api";

const animatedComponents = makeAnimated();

const useStyles = makeStyles({
  Header: {
    background: "linear-gradient(45deg, #FE6B8B 30%, #FF8E53 90%)"
  }
});

const Chart = props => {
  const classes = useStyles();
  const { onLoad, metrics, currentValue, subscribeUpdates } = props;
  const [selected, setSelected] = React.useState([]);
  useEffect(() => {
    onLoad();
    subscribeUpdates();
  }, [onLoad, subscribeUpdates]);
  const data = props.graphData;
  const defaultHeader = (
    <Fragment>
      <Grid container>
        {selected.map((s, key) => (
          <Grid key={key} item xs={2}>
            <Card>
              <CardHeader title={s} />
              <CardContent>
                <Typography variant="h3">{currentValue[s]}</Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      <Select
        options={metrics.map(item => ({ label: item, value: item }))}
        components={animatedComponents}
        isMulti
        onChange={event => {
          setSelected(event ? event.map(item => item.value) : []);
        }}
      />
    </Fragment>
  );

  if (selected.length === 0) {
    return (
      <Fragment>
        <CardHeader title="Chart" className={classes.Header} />
        <CardContent style={{ minHeight: 500 }}>{defaultHeader}</CardContent>
      </Fragment>
    );
  }
  return (
    <Fragment>
      <CardHeader title="Chart" className={classes.Header} />
      <CardContent style={{ minHeight: 800 }}>
        {defaultHeader}
        <LineChart
          width={1000}
          height={500}
          data={data}
          margin={{ top: 30, right: 30, bottom: 5, left: 50 }}
        >
          {selected.indexOf("oilTemp") > -1 && (
            <Line
              type="monotone"
              dot={false}
              activeDot={false}
              yAxisId={2}
              dataKey="oilTemp"
              stroke="#FF0000"
            />
          )}
          {selected.indexOf("injValveOpen") > -1 && (
            <Line
              type="monotone"
              dot={false}
              activeDot={false}
              yAxisId={0}
              dataKey="injValveOpen"
              stroke="#1100FF"
            />
          )}
          {selected.indexOf("tubingPressure") > -1 && (
            <Line
              type="monotone"
              dot={false}
              activeDot={false}
              yAxisId={1}
              dataKey="tubingPressure"
              stroke="#00770C"
            />
          )}
          {selected.indexOf("casingPressure") > -1 && (
            <Line
              type="monotone"
              dot={false}
              activeDot={false}
              yAxisId={1}
              dataKey="casingPressure"
              stroke="#B900AD"
            />
          )}
          {selected.indexOf("flareTemp") > -1 && (
            <Line
              type="monotone"
              dot={false}
              activeDot={false}
              yAxisId={2}
              dataKey="flareTemp"
              stroke="#C7A600"
            />
          )}
          {selected.indexOf("waterTemp") > -1 && (
            <Line
              type="monotone"
              dot={false}
              activeDot={false}
              yAxisId={2}
              dataKey="waterTemp"
              stroke="#3C392E"
            />
          )}
          <XAxis
            dataKey="at"
            domain={["dataMin - 100000", "auto"]}
            name="Time"
            tickFormatter={unixTime => moment(unixTime).format("HH:mm")}
            type="number"
          />
          <YAxis yAxisId={0} unit="%" orientation="left" stroke="#88f4d8" />
          <YAxis yAxisId={1} unit="PSI" orientation="left" stroke="#82ca9d" />
          <YAxis yAxisId={2} unit="F" orientation="left" stroke="#82ca9d" />
          <Tooltip />
        </LineChart>
      </CardContent>
    </Fragment>
  );
};

const mapDispatch = dispatch => ({
  onLoad: () => {
    dispatch({
      type: actions.FETCH_METRICS
    });
  },
  subscribeUpdates: () => {
    api.subscribeMetricsData().then(sub => {
      sub.subscribe(({ data }) => {
        dispatch({
          type: actions.METRICS_DATA_RECEIVED,
          metrics: data.newMeasurement
        });
      });
    });
  }
});

const mapState = state => ({
  metrics: state.metrics.metrics,
  graphData: state.metrics.graphData,
  currentValue: state.metrics.currentValue
});

export default connect(
  mapState,
  mapDispatch
)(Chart);
