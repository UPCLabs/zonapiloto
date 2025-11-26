import React from "react";
import "../../../styles/admin_dashboard/shared/searchbox.css";

const SearchBox = ({ searchTerm, setSearchTerm, placeholder = "Buscar..." }) => {
    return (
        <div className="search-box">
            <span className="search-icon">🔍</span>
            <input
                type="text"
                placeholder={placeholder}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
            />
        </div>
    );
};

export default SearchBox;