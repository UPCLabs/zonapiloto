import React from "react";
import "../../../styles/admin_dashboard/shared/carouselgrid.css";

const CarouselGrid = ({ images, API_URL, openEditModal, handleDelete }) => {
    return (
        <div className="carousel-grid">
            {images.map((image) => (
                <div key={image.id} className="carousel-card">
                    <div className="carousel-image">
                        <img src={`${API_URL}${image.url}`} alt={image.title} />
                    </div>
                    <div className="carousel-info">
                        <h4>{image.title}</h4>
                    </div>
                    <div className="carousel-actions">
                        <button
                            className="icon-btn edit"
                            onClick={() => openEditModal("carousel", image)}
                        >
                            ✏️
                        </button>
                        <button
                            className="icon-btn delete"
                            onClick={() =>
                                handleDelete("/information/announcements-photos", image.id)
                            }
                        >
                            🗑️
                        </button>
                    </div>
                </div>
            ))}
        </div>
    );
};

export default CarouselGrid;