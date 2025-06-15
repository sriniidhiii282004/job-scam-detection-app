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


# 🔍 Spot by Scam — Job Scam Detection Dashboard (Power BI)

![Dashboard Preview](preview.jpg) <!-- Optional: include a screenshot of your Power BI dashboard -->

## 📊 Overview

**Spot by Scam** is an interactive Power BI dashboard built to analyze and visualize data related to fraudulent and genuine job listings. This project helps identify risky patterns in employment types, job functions, and user behavior, enabling stakeholders to gain insights into job scam trends and potential red flags.

---

## 💡 Features

- 📌 **Stacked Column Charts** showing the relationship between employment types and fraud probability
- 📈 **Stacked Area Charts** highlighting fraud trends across job functions
- 🧭 **Pie Charts** visualizing distribution between genuine and fraudulent listings
- 📋 **Tables** and summary views with conditional formatting to highlight fraud-prone segments
- 🎯 **Interactive filters** for exploring data by employment type, job function, or fraud probability levels

---

## 📁 Files

| File Name                           | Description                                         |
|------------------------------------|-----------------------------------------------------|
| `Spot by scam.pbit`                | Power BI template file used for dashboard creation |
| `Employment_type vs Frauds.csv`    | Source data for employment type analysis           |
| `Function vs Fraud.csv`            | Dataset showing fraud probability by job function  |
| `Fraudulent Distribution.csv`      | Dataset for pie chart visualization                |
| `Top Risky Jobs.csv`               | Summary of most fraud-prone job roles              |
| `README.md`                        | Documentation and project overview                 |

---

## 🧪 Datasets Used

The analysis is based on structured CSV datasets including:
- **Employment Type vs Fraudulent Predictions**
- **Function vs Fraud Probability**
- **Genuine vs Fraudulent Distribution**
- **Top Risky Job Titles**

> These datasets were cleaned and transformed within Power BI using Power Query and DAX to enable meaningful visualization and interactivity.

---

## 🛠 Tools & Technologies

- [Power BI Desktop](https://powerbi.microsoft.com/)
- Power Query (Data Transformation)
- DAX (Data Analysis Expressions)
- Microsoft Excel/CSV
- Git & GitHub for version control

---

## 🚀 How to Use

1. **Download** the `.pbit` file from this repository.
2. Open the file in **Power BI Desktop**.
3. When prompted, load your data or use the sample datasets.
4. Explore insights using slicers and interactive visuals.

---

## 📌 Use Cases

- Helping job seekers and HR teams identify scam signals
- Analyzing job platforms for fraudulent activity
- Academic or professional research in online job fraud detection

---

## 🧑‍💻 Author

**Dudimetla Srinidhi**  
[GitHub Profile](https://github.com/your-username) <!-- Replace with your actual GitHub URL if needed -->

---

## 📜 License

This project is licensed under the [MIT License](LICENSE), allowing for free usage, distribution, and modification with attribution.

---

## 🌐 Contributions

Contributions are welcome!  
If you'd like to improve the dashboard, add new features, or suggest enhancements:

- Fork the repository
- Commit your changes
- Submit a pull request

---



