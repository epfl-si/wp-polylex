import { useFind, useSubscribe } from 'meteor/react-meteor-data'
import React from 'react';
import { AppLogs } from '../../api/collections'
import moment from 'moment';
import { Loading } from '../Messages'


const getDate = (date) => {
  return moment(date).format("MM-DD-YYYY hh:mm:ss");
}

export const LogCells = (props) => {
  return (
      <tbody>
      { props.logs && props.logs.map( (log, index) => (
          <tr key={ log._id }>
            <td scope="row">{ index+1 }</td>
            <td>{ getDate(log.date) }</td>
            <td>{ log.userId }</td>
            <td>{ log.message }</td>
            { log.additional && log.additional.length ?
                <>
                  <td>{ JSON.stringify(log.additional.before, Object.keys(log.additional.before).sort(), 2) }</td>
                  <td>{ JSON.stringify(log.additional.after, Object.keys(log.additional.after).sort(), 2) }</td>
                </> :
                <>
                  <td></td>
                  <td></td>
                </>
            }
          </tr>
      ))}
      </tbody>
  );
}

export const Log = () => {
  const isLoading = useSubscribe('log.list');
  const logs = useFind(() => AppLogs.find({}, { sort: { date: -1 } }), []);

  if (isLoading()) {
    return <Loading />;
  } else {
    return (
        <>
          <h5 className="card-header">Liste des logs</h5>
          <table id="log" className="table table-striped">
            <thead>
            <tr>
              <th scope="col" style={ { width: "5%" } }>#</th>
              <th scope="col" style={ { width: "10%" } }>Date</th>
              <th scope="col" style={ { width: "10%" } }>Sciper</th>
              <th scope="col" style={ { width: "15%" } }>Message</th>
              <th scope="col" style={ { width: "30%" } }>Avant</th>
              <th scope="col" style={ { width: "30%" } }>Après</th>
            </tr>
            </thead>
            { logs &&
                <LogCells logs={ logs }/>
            }
          </table>
        </>
    );
  }
}

export default Log
