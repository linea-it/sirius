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
        { name: 'typeName', title: 'Type Name' },
        { name: 'typeDisplayName', title: 'Type' },
        { name: 'className', title: 'Name' },
        { name: 'displayName', title: 'Class' },
      ],
      defaultColumnWidths: [
        { columnName: 'typeName', width: 300 },
        { columnName: 'typeDisplayName', width: 300 },
        { columnName: 'className', width: 300 },
        { columnName: 'displayName', width: 300 },
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

  decodeTotalCount = classes => {
    if (classes !== null) {
      const classesLocal = classes.productClassList.pageInfo.endCursor;

      const decodeString = window.atob(classesLocal);

      const totalCount = decodeString.split(':')[1];

      return totalCount;
    }
  };

  loadData = async () => {
    const { pageSize, after } = this.state;
    let { totalCount } = this.state;

    this.clearData();
    const classesTotal = await Centaurus.getAllClassesTotalCount();
    totalCount = this.decodeTotalCount(classesTotal);

    const classes = await Centaurus.getAllClasses(pageSize, after);
    if (classes && classes.productClassList && classes.productClassList.edges) {
      const classesLocal = classes.productClassList.edges.map(e => {
        return {
          typeName: e.node.productType ? e.node.productType.typeName : null,
          typeDisplayName: e.node.productType
            ? e.node.productType.displayName
            : null,
          className: e.node.className,
          displayName: e.node.displayName,
        };
      });
      this.setState({
        data: classesLocal,
        totalCount: parseInt(totalCount),
        cursor: classes.productClassList.pageInfo,
        loading: false,
      });
    } else {
      return null;
    }
  };

  renderTypeName = rowData => {
    if (rowData.typeName) {
      return <span title={rowData.typeName}>{rowData.typeName}</span>;
    } else {
      return '-';
    }
  };

  renderType = rowData => {
    if (rowData.typeDisplayName) {
      return (
        <span title={rowData.typeDisplayName}>{rowData.typeDisplayName}</span>
      );
    } else {
      return '-';
    }
  };

  renderClass = rowData => {
    if (rowData.className) {
      return <span title={rowData.className}>{rowData.className}</span>;
    } else {
      return '-';
    }
  };

  renderName = rowData => {
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
      row.typeName = this.renderTypeName(row);
      row.typeDisplayName = this.renderType(row);
      row.className = this.renderClass(row);
      row.displayName = this.renderName(row);
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
