import React from "react";
import "../../../styles/admin_dashboard/shared/datatable.css";

const DataTable = ({ headers, data, renderRow }) => {
    return (
        <div className="data-table">
            <div className="table-header" style={{ gridTemplateColumns: `repeat(${headers.length}, 1fr)` }}>
                {headers.map((header, index) => (
                    <span key={index}>{header}</span>
                ))}
            </div>
            {data.map((item) => (
                <div
                    key={item.id || item.questionId || item.categoryId}
                    className="table-row"
                    style={{ gridTemplateColumns: `repeat(${headers.length}, 1fr)` }}
                >
                    {renderRow(item)}
                </div>
            ))}
        </div>
    );
};

export default DataTable;