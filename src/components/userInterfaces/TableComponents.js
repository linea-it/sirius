import * as React from 'react';
import PropTypes from 'prop-types';
import Paper from '@material-ui/core/Paper';
import { withStyles } from '@material-ui/core/styles';
import {
  PagingState,
  CustomPaging,
  SelectionState,
} from '@devexpress/dx-react-grid';
import {
  Grid,
  Table,
  TableHeaderRow,
  TableColumnVisibility,
  PagingPanel,
  TableColumnResizing,
  ColumnChooser,
  Toolbar,
  TableSelection,
} from '@devexpress/dx-react-grid-material-ui';

import CircularProgress from '@material-ui/core/CircularProgress';

import Centaurus from '../../api';

const styles = {
  wrapPaper: {
    position: 'relative',
    paddingTop: '10px',
  },
};

class TableClasses extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = this.initialState;
  }

  get initialState() {
    return {
      columns: [
        { name: 'displayName', title: 'Name' },
        { name: 'name', title: 'Class' },
        { name: 'version', title: 'Version' },
        { name: 'pipeline', title: 'Pipeline' },
        { name: 'owner', title: 'Owner' },
        { name: 'moduleId', title: 'Module' },
      ],
      defaultColumnWidths: [
        { columnName: 'displayName', width: 200 },
        { columnName: 'name', width: 200 },
        { columnName: 'version', width: 200 },
        { columnName: 'pipeline', width: 200 },
        { columnName: 'owner', width: 200 },
        { columnName: 'moduleId', width: 100 },
      ],
      data: [],
      totalCount: 0,
      pageSize: 10,
      pageSizes: [5, 10, 15],
      currentPage: 0,
      loading: true,
      after: '',
      selection: [],
    };
  }

  static propTypes = {
    classes: PropTypes.object.isRequired,
  };

  componentDidMount() {
    this.loadData();
  }

  changeCurrentPage = currentPage => {
    var offset = currentPage * this.state.pageSize;

    const after = window.btoa('arrayconnection:' + (offset - 1));
    this.setState(
      {
        loading: true,
        currentPage,
        after: after,
      },
      () => this.loadData()
    );
  };

  changePageSize = pageSize => {
    const { totalCount, currentPage: stateCurrentPage } = this.state;
    const totalPages = Math.ceil(totalCount / pageSize);
    const currentPage = Math.min(stateCurrentPage, totalPages - 1);

    this.setState(
      {
        loading: true,
        pageSize,
        currentPage,
      },
      () => this.loadData()
    );
  };

  handleSelection = selected => {
    this.setState({ selected: selected });
  };

  changeSelection = selection => {
    // Neste caso a selecao e para uma linha apenas,
    var selected_id, selectedRow;
    if (selection.length > 0) {
      // comparar a selecao atual com a anterior para descobrir qual
      // linha foi selecionado por ultimo
      const diff = selection.filter(x => !this.state.selection.includes(x));

      selection = diff;
      selected_id = diff[0];
      selectedRow = this.state.data[selected_id];
    } else {
      selection = [];
      selectedRow = null;
    }

    this.setState(
      {
        selection,
        selectedRow,
      },
      this.handleSelection(selectedRow)
    );
  };

  clearData = () => {
    this.setState({
      data: [],
    });
  };

  decodeTotalCount = components => {
    if (components !== null) {
      const componentsLocal =
        components.pipelinesModulesList.pageInfo.endCursor;

      const decodeString = window.atob(componentsLocal);

      const totalCount = decodeString.split(':')[1];

      return totalCount;
    }
  };

  loadData = async () => {
    const { pageSize, after } = this.state;
    let { totalCount } = this.state;

    this.clearData();
    const componentsTotal = await Centaurus.getAllComponentsTotalCount();
    totalCount = this.decodeTotalCount(componentsTotal);

    const components = await Centaurus.getAllComponents(pageSize, after);
    if (
      components &&
      components.pipelinesModulesList &&
      components.pipelinesModulesList.edges
    ) {
      const componentsLocal = components.pipelinesModulesList.edges.map(e => {
        return {
          pipeline: e.node.pipeline ? e.node.pipeline.displayName : null,
          name: e.node.module ? e.node.module.name : null,
          version: e.node.module ? e.node.module.version : null,
          moduleId: e.node.module ? e.node.module.moduleId : null,
          owner: e.node.module
            ? e.node.module.user
              ? e.node.module.user.displayName
              : null
            : null,
          displayName: e.node.module ? e.node.module.displayName : null,
        };
      });
      this.setState({
        data: componentsLocal,
        totalCount: parseInt(totalCount),
        cursor: components.pipelinesModulesList.pageInfo,
        loading: false,
      });
    } else {
      return null;
    }
  };

  renderName = rowData => {
    if (rowData.pipeline) {
      return <span title={rowData.pipeline}>{rowData.pipeline}</span>;
    } else {
      return '-';
    }
  };

  renderClass = rowData => {
    if (rowData.name) {
      return <span title={rowData.name}>{rowData.name}</span>;
    } else {
      return '-';
    }
  };

  renderVersion = rowData => {
    if (rowData.version) {
      return <span title={rowData.version}>{rowData.version}</span>;
    } else {
      return '-';
    }
  };

  renderPipeline = rowData => {
    if (rowData.moduleId) {
      return <span title={rowData.moduleId}>{rowData.moduleId}</span>;
    } else {
      return '-';
    }
  };

  renderOwner = rowData => {
    if (rowData.owner) {
      return <span title={rowData.owner}>{rowData.owner}</span>;
    } else {
      return '-';
    }
  };

  renderModule = rowData => {
    if (rowData.displayName) {
      return <span title={rowData.displayName}>{rowData.displayName}</span>;
    } else {
      return '-';
    }
  };

  renderTable = () => {
    const {
      data,
      columns,
      pageSize,
      pageSizes,
      currentPage,
      totalCount,
      defaultColumnWidths,
      selection,
    } = this.state;

    return (
      <Grid rows={data} columns={columns}>
        <PagingState
          currentPage={currentPage}
          onCurrentPageChange={this.changeCurrentPage}
          pageSize={pageSize}
          onPageSizeChange={this.changePageSize}
        />
        <CustomPaging totalCount={totalCount} />
        <SelectionState
          selection={selection}
          onSelectionChange={this.changeSelection}
        />
        <Table />
        <TableColumnResizing defaultColumnWidths={defaultColumnWidths} />
        <TableHeaderRow />
        <TableColumnVisibility />
        <TableSelection
          selectByRowClick
          highlightRow
          showSelectionColumn={false}
        />
        <PagingPanel pageSizes={pageSizes} />
        <Toolbar />
        <ColumnChooser />
      </Grid>
    );
  };

  renderLoading = () => {
    return (
      <CircularProgress
        style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          margin: '-30px 0 0 -20px',
          zIndex: '99',
        }}
      />
    );
  };

  render() {
    const { loading, data } = this.state;
    const { classes } = this.props;

    data.map(row => {
      row.pipeline = this.renderName(row);
      row.name = this.renderClass(row);
      row.version = this.renderVersion(row);
      row.moduleId = this.renderPipeline(row);
      row.owner = this.renderOwner(row);
      row.displayName = this.renderModule(row);
      return row;
    });

    return (
      <Paper className={classes.wrapPaper}>
        {this.renderTable()}
        {loading && this.renderLoading()}
      </Paper>
    );
  }
}

export default withStyles(styles)(TableClasses);
