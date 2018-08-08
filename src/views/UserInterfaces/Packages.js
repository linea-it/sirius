import React, { Component } from 'react';

import TablePipelines from '../../components/userInterfaces/TablePipelines';

export default class Packages extends Component {
    render() {
        return (
            <div>
                <h1>Packages</h1>
                <TablePipelines />
            </div>
        );
    }
}