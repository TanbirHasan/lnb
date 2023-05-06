import * as React from "react";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";

const LnbDataGrid = ({
  apiLoading,
  rowData,
  paginationData,
  setPage,
  setPageSize,
  columns,
}) => {
  const [rowCountState, setRowCountState] = React.useState(
    paginationData?.totalRowCount || 0
  );

  React.useEffect(() => {
    setRowCountState((prevRowCountState) =>
      paginationData?.totalRowCount !== undefined
        ? paginationData?.totalRowCount
        : prevRowCountState
    );
  }, [paginationData?.totalRowCount, setRowCountState]);

  return (
    <div style={{ height: 600, width: "100%" }}>
      <DataGrid
        rows={rowData}
        rowCount={rowCountState}
        loading={apiLoading}
        rowsPerPageOptions={[5, 10, 15, 20, 50, 100]}
        pagination
        page={paginationData?.page}
        pageSize={paginationData?.limit}
        paginationMode="server"
        onPageChange={(newPage) => setPage(newPage)}
        onPageSizeChange={(newPageSize) => setPageSize(newPageSize)}
        columns={columns}
        disableColumnFilter
        disableColumnSelector
        disableDensitySelector
        disableExport
        components={{ Toolbar: GridToolbar }}
        componentsProps={{
          toolbar: {
            showQuickFilter: true,
            quickFilterProps: { debounceMs: 500 },
            csvOptions: { disableToolbarButton: true },
            printOptions: { disableToolbarButton: true },
          },
        }}

        // initialState={initialState}
      />
    </div>
  );
};
export default LnbDataGrid;
