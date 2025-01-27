# IONS: The Gen-Z Way To Manage Electricity

This project is an improvement from the **Menguasai Kecerdasan Buatan** final course project. Below is an overview of the tasks completed and features implemented throughout the project.

## Project Overview

IONS is an innovative application designed to help households manage their energy consumption wisely. The application provides features such as cost estimation, energy usage statistics, and an AI assistant to offer more efficient energy management recommendations.

## Technologies Used

- **React**: for building dynamic user interfaces.
- **Golang**: for backend development.
- **PostgreSQL**: as the database.
- **Hugging Face**: to power AI capabilities.

## AI Model

The AI capabilities of IONS are powered by two pre-trained models:

- **Google/TAPAS-Base-Finetuned-WTQ**: This model is used for table-based question answering. It allows the system to answer questions related to tabular data, such as energy consumption statistics, by interpreting and reasoning over tables.
- **Microsoft/Phi-3.5-Mini-Instruct**: This model is used for general question answering. It enables the AI assistant to respond to user queries with context-aware, relevant answers, helping users optimize their energy usage.

## Key Features

1. **Energy Consumption Monitoring:**
   - Displays energy consumption data from uploaded files.
2. **Electricity Cost Estimation:**
   - Helps users estimate their monthly electricity bills.
3. **AI Assistant:**
   - Provides personalized recommendations to optimize energy usage.
4. **Energy Usage Statistics:**
   - Offers insights into energy consumption patterns.
5. **Energy Saving Recommendations:**
   - Assists users in reducing energy waste and costs.

## Getting Started

### Prerequisites

- Node.js installed on your machine.
- Golang installed on your machine.

### Branch Information

- **`main` branch:**  
  The completed version of the application with all features fully implemented, including authentication-protected routes.
- **`demo` branch:**  
  A demonstration version of the application where authentication-protected routes are disabled for easier testing and presentation purposes.

### Installation

1. Clone this repository:
   ```bash
   git clone https://github.com/daffafaiqhs/ions.git
   ```
2. Navigate to the project directory:
   ```bash
   cd frontend
   ```
3. Install dependencies:
   ```bash
   npm install
   ```

### Running the Application

1. Start the Golang server:
   ```bash
   go run main.go
   ```
2. Start the React development server:
   ```bash
   cd frontend
   npm start
   ```
3. Open your browser and navigate to `http://localhost:3000` to view the application.
