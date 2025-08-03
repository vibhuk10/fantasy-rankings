import React, { useState, useMemo } from 'react';
import { useTable, useSortBy, useFilters, usePagination } from 'react-table';
import './RankingsTable.css';

const RankingsTable = ({ players, position }) => {
  const [filterInput, setFilterInput] = useState('');

  // Format column headers
  const formatColumnHeader = (header) => {
    const headerMap = {
      rank: 'Rank',
      name: 'Name',
      team: 'Team',
      passAttempts: 'Pass Att',
      passYards: 'Pass Yds',
      passTds: 'Pass TDs',
      passInts: 'INTs',
      completionPercentage: 'Comp %',
      yardsPerAttempt: 'Yds/Att',
      rushYards: 'Rush Yds',
      rushTds: 'Rush TDs',
      rushAttempts: 'Rush Att',
      yardsPerRush: 'Yds/Rush',
      targets: 'Targets',
      receptions: 'Rec',
      recYards: 'Rec Yds',
      recTds: 'Rec TDs',
      yardsPerReception: 'Yds/Rec',
      catchRate: 'Catch %',
      fantasyPPG: 'Fantasy PPG',
      compositeScore: 'Composite Score'
    };
    return headerMap[header] || header;
  };

  // Format cell values
  const formatCellValue = (value, columnId) => {
    if (value === null || value === undefined) return '-';

    switch (columnId) {
      case 'rank':
        return value;
      case 'name':
        return value.charAt(0).toUpperCase() + value.slice(1).replace(/\b\w/g, l => l.toUpperCase());
      case 'team':
        return value;
      case 'completionPercentage':
      case 'catchRate':
        return `${value}%`;
      case 'yardsPerAttempt':
      case 'yardsPerRush':
      case 'yardsPerReception':
        return parseFloat(value).toFixed(1);
      case 'fantasyPPG':
      case 'compositeScore':
        return parseFloat(value).toFixed(1);
      case 'passAttempts':
      case 'passYards':
      case 'passTds':
      case 'passInts':
      case 'rushYards':
      case 'rushTds':
      case 'rushAttempts':
      case 'targets':
      case 'receptions':
      case 'recYards':
      case 'recTds':
        return value.toLocaleString();
      default:
        return value;
    }
  };

  const columns = useMemo(() => {
    const positionConfig = {
      qb: [
        { Header: 'Rank', accessor: 'rank', width: 60 },
        { Header: 'Name', accessor: 'name', width: 150 },
        { Header: 'Team', accessor: 'team', width: 60 },
        { Header: 'Pass Att', accessor: 'passAttempts', width: 80 },
        { Header: 'Pass Yds', accessor: 'passYards', width: 90 },
        { Header: 'Pass TDs', accessor: 'passTds', width: 80 },
        { Header: 'INTs', accessor: 'passInts', width: 60 },
        { Header: 'Comp %', accessor: 'completionPercentage', width: 80 },
        { Header: 'Yds/Att', accessor: 'yardsPerAttempt', width: 80 },
        { Header: 'Rush Yds', accessor: 'rushYards', width: 90 },
        { Header: 'Rush TDs', accessor: 'rushTds', width: 80 },
        { Header: 'Fantasy PPG', accessor: 'fantasyPPG', width: 100 },
        { Header: 'Composite Score', accessor: 'compositeScore', width: 120 }
      ],
      rb: [
        { Header: 'Rank', accessor: 'rank', width: 60 },
        { Header: 'Name', accessor: 'name', width: 150 },
        { Header: 'Team', accessor: 'team', width: 60 },
        { Header: 'Rush Att', accessor: 'rushAttempts', width: 80 },
        { Header: 'Rush Yds', accessor: 'rushYards', width: 90 },
        { Header: 'Rush TDs', accessor: 'rushTds', width: 80 },
        { Header: 'Yds/Rush', accessor: 'yardsPerRush', width: 80 },
        { Header: 'Targets', accessor: 'targets', width: 70 },
        { Header: 'Rec', accessor: 'receptions', width: 60 },
        { Header: 'Rec Yds', accessor: 'recYards', width: 80 },
        { Header: 'Rec TDs', accessor: 'recTds', width: 70 },
        { Header: 'Catch %', accessor: 'catchRate', width: 80 },
        { Header: 'Fantasy PPG', accessor: 'fantasyPPG', width: 100 },
        { Header: 'Composite Score', accessor: 'compositeScore', width: 120 }
      ],
      wr: [
        { Header: 'Rank', accessor: 'rank', width: 60 },
        { Header: 'Name', accessor: 'name', width: 150 },
        { Header: 'Team', accessor: 'team', width: 60 },
        { Header: 'Targets', accessor: 'targets', width: 70 },
        { Header: 'Rec', accessor: 'receptions', width: 60 },
        { Header: 'Rec Yds', accessor: 'recYards', width: 90 },
        { Header: 'Rec TDs', accessor: 'recTds', width: 70 },
        { Header: 'Yds/Rec', accessor: 'yardsPerReception', width: 80 },
        { Header: 'Catch %', accessor: 'catchRate', width: 80 },
        { Header: 'Fantasy PPG', accessor: 'fantasyPPG', width: 100 },
        { Header: 'Composite Score', accessor: 'compositeScore', width: 120 }
      ],
      te: [
        { Header: 'Rank', accessor: 'rank', width: 60 },
        { Header: 'Name', accessor: 'name', width: 150 },
        { Header: 'Team', accessor: 'team', width: 60 },
        { Header: 'Targets', accessor: 'targets', width: 70 },
        { Header: 'Rec', accessor: 'receptions', width: 60 },
        { Header: 'Rec Yds', accessor: 'recYards', width: 90 },
        { Header: 'Rec TDs', accessor: 'recTds', width: 70 },
        { Header: 'Yds/Rec', accessor: 'yardsPerReception', width: 80 },
        { Header: 'Catch %', accessor: 'catchRate', width: 80 },
        { Header: 'Fantasy PPG', accessor: 'fantasyPPG', width: 100 },
        { Header: 'Composite Score', accessor: 'compositeScore', width: 120 }
      ]
    };

    return positionConfig[position] || [];
  }, [position]);

  const data = useMemo(() => players, [players]);

  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    page,
    prepareRow,
    setFilter,
    nextPage,
    previousPage,
    canNextPage,
    canPreviousPage,
    pageOptions,
    state: { pageIndex, pageSize }
  } = useTable(
    {
      columns,
      data,
      initialState: { pageIndex: 0, pageSize: 20 }
    },
    useFilters,
    useSortBy,
    usePagination
  );

  const handleFilterChange = (e) => {
    const value = e.target.value || undefined;
    setFilter('name', value);
    setFilterInput(value);
  };

  return (
    <div className="rankings-table-container">
      <div className="table-controls">
        <input
          type="text"
          placeholder="Search players..."
          value={filterInput}
          onChange={handleFilterChange}
          className="search-input"
        />
      </div>

      <div className="table-wrapper">
        <table {...getTableProps()} className="rankings-table">
          <thead>
            {headerGroups.map(headerGroup => (
              <tr {...headerGroup.getHeaderGroupProps()}>
                {headerGroup.headers.map(column => (
                  <th
                    {...column.getHeaderProps(column.getSortByToggleProps())}
                    className="table-header"
                    style={{ width: column.width }}
                  >
                    {column.render('Header')}
                    <span className="sort-indicator">
                      {column.isSorted ? (column.isSortedDesc ? ' ↓' : ' ↑') : ''}
                    </span>
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody {...getTableBodyProps()}>
            {page.map(row => {
              prepareRow(row);
              return (
                <tr {...row.getRowProps()} className="table-row">
                  {row.cells.map(cell => (
                    <td {...cell.getCellProps()} className="table-cell">
                      {formatCellValue(cell.value, cell.column.id)}
                    </td>
                  ))}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <div className="pagination-controls">
        <button
          onClick={() => previousPage()}
          disabled={!canPreviousPage}
          className="pagination-button"
        >
          Previous
        </button>
        <span className="pagination-info">
          Page {pageIndex + 1} of {pageOptions.length}
        </span>
        <button
          onClick={() => nextPage()}
          disabled={!canNextPage}
          className="pagination-button"
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default RankingsTable; 