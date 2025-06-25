# Hahn Software - Product Management System

A full-stack CRUD (Create, Read, Update, Delete) application built with Java Spring Boot backend and React.js frontend, featuring a modern sky blue and white theme design.

## 🚀 Features

- **Full CRUD Operations**: Create, read, update, and delete products
- **Modern UI**: Clean and responsive design with sky blue and white theme
- **Real-time Search**: Search products by name, description, or category
- **Input Validation**: Comprehensive client and server-side validation
- **Error Handling**: Graceful error handling with user-friendly messages
- **Professional Design**: Hahn Software branding with modern UI components
- **Responsive Layout**: Works seamlessly on desktop and mobile devices

## 🛠 Technology Stack

### Backend
- **Java 17** - Programming language
- **Spring Boot 3.2.0** - Application framework
- **Spring Data JPA** - Data persistence
- **Spring Web** - REST API development
- **Spring Validation** - Input validation
- **PostgreSQL** - Database
- **Maven** - Build tool
- **JUnit 5** - Unit testing

### Frontend
- **React 19** - UI library
- **React Router** - Client-side routing
- **Axios** - HTTP client
- **Tailwind CSS** - Styling framework
- **shadcn/ui** - UI component library
- **Lucide Icons** - Icon library
- **Vite** - Build tool

### Database
- **PostgreSQL 14** - Primary database
- **JPA/Hibernate** - ORM framework

## 📁 Project Structure

```
hahn-crud-app/
├── backend/                          # Spring Boot backend
│   ├── src/
│   │   ├── main/
│   │   │   ├── java/com/hahnsoftware/crud/
│   │   │   │   ├── config/           # Configuration classes
│   │   │   │   ├── controller/       # REST controllers
│   │   │   │   ├── dto/              # Data Transfer Objects
│   │   │   │   ├── entity/           # JPA entities
│   │   │   │   ├── repository/       # Data repositories
│   │   │   │   ├── service/          # Business logic
│   │   │   │   └── CrudApplication.java
│   │   │   └── resources/
│   │   │       ├── application.properties
│   │   │       └── schema.sql
│   │   └── test/                     # Unit tests
│   └── pom.xml                       # Maven configuration
├── frontend/                         # React frontend
│   └── hahn-frontend/
│       ├── src/
│       │   ├── components/ui/        # UI components
│       │   ├── App.jsx              # Main application
│       │   ├── App.css              # Styles
│       │   └── main.jsx             # Entry point
│       ├── index.html
│       └── package.json
└── README.md                         # This file
```

## 🚀 Quick Start

### Prerequisites

- Java 17 or higher
- Node.js 18 or higher
- PostgreSQL 12 or higher
- Maven 3.6 or higher

### Database Setup

1. Install PostgreSQL and start the service
2. Create database and user:
```sql
CREATE DATABASE hahn_crud_db;
CREATE USER postgres WITH PASSWORD 'password';
GRANT ALL PRIVILEGES ON DATABASE hahn_crud_db TO postgres;
```

### Backend Setup

1. Navigate to the backend directory:
```bash
cd backend
```

2. Build the project:
```bash
mvn clean compile
```

3. Run the application:
```bash
mvn spring-boot:run
```

The backend will start on `http://localhost:8080`

### Frontend Setup

1. Navigate to the frontend directory:
```bash
cd frontend/hahn-frontend
```

2. Install dependencies:
```bash
pnpm install
```

3. Start the development server:
```bash
pnpm run dev --host
```

The frontend will start on `http://localhost:5173`

## 📖 API Documentation

### Base URL
```
http://localhost:8080/api
```

### Endpoints

#### Get All Products
```http
GET /products
```

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "name": "Product Name",
      "description": "Product description",
      "price": 99.99,
      "quantity": 10,
      "category": "Electronics",
      "createdAt": "2025-06-25T20:30:00",
      "updatedAt": "2025-06-25T20:30:00"
    }
  ],
  "message": "Products retrieved successfully"
}
```

#### Get Product by ID
```http
GET /products/{id}
```

#### Create Product
```http
POST /products
Content-Type: application/json

{
  "name": "Product Name",
  "description": "Product description",
  "price": 99.99,
  "quantity": 10,
  "category": "Electronics"
}
```

#### Update Product
```http
PUT /products/{id}
Content-Type: application/json

{
  "name": "Updated Product Name",
  "description": "Updated description",
  "price": 129.99,
  "quantity": 15,
  "category": "Electronics"
}
```

#### Delete Product
```http
DELETE /products/{id}
```

#### Search Products
```http
GET /products/search?q=searchTerm
```

#### Get Products by Category
```http
GET /products/category/{category}
```

#### Get Low Stock Products
```http
GET /products/low-stock?threshold=10
```

## 🎨 Design System

### Color Palette
- **Primary**: Sky Blue (#3B82F6)
- **Background**: Very Light Sky Blue (#F8FAFC)
- **Cards**: Pure White (#FFFFFF)
- **Text**: Dark Blue (#1E293B)
- **Borders**: Light Sky Blue (#E2E8F0)

### Typography
- **Headings**: Inter font family, bold weights
- **Body**: Inter font family, regular weight
- **Code**: Monospace font family

## 🧪 Testing

### Backend Tests
Run unit tests for the backend:
```bash
cd backend
mvn test
```

### Test Coverage
- **ProductService**: Comprehensive unit tests for all CRUD operations
- **Validation**: Tests for input validation and error handling
- **Repository**: Tests for custom query methods

## 🔧 Configuration

### Backend Configuration
Key configuration in `application.properties`:
- Database connection settings
- JPA/Hibernate configuration
- CORS settings
- Server port and address

### Frontend Configuration
- API base URL configuration
- Responsive design breakpoints
- Theme customization

## 📦 Build and Deployment

### Backend Build
```bash
cd backend
mvn clean package
java -jar target/crud-backend-0.0.1-SNAPSHOT.jar
```

### Frontend Build
```bash
cd frontend/hahn-frontend
pnpm run build
```

## 🐳 Docker Support

Docker configuration files are included for containerized deployment:

### Backend Dockerfile
```dockerfile
FROM openjdk:17-jdk-slim
COPY target/crud-backend-0.0.1-SNAPSHOT.jar app.jar
EXPOSE 8080
ENTRYPOINT ["java", "-jar", "/app.jar"]
```

### Frontend Dockerfile
```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build
EXPOSE 5173
CMD ["npm", "run", "preview"]
```

## 🔒 Security Features

- Input validation on both client and server sides
- SQL injection prevention through JPA/Hibernate
- XSS protection through proper data handling
- CORS configuration for secure cross-origin requests

## 🚀 Performance Optimizations

- Database indexing on frequently queried fields
- Efficient JPA queries with proper relationships
- Frontend code splitting and lazy loading
- Optimized bundle size with Vite

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 👥 Authors

- **Hahn Software Development Team**

## 🙏 Acknowledgments

- Spring Boot community for excellent documentation
- React team for the powerful UI library
- shadcn/ui for beautiful component library
- Tailwind CSS for utility-first styling

## 📞 Support

For support and questions, please contact the Hahn Software development team.

---

**Hahn Software** - Building innovative solutions with modern technology stacks.

