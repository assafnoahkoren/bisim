# BiSim Features Design Document

## Overview
This document outlines the features to be implemented in the BiSim application, including authentication, document processing, question extraction, and solution generation.

## Tech Stack
- **Frontend**: React + Vite + TypeScript + Mantine UI + Tabler Icons
- **Backend**: NestJS + Prisma + PostgreSQL + MinIO + OpenAI API
- **Communication**: tRPC

## Features

### 1. Authentication & Authorization

#### Frontend Changes
- **Routing Structure**:
  - Install `react-router-dom` and `@mantine/core` + `@tabler/icons-react`
  - Create `PrivateRoute` component that checks authentication
  - Create `PublicRoute` component for unauthenticated access
  - Router structure:
    ```
    /login (public)
    /register (public)
    /dashboard (private)
    /admin/* (private, admin only)
    ```

- **Components**:
  - `LoginPage`: Email/password form with Mantine components
  - `RegisterPage`: Registration form with name, email, password
  - `AuthLayout`: Layout wrapper for auth pages
  - `AppLayout`: Layout wrapper with navigation for authenticated users

- **State Management**:
  - Create auth context with user info and role
  - Store JWT token in localStorage/sessionStorage
  - Add tRPC procedures for login/register/logout

#### Backend Changes
- **Prisma Schema Updates**:
  ```prisma
  model User {
    id        String   @id @default(cuid())
    email     String   @unique
    name      String?
    password  String
    role      Role     @default(USER)
    createdAt DateTime @default(now())
    updatedAt DateTime @updatedAt
    
    files     File[]
  }
  
  enum Role {
    USER
    ADMIN
  }
  ```

- **tRPC Procedures**:
  - `auth.register`: Create new user with hashed password
  - `auth.login`: Validate credentials, return JWT
  - `auth.me`: Get current user info
  - `auth.logout`: Invalidate session

- **Middleware**:
  - JWT authentication middleware
  - Role-based access control middleware

### 2. Document Upload & Processing

#### Frontend Changes
- **Admin Backoffice**:
  - `/admin/documents` - Document management page
  - Upload component using Mantine's Dropzone
  - Document list with status indicators
  - Progress indicators for processing stages

- **Components**:
  - `DocumentUpload`: Dropzone for PDF/DOCX files
  - `DocumentList`: Table showing uploaded documents
  - `DocumentStatus`: Processing status component

#### Backend Changes
- **Prisma Schema**:
  ```prisma
  model File {
    id          String   @id @default(cuid())
    filename    String
    originalName String
    mimeType    String
    size        Int
    s3Key       String
    status      FileStatus @default(UPLOADED)
    extractedText String? @db.Text
    userId      String
    user        User     @relation(fields: [userId], references: [id])
    createdAt   DateTime @default(now())
    updatedAt   DateTime @updatedAt
    
    questions   Question[]
  }
  
  enum FileStatus {
    UPLOADED
    PROCESSING
    COMPLETED
    FAILED
  }
  ```

- **Services**:
  - `FileService`: Handle file uploads to MinIO
  - `TextExtractionService`: Extract text from PDF/DOCX
  - `OpenAIService`: Interface with OpenAI API

- **tRPC Procedures**:
  - `files.upload`: Handle file upload and S3 storage
  - `files.list`: Get user's files
  - `files.getById`: Get file details
  - `files.delete`: Delete file and related data

### 3. Question Extraction & Processing

#### Frontend Changes
- **Question Management**:
  - `/admin/questions` - View extracted questions
  - Question detail view with sub-questions
  - Solution and hints display

- **Components**:
  - `QuestionList`: Display questions by document
  - `QuestionDetail`: Show question with sub-questions
  - `SolutionViewer`: Display solutions and hints

#### Backend Changes
- **Prisma Schema**:
  ```prisma
  model Question {
    id          String   @id @default(cuid())
    title       String
    content     String   @db.Text
    context     String?  @db.Text // Initial data/information
    fileId      String
    file        File     @relation(fields: [fileId], references: [id], onDelete: Cascade)
    createdAt   DateTime @default(now())
    updatedAt   DateTime @updatedAt
    
    subQuestions SubQuestion[]
  }
  
  model SubQuestion {
    id          String   @id @default(cuid())
    content     String   @db.Text
    solution    String?  @db.Text
    hints       String[] // Array of hint strings
    order       Int
    questionId  String
    question    Question @relation(fields: [questionId], references: [id], onDelete: Cascade)
    createdAt   DateTime @default(now())
    updatedAt   DateTime @updatedAt
  }
  ```

- **Processing Pipeline**:
  1. File upload triggers text extraction
  2. Extracted text sent to OpenAI for question extraction
  3. Questions parsed and stored in database
  4. Each sub-question sent to OpenAI for solution generation
  5. Hints generated for each sub-question

- **OpenAI Integration**:
  - **Question Extraction Prompt**:
    ```
    Extract all questions from this document. 
    For each question, identify:
    - The main question title
    - Any initial data or context
    - Sub-questions that need to be answered
    Format as JSON.
    ```
  
  - **Solution Generation Prompt**:
    ```
    Given this question and context, provide a detailed solution.
    Question: [sub-question]
    Context: [initial data]
    ```
  
  - **Hints Generation Prompt**:
    ```
    Generate 3-5 helpful hints for solving this question without giving away the answer.
    ```

- **tRPC Procedures**:
  - `questions.getByFile`: Get all questions for a file
  - `questions.getById`: Get question with sub-questions
  - `questions.regenerateSolution`: Re-generate solution for sub-question
  - `questions.updateHints`: Update hints for sub-question

### 4. User Dashboard

#### Frontend Changes
- **User Features**:
  - `/dashboard` - User home page
  - View their uploaded documents
  - Access extracted questions
  - Practice with questions and hints

- **Components**:
  - `Dashboard`: Overview of user's content
  - `PracticeMode`: Interactive question practice
  - `HintRevealer`: Progressive hint display

#### Backend Changes
- **tRPC Procedures**:
  - `user.getStats`: Get user statistics
  - `user.getRecentActivity`: Get recent uploads/questions

## Implementation Order

1. **Phase 1**: Authentication ✅
   - Set up Mantine UI and routing ✅
   - Implement login/register pages ✅
   - Add JWT authentication ✅

2. **Phase 2**: File Upload
   - Create admin backoffice
   - Implement file upload to MinIO
   - Add text extraction

3. **Phase 3**: AI Integration
   - Integrate OpenAI API
   - Implement question extraction
   - Add solution and hint generation

4. **Phase 4**: User Experience
   - Build user dashboard ✅
   - Add practice mode
   - Implement progress tracking

## Completed Features

### ✅ Authentication & Authorization
- Installed Mantine UI, Tabler Icons, and React Router
- Created public/private route components
- Implemented JWT authentication with NestJS
- Created login and register pages with form validation
- Added role-based access control (USER/ADMIN)
- Set up auth context for state management
- Created protected and admin-only routes

### ✅ Basic UI Structure
- Created app layout with navigation
- Added dashboard page
- Created placeholder admin pages
- Implemented logout functionality

### ✅ Testing Infrastructure
- Set up Playwright for E2E testing
- Created authentication test suite
- Tests cover: registration, login, logout, error handling

## Security Considerations

- JWT tokens with refresh token mechanism
- Role-based access control for admin features
- File upload validation and virus scanning
- Rate limiting for AI API calls
- Secure storage of OpenAI API keys

## Environment Variables

```env
# Existing
DATABASE_URL=postgresql://...
S3_ENDPOINT=http://localhost:10002
S3_ACCESS_KEY=minioadmin
S3_SECRET_KEY=minioadmin

# New
JWT_SECRET=your-secret-key
JWT_EXPIRES_IN=7d
OPENAI_API_KEY=sk-...
OPENAI_MODEL=gpt-4
MAX_FILE_SIZE=10485760 # 10MB
ALLOWED_FILE_TYPES=application/pdf,application/vnd.openxmlformats-officedocument.wordprocessingml.document
```