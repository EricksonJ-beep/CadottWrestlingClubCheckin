# Cadott Wrestling Club Attendance Tracker

This project is a single-page web application designed for the Cadott Wrestling Club to serve as a real-time attendance tracker. It is optimized for tablet use and utilizes modern web technologies including HTML5, Tailwind CSS, JavaScript (ES6), and Google Firebase (Firestore & Auth).

## Features

- Real-time attendance tracking for athletes.
- User authentication using Firebase.
- Responsive design optimized for tablet devices.
- Easy-to-use interface for checking in athletes.

## Project Structure

```
cadott-wrestling-attendance
├── public
│   ├── index.html          # Main HTML structure of the application
│   ├── manifest.json       # Metadata for the web application
│   └── robots.txt          # Web crawling management
├── src
│   ├── js
│   │   ├── app.js          # Entry point for JavaScript logic
│   │   ├── auth.js         # Firebase authentication handling
│   │   ├── db.js           # Firestore interactions
│   │   ├── ui.js           # User interface updates
│   │   └── utils.js        # Utility functions
│   ├── components
│   │   ├── AttendanceList.js # Component for displaying athlete list
│   │   ├── CheckInTabletView.js # Main interface for checking in athletes
│   │   └── SettingsModal.js # Modal for settings and configurations
│   └── styles
│       └── input.css       # Custom styles and Tailwind CSS configurations
├── tests
│   └── app.test.js         # Unit tests for application logic
├── .firebaserc             # Firebase project configuration
├── firebase.json            # Firebase hosting configuration
├── firestore.rules          # Firestore security rules
├── package.json             # npm configuration file
├── tailwind.config.js       # Tailwind CSS configuration
├── postcss.config.js        # PostCSS configuration
├── .gitignore               # Git ignore file
└── README.md                # Project documentation
```

## Setup Instructions

1. **Clone the repository:**
   ```bash
   git clone <repository-url>
   cd cadott-wrestling-attendance
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Configure Firebase:**
   - Create a Firebase project and set up Firestore and Authentication.
   - Update the `.firebaserc` and `firebase.json` files with your project details.

4. **Run the application:**
   ```bash
   npm start
   ```

5. **Access the application:**
   Open your browser and navigate to `http://localhost:3000`.

## Usage Guidelines

- Users can sign in anonymously to track attendance.
- The main interface allows for easy check-in of athletes.
- Attendance data is stored in Firestore and can be accessed in real-time.

## Contributing

Contributions are welcome! Please submit a pull request or open an issue for any enhancements or bug fixes.

## License

This project is licensed under the MIT License.