import React, { Component } from 'react';

import TablePipelines from '../../components/userInterfaces/TablePipelines';

export default class Pipelines extends Component {
    render() {
        return (
            <div>
                <h1>Pipelines</h1>
                <TablePipelines />
            </div>
        );
    }
}