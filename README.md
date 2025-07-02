# 🏙️ Urban Eye: Community Issue Reporting

## 📌 About
**Urban Eye** is a real-time web application that enables communities to report and track urban issues such as potholes, broken lights, or safety hazards. It is built using a **serverless AWS architecture** to ensure scalability, high availability, and low maintenance overhead.

---

## 🚀 Features
- **🔐 User Accounts**: Secure sign-in and authentication via **AWS Cognito**
- **📊 Dashboard**: View previously reported urban issues
- **➕ New Reports**: Submit new issues with:
  - 📸 Photos
  - 📝 Descriptions
  - 🗂️ Categories
- **🧠 Smart Validation**:
  - **Amazon Rekognition**: Validates uploaded images
  - **Amazon Comprehend**: Analyzes issue descriptions for relevance and tone

---

## 🧱 Architecture

Urban Eye is divided into three serverless tiers:

### 🌐 Presentation Tier
- **Frontend Framework**: [React.js](https://reactjs.org/) + [Vite](https://vitejs.dev/) for fast development and performance
- **Styling**: [Tailwind CSS](https://tailwindcss.com/) for responsive UI
- **AWS Amplify**: Hosting and deployment of the frontend
- **Amazon CloudFront + S3**: Fast delivery of static web assets

### ⚙️ Logic Tier
- **Amazon API Gateway**: Handles all frontend API requests
- **AWS Lambda**:
  - Fetches existing issues from DynamoDB
  - Processes new submissions (image + text analysis)
- **Amazon Rekognition**: Checks image content
- **Amazon Comprehend**: Analyzes issue descriptions
- **Amazon Cognito**: Manages user authentication and session control

### 🗄️ Data Tier
- **Amazon S3**: Stores uploaded issue images
- **Amazon DynamoDB**: Stores structured issue reports (description, image URL, timestamp, user ID)

### 📈 Monitoring & DevOps
- **Amazon CloudWatch**: Monitors logs, metrics, and performance
- **CI/CD Pipeline**: 
  - Source: GitHub
  - Build: AWS CodeBuild
  - Deploy: AWS CodePipeline

---

## 🛠️ Technologies

### 💻 Frontend
- **React.js** – component-based UI
- **Vite** – lightning-fast dev server and bundler
- **Tailwind CSS** – utility-first responsive design
- **Amplify** – hosting, environment, and domain management

### 🔧 Backend
- **Node.js on AWS Lambda**
- **RESTful API design**

### ☁️ AWS Services
- **Cognito** – authentication
- **API Gateway** – request routing
- **Lambda** – compute logic
- **DynamoDB** – NoSQL database
- **S3** – object storage for images
- **Rekognition** – image validation
- **Comprehend** – text analysis
- **CloudFront** – content delivery
- **Amplify** – frontend deployment
- **CodePipeline + CodeBuild** – automated CI/CD
- **CloudWatch** – service monitoring and alerts

---

## 🖼️ Architecture Diagram
[📄 View Urban Eye Architecture (PDF)](architecture.jpg)



---

## 🧪 Usage

1. Sign in via AWS Cognito
2. Browse existing issues on the dashboard
3. Click “Report New Issue”
   - Upload an images
   - Choose a category
   - Add a description
4. Image is validated using **Rekognition**
5. Text is analyzed using **Comprehend**
6. Issue is stored in **DynamoDB** and viewable to all users

---

## 🔁 CI/CD Pipeline

Automated deployment pipeline:

