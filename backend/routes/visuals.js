const express = require('express');


const router = express.Router();

const PYTHON_PREDICTION_SERVICE_URL = process.env.PYTHON_PREDICTION_SERVICE_URL || 'http://localhost:8000';

const VISUALS_ENDPOINT = `${PYTHON_PREDICTION_SERVICE_URL}/visuals`;
    
router.get('/', async (req, res, next) => {
  try {
    const visuals = [
      {
        id: 'bar',
        name: 'Bar Chart',
        icon: '📊',
        description: 'Compare values across categories'
      },
      {
        id: 'line',
        name: 'Line Chart',
        icon: '📈',
        description: 'Show trends over time'
      },
      {
        id: 'pie',
        name: 'Pie Chart',
        icon: '🥧',
        description: 'Display proportions of a whole'
      },
      {
        id: 'scatter',
        name: 'Scatter Plot',
        icon: '⚫',
        description: 'Show relationships between variables'
      }
    ]
    res.json({ visuals: visuals });

  } catch (error) {
    next(error);
  }
});

    
router.get('/:id', async (req, res, next) => {
  try {
    const visualizationId = req.params.id;
    console.log('Fetching visualization data for ID:', visualizationId);
    
    const url = `${VISUALS_ENDPOINT}/${visualizationId}`;
    console.log('Requesting from URL:', url);
    
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch visualization data: ${response.statusText}`);
    }

    const data = await response.json();
    res.json({ visualization: data });
  } catch (error) {
    console.error('Error fetching visualization:', error);
    res.status(500).json({ 
      error: 'Failed to fetch visualization data',
      details: error.message 
    });
  }
});

module.exports = router;