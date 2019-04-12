// import React, { Component } from 'react';
// import Centaurus from '../../api';

// import { DataTable } from 'primereact/datatable';
// import { Column } from 'primereact/column';
// import { MultiSelect } from 'primereact/multiselect';
// import { InputText } from 'primereact/inputtext';

// import columnsTableClasses from '../../assets/json/columnsTableClasses.json';

// export default class TableClasses extends Component {
//   constructor() {
//     super();
//     const columnsClasses = columnsTableClasses;

//     this.state = {
//       colsClasses: columnsClasses,
//       globalFilter: null,
//       loading: false,
//       first: 0,
//       numberRows: 20,
//       totalRecords: 0,
//       rowsPerPageOptions: [5, 10, 20],
//       rows: [],
//     };

//     this.colOptionsClasses = [];

//     for (const col of columnsClasses) {
//       this.colOptionsClasses.push({ label: col.header, value: col });
//     }

//     this.onColumnToggleClasses = this.onColumnToggleClasses.bind(this);
//   }

//   onColumnToggleClasses(event) {
//     this.setState({ colsClasses: event.value });
//   }

//   componentDidMount() {
//     this.setState({
//       loading: true,
//     });

//     this.loadClasses();
//   }

//   loadClasses = async () => {
//     const classes = await Centaurus.getAllClasses();
//     if (classes && classes.productClassList && classes.productClassList.edges) {
//       const rows = classes.productClassList.edges.map(e => {
//         return {
//           displayName: e.node.displayName,
//           className: e.node.className,
//           typeName: e.node.productType ? e.node.productType.typeName : null,
//           typeDisplayName: e.node.productType
//             ? e.node.productType.displayName
//             : null,
//         };
//       });
//       this.setState({
//         rows,
//         loading: false,
//       });
//     } else {
//       this.setState({ loading: false });
//     }
//   };

//   render() {
//     const header = (
//       <div style={{ textAlign: 'left' }}>
//         <MultiSelect
//           value={this.state.colsClasses}
//           options={this.colOptionsClasses}
//           onChange={this.onColumnToggleClasses}
//         />
//         <br />
//         <InputText
//           type="search"
//           onInput={e => this.setState({ globalFilter: e.target.value })}
//           placeholder="Global Search"
//         />
//       </div>
//     );

//     const columnsClasses = this.state.colsClasses.map(col => {
//       return (
//         <Column
//           key={col.field}
//           field={col.field}
//           header={col.header}
//           sortable={true}
//         />
//       );
//     });

//     //let paginatorLeft = <Button icon="fa fa-refresh"/>;
//     //let paginatorRight = <Button icon="fa fa-cloud-upload"/>;

//     return (
//       <DataTable
//         header={header}
//         value={this.state.rows}
//         resizableColumns={true}
//         columnResizeMode="expand"
//         reorderableColumns={true}
//         reorderableRows={true}
//         responsive={true}
//         selectionMode="single"
//         selection={this.state.selectedCar1}
//         onSelectionChange={e => this.setState({ selectedCar1: e.data })}
//         scrollable={true}
//         paginator={true}
//         //paginatorLeft={paginatorLeft}
//         //paginatorRight={paginatorRight}
//         rows={this.state.numberRows}
//         rowsPerPageOptions={this.state.rowsPerPageOptions}
//         totalRecords={this.state.totalRecords}
//         loading={this.state.loading}
//         globalFilter={this.state.globalFilter}
//         paginatorTemplate="RowsPerPageDropdown PageLinks FirstPageLink PrevPageLink CurrentPageReport NextPageLink LastPageLink"
//       >
//         {columnsClasses}
//       </DataTable>
//     );
//   }
// }
