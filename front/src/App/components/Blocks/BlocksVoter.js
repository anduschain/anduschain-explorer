// base
import React from 'react';
import {substring} from '../../../helper';
// import 'react-perfect-scrollbar';
import 'react-perfect-scrollbar/dist/css/styles.css';
import PerfectScrollbar from 'react-perfect-scrollbar';

// components
import { Button } from '../../components';

// assets
import './blocksVoter.scss';

const BlocksVoter = (props) => {
    return (
      <PerfectScrollbar>
        <div className="BlocksVoter">
          <table className="table_type02 blocksVoter_table">
            <tbody>
            {
              props.blockVoter.length > 0 &&
                props.blockVoter.map((item,i)=> (
                  <tr key = {i}>
                    <td>Voter {i+1}</td>
                    <td>
                      <Button color="blue" size="wide" link={`/account/${item.voter}`}>
                        {substring(item.voter)}
                      </Button>
                    </td>
                  </tr>
              ))
            }
            </tbody>
          </table>
        </div>
      </PerfectScrollbar>
    )
};

BlocksVoter.defaultProps = {
  blockVoter : [],
};

export default BlocksVoter
