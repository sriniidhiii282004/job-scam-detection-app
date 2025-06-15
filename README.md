# Apply for Job along with Scam Detection Algorithm

The project contains three seperate project one is frontend, second is backend and third is prediction_model.

    frontend:
        this project is in react, use to show visuals to the user
    
    backend:
        this project provides all the data to the frontend to make it dynamic. IT also interact with prediction-model to distinguish between fraudulent jobs and genuine jobs

    predictive-model:
        this project ------


This project allows users to apply for jobs and secure them to apply for scam jobs and save their data

In the project directory in backend and frontend folder, you can run:

    npm i


### Frontend

Go to frontend, open the terminal and run following command
    
    npm start


### Backend

Go to backend folder, open the terminal and run following command

    node app.js

### Prediction model:

Go to prediction-model folder, open the terminal and run following command

    python -m venv venv

    source venv/bin/activate

Above command sets up your python environment and activate it


Following procedure is done for nlk library, which we use in our project. It gives error in running like certificate issues.
    For mac users- 
        * Go to Application folder
        * Find Python 3.x folder
        * Double click on - Install Certificates.command or on Install Certificates.tool
        * After it gets finished run your train model script

            python train_model.py

After that run this command to start the prediction model

    uvicorn main:app --host 0.0.0.0 --port 8000 --reload

Now both the projects started now you can explore the app

