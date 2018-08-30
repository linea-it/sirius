import React, { Component } from 'react';
import axios from 'axios';

import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { MultiSelect } from 'primereact/multiselect';
//import { Button } from 'primereact/button';
import { InputText } from 'primereact/inputtext';

import columnsTablePipelines from '../../assets/json/columnsTablePipelines.json';
//import dataTablePipelines from '../../assets/json/dataTablePipelines.json';

const URL = 'http://devel2.linea.gov.br/~singulani/pipelines.json';

export default class TablePipelines extends Component {
  constructor() {
    super();
    const columnsPipelines = columnsTablePipelines;

    this.state = {
      colsPipelines: columnsPipelines,
      globalFilter: null,
      loading: false,
      first: 0,
      rows: 20,
      totalRecords: 0,
      rowsPerPageOptions: [5, 10, 20],
      itens: URL,
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

    axios
      .get(URL)
      .then(response =>
        this.setState({
          itens: response.data,
          loading: false,
        })
      )
      .catch(() => {
        console.log('Erro ao recuperar os dados');
      });
  }

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
        value={this.state.itens}
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
        rows={this.state.rows}
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
