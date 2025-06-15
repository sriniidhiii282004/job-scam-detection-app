const express = require('express');

const { getAll, get, add, replace, remove, convertCsvToJsonManual } = require('../data/event');
const { checkAuth } = require('../util/auth');
const {
  isValidText,
  isValidDate,
  isValidImageUrl,
} = require('../util/validation');

const router = express.Router();

const PYTHON_PREDICTION_SERVICE_URL = process.env.PYTHON_PREDICTION_SERVICE_URL || 'http://localhost:8000';
const PREDICT_ENDPOINT = `${PYTHON_PREDICTION_SERVICE_URL}/predict`;


convertCsvToJsonManual('https://coding-platform.s3.amazonaws.com/dev/lms/tickets/4c8465f0-fce0-484f-8497-d25feaa8e995/NqndMEyZakuimmFI.csv', 'jobs.json')
    
router.get('/', async (req, res, next) => {
  try {
    const jobs = await getAll();
    response = res.json({ jobs: jobs });

  } catch (error) {
    next(error);
  }
});

router.get('/:id', async (req, res, next) => {
  try {
    const event = await get(req.params.id);
    res.json({ event: event });
  } catch (error) {
    next(error);
  }
});

router.use(checkAuth);

router.post('/', async (req, res, next) => {
  const data = req.body;

  let errors = {};

  if (!isValidText(data.title)) {
    errors.title = 'Invalid title.';
  }

  if (!isValidText(data.description)) {
    errors.description = 'Invalid description.';
  }

  if (!isValidDate(data.date)) {
    errors.date = 'Invalid date.';
  }

  if (!isValidImageUrl(data.image)) {
    errors.image = 'Invalid image.';
  }

  if (Object.keys(errors).length > 0) {
    return res.status(422).json({
      message: 'Adding the event failed due to validation errors.',
      errors,
    });
  }

  try {
    await add(data);
    res.status(201).json({ message: 'Event saved.', event: data });
  } catch (error) {
    next(error);
  }
});

router.patch('/:id', async (req, res, next) => {
  const data = req.body;

  let errors = {};

  if (!isValidText(data.title)) {
    errors.title = 'Invalid title.';
  }

  if (!isValidText(data.description)) {
    errors.description = 'Invalid description.';
  }

  if (!isValidDate(data.date)) {
    errors.date = 'Invalid date.';
  }

  if (!isValidImageUrl(data.image)) {
    errors.image = 'Invalid image.';
  }

  if (Object.keys(errors).length > 0) {
    return res.status(422).json({
      message: 'Updating the event failed due to validation errors.',
      errors,
    });
  }

  try {
    await replace(req.params.id, data);
    res.json({ message: 'Event updated.', event: data });
  } catch (error) {
    next(error);
  }
});

router.delete('/:id', async (req, res, next) => {
  try {
    await remove(req.params.id);
    res.json({ message: 'Event deleted.' });
  } catch (error) {
    next(error);
  }
});

router.post('/predict-job-fraud', async (req, res) => {
    const jobData = req.body; // This should contain the job features
    console.log('job data is========', jobData);
    
    // Basic validation (add more robust validation as needed)
    if (!jobData || Object.keys(jobData).length === 0) {
        return res.status(400).json({ error: 'Job data is required.' });
    }

    console.log('Received job data for prediction:', jobData);

    try {
        // Make a POST request to the Python prediction service using fetch
        const response = await fetch(PREDICT_ENDPOINT, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(jobData) // Convert JavaScript object to JSON string
        });

        // Fetch API does NOT throw an error for HTTP status codes like 4xx or 5xx.
        // You must manually check `response.ok` (true for 200-299) or `response.status`.
        const predictionResult = await response.json(); // Always attempt to parse JSON response

          console.log('predictionResult======', response);
          
        if (!response.ok) {
            // If the response status is not OK (e.g., 400, 500 from Python service)
            console.error('Python service error response:', response.status, predictionResult);
            return res.status(response.status).json({
                error: 'Failed to get prediction from data science service.',
                details: predictionResult // This will contain Python's error message
            });
        }

        // If response.ok is true, the prediction was successful
        console.log('Prediction from ML service:', predictionResult);
        res.status(response.status).json(predictionResult);

    } catch (error) {
        // This catch block handles network errors or issues with fetch itself (e.g., service unreachable)
        console.error('Error calling Python prediction service:', error.message);
        res.status(503).json({ // 503 Service Unavailable
            error: 'ML service is currently unreachable or an unexpected network error occurred.',
            details: error.message
        });
    }
});

module.exports = router;