import React, { useState } from 'react';
import './VisualizationSelector.css';

const VisualizationSelector = ({ visualizationTypes, handleSelectedVisual }) => {
  const [selectedType, setSelectedType] = useState(null);
  const [visualizationData, setVisualizationData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleTypeSelect = async (type) => {
    try {
      setIsLoading(true);
      setError(null);
      setSelectedType(type);

      const response = await fetch(`http://localhost:8080/visuals/${type.id}`);
      
      if (!response.ok) {
        throw new Error('Failed to fetch visualization data');
      }

      const data = await response.json();
      setVisualizationData(data.visualization);
      handleSelectedVisual(type, data.visualization);
    } catch (err) {
      setError(err.message || 'Failed to load visualization data');
      console.error('Error fetching visualization:', err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="visualization-container">
      <h2 className="visualization-title">Select Visualization Type</h2>
      
      <div className="visualization-grid">
        {visualizationTypes && visualizationTypes.length > 0 && visualizationTypes.map((type) => (
          <div
            key={type.id}
            className={`visualization-box ${selectedType?.id === type.id ? 'selected' : ''}`}
            onClick={() => handleTypeSelect(type)}
          >
            <div className="visualization-icon">{type.icon}</div>
            <h3 className="visualization-name">{type.name}</h3>
            <p className="visualization-description">{type.description}</p>
          </div>
        ))}
      </div>

      {isLoading && (
        <div className="visualization-preview">
          <div className="loading-spinner">Loading visualization data...</div>
        </div>
      )}

      {error && (
        <div className="visualization-preview">
          <div className="error-message">
            <h3>Error</h3>
            <p>{error}</p>
          </div>
        </div>
      )}

      {/* {selectedType && !isLoading && !error && (
        <div className="visualization-preview">
          <h3>Preview: {selectedType.name}</h3>
          <div className="preview-content">
            {visualizationData ? (
              <div className="visualization-data">
                <pre>{JSON.stringify(visualizationData, null, 2)}</pre>
              </div>
            ) : (
              <p>No data available for this visualization</p>
            )}
          </div>
        </div>
      )} */}
      
    </div>
  );
};

export default VisualizationSelector; 