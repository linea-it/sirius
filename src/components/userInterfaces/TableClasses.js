import * as React from 'react';
import PropTypes from 'prop-types';
import Paper from '@material-ui/core/Paper';
import { withStyles } from '@material-ui/core/styles';
import {
  PagingState,
  CustomPaging,
  SelectionState,
  SortingState,
  SearchState,
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
  SearchPanel,
} from '@devexpress/dx-react-grid-material-ui';
import CircularProgress from '@material-ui/core/CircularProgress';
import Centaurus from '../../api';
import Tooltip from '@material-ui/core/Tooltip';
import ArrowDownward from '@material-ui/icons/ArrowDownward';
import ArrowUpward from '@material-ui/icons/ArrowUpward';

const styles = {
  wrapPaper: {
    position: 'relative',
    paddingTop: '10px',
  },
  invisibleButton: {
    backgroundColor: 'transparent',
    cursor: 'pointer',
    color: 'rgba(0, 0, 0, 0.87)',
    padding: 0,
    fontSize: '1rem',
    lineHeight: 1.75,
    fontHeight: 500,
    letterSpacing: '0.02857em',
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    maxWidth: '100%',
  },
};

const SortingIcon = ({ direction }) => (
  direction === 'asc'
    ? <ArrowUpward style={{ fontSize: '18px' }} />
    : <ArrowDownward style={{ fontSize: '18px' }} />
);

const SortLabel = ({ onSort, children, direction }) => {

  return (
    <Tooltip title={children.props.children}>
      <span
        onClick={onSort}
        style={styles.invisibleButton}
      >
        {children}
        {(direction && <SortingIcon direction={direction} />)}
      </span>
    </Tooltip>
  );
}

const tableHeaderRowCell = ({ ...restProps }) => (
  <TableHeaderRow.Cell
    {...restProps}
    style={{
      color: '#555555',
      fontSize: '1em',
    }}
  />
);

class TableClasses extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = this.initialState;
  }

  get initialState() {
    return {
      columns: [
        { name: 'productclass_display_name', title: 'Class' },
        { name: 'productclass_class_name', title: 'Internal Name' },
        { name: 'producttype_display_name', title: 'Type' },
        { name: 'producttype_type_name', title: 'Type Name' },
      ],
      defaultColumnWidths: [
        { columnName: 'productclass_display_name', width: 300 },
        { columnName: 'productclass_class_name', width: 300 },
        { columnName: 'producttype_display_name', width: 300 },
        { columnName: 'producttype_type_name', width: 300 },
      ],
      data: [],
      sorting: [{ columnName: 'productclass_display_name', direction: 'desc' }],
      totalCount: 0,
      pageSize: 10,
      pageSizes: [5, 10, 15],
      currentPage: 0,
      loading: true,
      after: '',
      searchValue: '',
      selection: [],
    };
  }

  static propTypes = {
    classes: PropTypes.object.isRequired,
  };

  componentDidMount() {
    this.loadData();
  }

  changeSorting = sorting => {
    this.setState(
      {
        loading: true,
        sorting,
      },
      () => this.loadData()
    );
  };

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

  changeSearchValue = searchValue => {
    this.setState(
      {
        loading: true,
        searchValue,
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

  loadData = async () => {
    const { sorting, pageSize, after, searchValue } = this.state;

    const classes = await Centaurus.getAllClasses(
      sorting,
      pageSize,
      after,
      searchValue
    );

    if (classes && classes.productClassList && classes.productClassList.edges) {
      const classesLocal = classes.productClassList.edges.map(row => {
        return {
          productclass_display_name: row.node.displayName,
          productclass_class_name: row.node.className,
          producttype_display_name: row.node.productType
            ? row.node.productType.displayName
            : null,
          producttype_type_name: row.node.productType
            ? row.node.productType.typeName
            : null,
        };
      });
      this.setState({
        data: classesLocal,
        totalCount: parseInt(classes.productClassList.totalCount),
        cursor: classes.productClassList.pageInfo,
        loading: false,
      });
    } else {
      this.clearData();
    }
  };

  renderClass = rowData => {
    if (rowData.productclass_class_name) {
      return (
        <span title={rowData.productclass_class_name}>
          {rowData.productclass_class_name}
        </span>
      );
    } else {
      return '-';
    }
  };

  renderName = rowData => {
    if (rowData.productclass_display_name) {
      return (
        <span title={rowData.productclass_display_name}>
          {rowData.productclass_display_name}
        </span>
      );
    } else {
      return '-';
    }
  };

  renderType = rowData => {
    if (rowData.producttype_display_name) {
      return (
        <span title={rowData.producttype_display_name}>
          {rowData.producttype_display_name}
        </span>
      );
    } else {
      return '-';
    }
  };

  renderTypeName = rowData => {
    if (rowData.producttype_type_name) {
      return (
        <span title={rowData.producttype_type_name}>
          {rowData.producttype_type_name}
        </span>
      );
    } else {
      return '-';
    }
  };

  renderTable = () => {
    const {
      data,
      columns,
      sorting,
      pageSize,
      pageSizes,
      currentPage,
      totalCount,
      defaultColumnWidths,
      selection,
    } = this.state;

    return (
      <Grid rows={data} columns={columns}>
        <SearchState onValueChange={this.changeSearchValue} />
        <SortingState sorting={sorting} onSortingChange={this.changeSorting} />
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
        <TableHeaderRow
          cellComponent={tableHeaderRowCell}
          showSortingControls
          sortLabelComponent={SortLabel}
        />
        <TableColumnVisibility />
        <TableSelection
          selectByRowClick
          highlightRow
          showSelectionColumn={false}
        />
        <PagingPanel pageSizes={pageSizes} />
        <Toolbar />
        <SearchPanel />
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
      row.productclass_class_name = this.renderClass(row);
      row.productclass_display_name = this.renderName(row);
      row.producttype_display_name = this.renderType(row);
      row.producttype_type_name = this.renderTypeName(row);
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
