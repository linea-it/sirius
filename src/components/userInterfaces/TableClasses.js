import React, { useEffect, useState } from 'react';
import Paper from '@material-ui/core/Paper';
import {
  PagingState,
  SortingState,
  CustomPaging,
  SelectionState,
  SearchState,
} from '@devexpress/dx-react-grid';
import {
  Grid,
  Table,
  TableHeaderRow,
  PagingPanel,
  Toolbar,
  TableSelection,
  SearchPanel,
} from '@devexpress/dx-react-grid-material-ui';
import Tooltip from '@material-ui/core/Tooltip';
import ArrowDownward from '@material-ui/icons/ArrowDownward';
import ArrowUpward from '@material-ui/icons/ArrowUpward';
import CircularProgress from '@material-ui/core/CircularProgress';
import Centaurus from '../../api';
import PropTypes from 'prop-types';

const styles = {
  wrapPaper: {
    position: 'relative',
    paddingTop: '10px',
  },
  itemLink: {
    cursor: 'pointer',
    lineHeight: '1.3',
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
  disabledButton: {
    backgroundColor: 'transparent',
    cursor: 'default',
    color: 'rgb(85, 85, 85)',
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

const tableHeaderRowCell = ({ ...restProps }) => (
  <TableHeaderRow.Cell
    {...restProps}
    style={{
      color: '#555555',
      fontSize: '1em',
    }}
  />
);

const SortingIcon = ({ direction }) =>
  direction === 'asc' ? (
    <ArrowUpward style={{ fontSize: '18px' }} />
  ) : (
    <ArrowDownward style={{ fontSize: '18px' }} />
  );

const SortLabel = ({ onSort, children, direction }) => {
  const _children = children.props.children;
  const isSortingEnabled =
    _children === 'User Manual' || _children === 'History' ? false : true;

  return (
    <Tooltip title={children.props.children}>
      <span
        onClick={isSortingEnabled ? onSort : null}
        style={
          isSortingEnabled ? styles.invisibleButton : styles.disabledButton
        }
      >
        {children}
        {direction && <SortingIcon direction={direction} />}
      </span>
    </Tooltip>
  );
};

SortingIcon.propTypes = {
  direction: PropTypes.string.isRequired,
};

SortLabel.propTypes = {
  onSort: PropTypes.func.isRequired,
  children: PropTypes.object.isRequired,
  direction: PropTypes.string,
};

function TableClasses() {
  const [sorting, setSorting] = useState([
    { columnName: 'producttype_display_name', direction: 'asc' },
  ]);
  const [currentPage, setCurrentPage] = useState(0);
  const [after, setAfter] = useState('');
  const [searchValue, setSearchValue] = useState('');
  const [pageSize, setPageSize] = useState(10);
  const [totalCount, setTotalCount] = useState(0);
  const [selection, setSelection] = useState([]);
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState([]);
  const pageSizes = [5, 10, 15];

  const columns = [
    { name: 'producttype_display_name', title: 'Pipeline' },
    { name: 'productclass_display_name', title: 'Class' },
  ];

  const changeSorting = value => {
    setLoading(true);
    setSorting(value);
  };

  const changeCurrentPage = value => {
    const offset = value * pageSize;
    const afterValue = window.btoa('arrayconnection:' + (offset - 1));

    setLoading(true);
    setCurrentPage(value);
    setAfter(afterValue);
  };

  const changePageSize = value => {
    const totalPages = Math.ceil(totalCount / value);
    const currentPageValue = Math.min(currentPage, totalPages - 1);

    setLoading(true);
    setPageSize(value);
    setCurrentPage(currentPageValue);
  };

  const changeSearchValue = value => {
    clearData();
    setLoading(true);
    setSearchValue(value);
  };

  const changeSelection = value => {
    let select = value;
    if (value.length > 0) {
      const diff = value.filter(x => !selection.includes(x));
      select = diff;
    } else {
      select = [];
    }
    setSelection(select);
  };

  const clearData = () => {
    setData([]);
    setAfter('');
    setCurrentPage(0);
  };

  const loadData = async () => {
    const classes = await Centaurus.getAllClasses(
      sorting,
      pageSize,
      after,
      searchValue
    );

    if (classes && classes.productClassList && classes.productClassList.edges) {
      setData(
        classes.productClassList.edges.map(row => ({
          producttype_display_name: row.node.productType.displayName,
          productclass_display_name: row.node.displayName,
        }))
      );
      setTotalCount(classes.productClassList.totalCount);
      setLoading(false);
    } else {
      clearData();
    }
  };

  useEffect(() => {
    loadData();
  }, [sorting, currentPage, after, searchValue, pageSize]);

  const renderLoading = () => {
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

  return (
    <Paper
      style={{
        position: 'relative',
        paddingTop: '10px',
      }}
    >
      <Grid rows={data} columns={columns}>
        <SearchState onValueChange={changeSearchValue} />
        <SortingState sorting={sorting} onSortingChange={changeSorting} />
        <PagingState
          currentPage={currentPage}
          onCurrentPageChange={changeCurrentPage}
          pageSize={pageSize}
          onPageSizeChange={changePageSize}
        />
        <CustomPaging totalCount={totalCount} />
        <SelectionState
          selection={selection}
          onSelectionChange={changeSelection}
        />
        <Table />
        <TableHeaderRow
          cellComponent={tableHeaderRowCell}
          showSortingControls
          sortLabelComponent={SortLabel}
        />
        <TableSelection
          selectByRowClick
          highlightRow
          showSelectionColumn={false}
        />
        <PagingPanel pageSizes={pageSizes} />
        <Toolbar />
        <SearchPanel />
      </Grid>
      {loading && renderLoading()}
    </Paper>
  );
}

export default TableClasses;
