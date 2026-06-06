# Daily Routine Management System (DRMS)

A comprehensive full-stack application for task planning, progress tracking, and daily productivity management. Built with Spring Boot backend and React frontend, featuring AI-powered insights and mood tracking.

## 📋 Project Overview

**Daily Routine Management System (DRMS)** is a modern productivity management platform designed to help users organize their daily tasks, track progress, monitor their mood, and optimize their productivity patterns. The system provides intelligent features for routine management with real-time synchronization between frontend and backend.

**Repository Created**: June 6, 2026

## 🏗️ Project Structure

```
Daily-Routine-Management-System/
├── drms-frontend/                # React + Vite frontend application
│   ├── src/                      # React components and pages
│   ├── public/                   # Static assets
│   ├── package.json              # npm dependencies
│   ├── package-lock.json         # Dependency lock file
│   ├── vite.config.js            # Vite configuration
│   ├── index.html                # HTML entry point
│   └── .gitignore                # Git ignore rules
│
├── drms-backend/                 # Spring Boot backend application
│   ├── src/                      # Java source code
│   ├── pom.xml                   # Maven dependencies
│   ├── api_docs.md               # API documentation
│   ├── start-backend.bat         # Windows startup script
│   ├── kill-port-8083.bat        # Port cleanup script
│   ├── test-ai-endpoints.bat     # AI endpoint testing
│   ├── verify_startup.bat        # Startup verification
│   └── .gitignore                # Git ignore rules
│
├── clean_db.sql                  # Database cleanup script
├── drop_mood_constraint.sql      # Mood constraint modification
├── .gitignore                    # Project-wide git ignore
└── README.md                     # This file
```

## 🛠️ Tech Stack

### Frontend
- **React 18+** - Modern UI library
- **Vite** - Lightning-fast build tool
- **JavaScript (ES6+)** - Modern JavaScript
- **Package Manager**: npm/yarn

### Backend
- **Java 11+** - Programming language
- **Spring Boot 2.7+** - Application framework
- **Spring Data JPA** - Data persistence
- **Maven** - Build and dependency management
- **MySQL/MariaDB** - Relational database
- **Hibernate** - ORM framework

### Database
- **MySQL 5.7+** or **MariaDB**
- Tables for tasks, routines, mood tracking, user profiles

### Language Composition
- **JavaScript: 100%** (Primary development language)

## 🚀 Getting Started

### Prerequisites

**Global Requirements:**
- Git
- MySQL 5.7+ or MariaDB

**Frontend Requirements:**
- Node.js 14+ and npm/yarn
- Modern web browser

**Backend Requirements:**
- Java 11+
- Maven 3.6+

### Frontend Setup

```bash
# Navigate to frontend directory
cd drms-frontend

# Install dependencies
npm install

# Start development server (Port 5173)
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

**Frontend Environment:**
```
VITE_API_BASE_URL=http://localhost:8084/api
```

### Backend Setup

```bash
# Navigate to backend directory
cd drms-backend

# Build with Maven
mvn clean install

# Run the application (Port 8084)
mvn spring-boot:run

# Build JAR for production
mvn clean package
```

**Backend Configuration** (`application.properties`):
```properties
server.port=8084
spring.datasource.url=jdbc:mysql://localhost:3306/drms
spring.datasource.username=root
spring.datasource.password=your_password
spring.jpa.hibernate.ddl-auto=update
spring.jpa.show-sql=false
```

### Database Setup

```sql
-- Create database
CREATE DATABASE drms;
USE drms;

-- Run any initialization scripts
-- Tables will be auto-created by Hibernate
```

**Database Cleanup:**
To reset your database and remove all tables, run:
```bash
mysql -u root -p drms < clean_db.sql
```

**Modify Mood Constraints:**
To modify mood-related database constraints:
```bash
mysql -u root -p drms < drop_mood_constraint.sql
```

## 📁 Key Features

### Task Management
✅ **Create Tasks** - Add daily tasks with descriptions and priorities  
✅ **Task Categories** - Organize tasks by category  
✅ **Priority Levels** - Set high, medium, low priorities  
✅ **Deadlines** - Add due dates and time tracking  
✅ **Task Status** - Mark tasks as pending, in-progress, completed  

### Routine Management
✅ **Daily Routines** - Create and manage daily routines  
✅ **Routine Templates** - Save and reuse routine templates  
✅ **Scheduling** - Schedule routines for specific days/times  
✅ **Reminders** - Get notified about upcoming routines  

### Progress Tracking
✅ **Progress Dashboard** - Visual progress indicators  
✅ **Completion Rate** - Track daily completion metrics  
✅ **History** - View past task completion records  
✅ **Analytics** - Productivity analytics and insights  

### Mood Tracking
✅ **Daily Mood Log** - Record daily mood entries  
✅ **Mood Patterns** - Identify mood patterns over time  
✅ **Mood-Task Correlation** - Correlate mood with task completion  
✅ **Mood Insights** - AI-powered mood insights  

### AI Features
✅ **Smart Suggestions** - AI-powered task suggestions  
✅ **Productivity Insights** - Analyze productivity patterns  
✅ **Personalized Recommendations** - Get personalized suggestions  
✅ **Predictive Analytics** - Predict productivity trends  

## 📦 Available Scripts

### Frontend Scripts

```bash
npm run dev           # Start development server
npm run build         # Build for production
npm run preview       # Preview production build
npm run lint         # Run ESLint
```

### Backend Scripts

```bash
# Maven commands
mvn clean install         # Install and build
mvn spring-boot:run       # Run application
mvn clean package         # Create JAR file
mvn test                 # Run tests

# Windows batch scripts (in drms-backend directory)
start-backend.bat         # Start backend on Windows
kill-port-8083.bat        # Kill process on port 8083
verify_startup.bat        # Verify backend startup
test-ai-endpoints.bat     # Test AI endpoints
```

## 🔌 API Endpoints

### Authentication
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/auth/register` | Register new user |
| POST | `/auth/login` | Login user |
| POST | `/auth/forgot-password` | Request password reset |
| POST | `/auth/reset-password` | Reset password |

### Tasks Management
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/tasks` | Get all tasks for user |
| POST | `/tasks` | Create new task |
| PUT | `/tasks/{id}` | Update task |
| DELETE | `/tasks/{id}` | Delete task |
| GET | `/tasks/history` | Get task history |
| POST | `/tasks/{id}/reschedule` | Reschedule task |
| PATCH | `/tasks/{id}/focus` | Update focus stats |

### Routines Management
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/routines` | Get all routines |
| POST | `/routines` | Create routine |

### Reviews & Feedback
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/reviews/task/{taskId}` | Get review for task |
| POST | `/reviews` | Submit review |

### Analytics & AI
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/analytics/dashboard` | Get dashboard stats |
| GET | `/ai/suggestions` | Get AI suggestions |
| GET | `/ai/insight` | Get AI insights |

### Alarms
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/alarms/upload` | Upload alarm sound |

**Base URL**: `http://localhost:8084/api`

**Headers**: `Authorization: Bearer <token>`

For detailed API documentation, see the [API Documentation File](drms-backend/api_docs.md)

## 🗄️ Database Schema

### Core Tables
- **users** - User profiles and authentication
- **tasks** - Task information and status
- **routines** - Daily routine definitions
- **mood_entries** - Mood tracking records
- **progress_logs** - Progress tracking data
- **user_preferences** - User settings and preferences
- **ai_insights** - AI-generated insights
- **task_categories** - Task category definitions

## 🔐 Security Features

- **User Authentication** - Secure login system
- **Password Encryption** - Bcrypt password hashing
- **Session Management** - Session-based or JWT tokens
- **Input Validation** - Server-side input validation
- **CORS Protection** - Cross-origin request control

## 📝 Configuration

### Ports
- **Frontend**: 5173 (Vite development server)
- **Backend**: 8084 (Spring Boot application)
- **Database**: 3306 (MySQL default)

### Key Configuration Files

**Frontend:**
- `vite.config.js` - Vite build configuration
- `package.json` - npm dependencies and scripts

**Backend:**
- `pom.xml` - Maven dependencies and plugins
- `application.properties` - Spring Boot configuration
- `api_docs.md` - API documentation

## 🐛 Troubleshooting

### Frontend Issues
- **Dependencies not installing**: 
  ```bash
  rm -rf node_modules package-lock.json
  npm install
  ```
- **Port 5173 in use**: Change port in `vite.config.js`
- **Build errors**: Check Node.js version compatibility

### Backend Issues
- **Port 8084 in use**:
  ```bash
  # Windows - Run from drms-backend directory
  kill-port-8083.bat
  ```
  Or change `server.port` in `application.properties`

- **Database connection error**:
  - Verify MySQL is running
  - Check username and password
  - Ensure database exists

- **Maven build failure**:
  ```bash
  mvn clean install -DskipTests
  ```

### Database Issues
- **Reset database** (WARNING: Deletes all data):
  ```bash
  mysql -u root -p drms < clean_db.sql
  ```
- **Mood constraint issues**:
  ```bash
  mysql -u root -p drms < drop_mood_constraint.sql
  ```

## 📝 Development Workflow

### Getting Started for Developers

1. **Clone the repository**
   ```bash
   git clone https://github.com/AdityaPrasadSwain/Daily-Routine-Management-System.git
   cd Daily-Routine-Management-System
   ```

2. **Setup backend**
   ```bash
   cd drms-backend
   mvn clean install
   mvn spring-boot:run
   ```

3. **Setup frontend** (in new terminal)
   ```bash
   cd drms-frontend
   npm install
   npm run dev
   ```

4. **Access application**
   - Frontend: http://localhost:5173
   - Backend API: http://localhost:8084/api

### Testing

**Test AI Endpoints (Windows):**
```bash
cd drms-backend
test-ai-endpoints.bat
```

**Verify Startup (Windows):**
```bash
cd drms-backend
verify_startup.bat
```

## 🤝 Contributing

To contribute to this project:
1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is open source. Check the repository for license details.

## 👨‍💻 Developer Information

**Repository Owner**: AdityaPrasadSwain  
**Repository**: Daily-Routine-Management-System  
**Repository ID**: 1261454746  
**Created**: June 6, 2026 (Recently created)  
**Language**: JavaScript (100%)  
**Default Branch**: main  
**Open Issues**: 0  
**GitHub URL**: https://github.com/AdityaPrasadSwain/Daily-Routine-Management-System

## 📞 Support & Documentation

### Important Files

1. **API Documentation**
   - Path: `drms-backend/api_docs.md`
   - Contains complete API endpoint reference
   - View raw: https://raw.githubusercontent.com/AdityaPrasadSwain/Daily-Routine-Management-System/main/drms-backend/api_docs.md

2. **Database Cleanup Script**
   - Path: `clean_db.sql`
   - Used to reset the database (WARNING: Deletes all data)
   - View raw: https://raw.githubusercontent.com/AdityaPrasadSwain/Daily-Routine-Management-System/main/clean_db.sql

3. **Mood Constraint Script**
   - Path: `drop_mood_constraint.sql`
   - Used to modify mood-related database constraints
   - View raw: https://raw.githubusercontent.com/AdityaPrasadSwain/Daily-Routine-Management-System/main/drop_mood_constraint.sql

4. **Backend Startup Script** (Windows)
   - Path: `drms-backend/start-backend.bat`
   - Automated script to start the backend
   - View raw: https://raw.githubusercontent.com/AdityaPrasadSwain/Daily-Routine-Management-System/main/drms-backend/start-backend.bat

### Issue Tracking
- **GitHub Issues**: https://github.com/AdityaPrasadSwain/Daily-Routine-Management-System/issues
- Report bugs, request features, and track development

### Getting Help

For issues, questions, or suggestions:
1. Check troubleshooting section above
2. Review API documentation in `drms-backend/api_docs.md`
3. Open a GitHub issue with detailed information
4. Include error messages and system information

## Windows Users - Quick Reference

To run backend startup script:
```bash
cd drms-backend
start-backend.bat
```

This script will:
1. ✅ Check for existing process on port 8084
2. ✅ Kill the process if found
3. ✅ Run Maven clean
4. ✅ Start Spring Boot application
5. ✅ Set JVM memory options (-Xms1g -Xmx2g)

## 🎯 Future Enhancements

- [ ] Mobile application (React Native)
- [ ] Voice command integration
- [ ] Calendar integration
- [ ] Notification system
- [ ] Social features (team collaboration)
- [ ] Advanced analytics dashboard
- [ ] Integration with calendar apps
- [ ] Email reminders and summaries
- [ ] Performance optimization
- [ ] Enhanced AI recommendations

---

**Start managing your daily routine efficiently! 🎯**

For more information, visit the [GitHub repository](https://github.com/AdityaPrasadSwain/Daily-Routine-Management-System).

**Last Updated**: June 6, 2026
