# Tech Detail Decisions

This document outlines the technical decisions made for the project, organized by priority to ensure clarity on the most critical aspects.

---

## **High Priority Decisions**

### **Frontend**
- **Framework**: Simple HTML, CSS, and JavaScript.
- **Styling**: Tailwind CSS for responsive and modern design.
- **Component-Based Design**: Organize the project into reusable components (e.g., header, footer, framework sections).

### **Backend**
- **Backend Platform**: Supabase.
- **Authentication**: Both email/password-based authentication and third-party OAuth providers (e.g., Google, GitHub).
- **Data Storage**: Separate tables for each framework.
- **File Storage**: Supabase Storage for managing user-uploaded files.

### **Framework Interaction**
- **Interaction Methods**: Provide manual input, AI assistance (via OpenAI API), and file parsing.
- **Framework Output**: Both downloadable PDFs and an interactive dashboard.

### **Deployment**
- **Hosting**: Vercel.
- **Deployment Workflow**: Automatic deployment via GitHub integration.

---

## **Medium Priority Decisions**

### **User Experience**
- **User Profiles**: Folder structure for organizing saved frameworks and uploaded files.
- **Progress Tracking**: Step-by-step progress bar for framework completion.
- **Notifications**: In-app notifications only.
- **Framework Customization**: Predefined frameworks (non-editable).
- **Accessibility**: Light and dark themes with both auto-detection and manual toggle.

### **Testing**
- **Testing Method**: Manual testing for functionality and usability.

---

## **Low Priority Decisions**

### **Additional Decisions**

#### 1. **Version Control Workflow**
- **Decision**: Main Branch Only.
  - **Reason**: Simplifies workflow for small projects but requires careful testing before commits.

#### 2. **Error Handling**
- **Decision**: Detailed Debugging.
  - **Reason**: Helps developers identify issues quickly during development but not suitable for production.

#### 3. **Performance Optimization**
- **Decision**: No optimization initially.
  - **Reason**: Focuses on functionality first, with optimization planned for later stages.

#### 4. **Mobile Responsiveness**
- **Decision**: Low Priority.
  - **Reason**: Simplifies initial development but may alienate mobile users initially.

#### 5. **User Feedback Mechanism**
- **Decision**: No Feedback Mechanism.
  - **Reason**: Simplifies development but misses an opportunity to gather user insights.

---