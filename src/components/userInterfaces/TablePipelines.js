import React, { Component } from 'react';
import Centaurus from '../../api';

import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { MultiSelect } from 'primereact/multiselect';
import { InputText } from 'primereact/inputtext';

import columnsTablePipelines from '../../assets/json/columnsTablePipelines.json';

export default class TablePipelines extends Component {
  constructor() {
    super();
    const columnsPipelines = columnsTablePipelines;

    this.state = {
      colsPipelines: columnsPipelines,
      globalFilter: null,
      loading: false,
      first: 0,
      numberRows: 20,
      totalRecords: 0,
      rowsPerPageOptions: [5, 10, 20],
      rows: [],
    };

    this.colOptionsPipelines = [];

    for (const col of columnsPipelines) {
      this.colOptionsPipelines.push({ label: col.header, value: col });
    }

    this.onColumnTogglePipelines = this.onColumnTogglePipelines.bind(this);

    //this.onPage = this.onPage.bind(this);
  }

  onColumnTogglePipelines(event) {
    this.setState({ colsPipelines: event.value });
  }

  componentDidMount() {
    this.setState({
      loading: true,
    });

    this.loadPipelines();
  }

  loadPipelines = async () => {
    const pipelines = await Centaurus.getAllPipelines();
    if (pipelines && pipelines.pipelinesList && pipelines.pipelinesList.edges) {
      const rows = pipelines.pipelinesList.edges.map(e => {
        return {
          displayName: e.node.displayName,
          name: e.node.name,
          owner: e.node.user ? e.node.user.displayName : null,
          versionDate: e.node.versionDate,
          stage: e.node.pipelineStage ? e.node.pipelineStage.displayName : null,
          readme: e.node.readme,
          group: e.node.group ? e.node.group.displayName : null,
        };
      });
      this.setState({
        rows,
        loading: false,
      });
    } else {
      this.setState({ loading: false });
    }
  };

  render() {
    const header = (
      <div style={{ textAlign: 'left' }}>
        <MultiSelect
          value={this.state.colsPipelines}
          options={this.colOptionsPipelines}
          onChange={this.onColumnTogglePipelines}
        />
        <br />
        <InputText
          type="search"
          onInput={e => this.setState({ globalFilter: e.target.value })}
          placeholder="Global Search"
        />
      </div>
    );

    const columnsPipelines = this.state.colsPipelines.map(col => {
      return (
        <Column
          key={col.field}
          field={col.field}
          header={col.header}
          sortable={true}
        />
      );
    });

    //let paginatorLeft = <Button icon="fa fa-refresh"/>;
    //let paginatorRight = <Button icon="fa fa-cloud-upload"/>;

    return (
      <DataTable
        header={header}
        value={this.state.rows}
        resizableColumns={true}
        columnResizeMode="expand"
        reorderableColumns={true}
        reorderableRows={true}
        responsive={true}
        selectionMode="single"
        selection={this.state.selectedCar1}
        onSelectionChange={e => this.setState({ selectedCar1: e.data })}
        scrollable={true}
        paginator={true}
        //paginatorLeft={paginatorLeft}
        //paginatorRight={paginatorRight}
        rows={this.state.numberRows}
        rowsPerPageOptions={this.state.rowsPerPageOptions}
        totalRecords={this.state.totalRecords}
        loading={this.state.loading}
        globalFilter={this.state.globalFilter}
        paginatorTemplate="RowsPerPageDropdown PageLinks FirstPageLink PrevPageLink CurrentPageReport NextPageLink LastPageLink"
      >
        {columnsPipelines}
      </DataTable>
    );
  }
}
