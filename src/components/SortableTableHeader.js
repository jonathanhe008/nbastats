import React from "react";
import PropTypes from "prop-types";
import { TableSortLabel } from "@mui/material";

function SortableTableHeader({ active, direction, label, onClick }) {
  return (
    <TableSortLabel
      active={active}
      direction={direction}
      onClick={onClick}
    >
      {label}
    </TableSortLabel>
  );
}

SortableTableHeader.propTypes = {
  active: PropTypes.bool.isRequired,
  direction: PropTypes.oneOf(["asc", "desc"]).isRequired,
  label: PropTypes.string.isRequired,
  onClick: PropTypes.func.isRequired,
};

export default SortableTableHeader;
