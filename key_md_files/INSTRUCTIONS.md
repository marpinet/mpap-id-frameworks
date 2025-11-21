# Agent Instructions: Building the MPAP Frameworks Website

## 1. Project Overview
The **MPAP Frameworks** website is an interactive platform designed to help users and teams engage with design frameworks. The platform allows users to upload files, interact with AI, and follow guided steps to complete frameworks. Outputs are downloadable and can be saved for future use.

---

## 2. Technical Stack
- **Frontend**: HTML, CSS (Tailwind CSS), JavaScript
- **Backend**: Supabase (authentication, data storage, file management)
- **Deployment**: Vercel (automatic deployment via GitHub integration)

---

## 3. Website Structure
The website will have the following key sections:

### 3.1. Homepage
- **Purpose**: Introduce the platform and its features.
- **Content**:
  - Hero section with a tagline and call-to-action (CTA) buttons.
  - Overview of the platform’s purpose and benefits.
  - Links to framework categories.
- **Features**:
  - Login/Sign-up buttons.
  - Navigation bar with links to all major sections.

### 3.2. Framework Categories
- **Purpose**: Display the five framework categories.
- **Content**:
  - List of categories: Sensing Intent, Knowing Content, Knowing People, Framing Insights, Framing Solutions.
  - Brief description of each category.
  - Links to individual framework pages.

### 3.3. Framework Pages
- **Purpose**: Provide detailed instructions and interaction options for each framework.
- **Content**:
  - Framework name and description.
  - Purpose of the framework.
  - Interaction options:
    1. Upload files.
    2. Chat with AI.
    3. Guided steps.
  - Output options (e.g., download as PDF, save to profile).
- **Features**:
  - File upload functionality.
  - AI chat integration.
  - Step-by-step instructions.

### 3.4. User Dashboard
- **Purpose**: Allow users to manage saved frameworks and collaborate with teams.
- **Content**:
  - List of saved frameworks organized in folders.
  - Collaboration tools (e.g., invite team members, share frameworks).
- **Features**:
  - Profile management.
  - Framework organization and search.

### 3.5. About Page
- **Purpose**: Provide information about the platform and its creators.
- **Content**:
  - Mission statement.
  - Acknowledgment of Vijay Kumar’s *101 Design Methods*.
  - Contact information.

---

## 4. Development Steps

### 4.1. Frontend Development
1. **Set Up Project**:
   - Initialize a new project with `npm` or `yarn`.
   - Install Tailwind CSS for styling.

   ```bash
   npm install tailwindcss postcss autoprefixer
   npx tailwindcss init
   ```

2. **Create Pages**:
   - Build the homepage (`index.html`).
   - Create category pages and individual framework pages.
   - Develop the user dashboard and about page.

3. **Responsive Design**:
   - Use Tailwind CSS to ensure the website is mobile-friendly.

4. **Framework Interaction UI**:
   - Add file upload fields.
   - Integrate AI chat interface (placeholder for now).
   - Create step-by-step instructions with collapsible sections.

### 4.2. Backend Development
1. **Set Up Supabase**:
   - Create a Supabase project.
   - Configure authentication (email/password, OAuth).
   - Set up database tables for:
     - Users
     - Frameworks
     - Saved files

2. **API Integration**:
   - Use Supabase’s RESTful API to handle:
     - User authentication.
     - File uploads and storage.
     - Framework data retrieval and saving.

3. **AI Integration**:
   - Integrate an AI API (e.g., OpenAI GPT) for the chat functionality.
   - Create endpoints to handle AI queries and responses.

### 4.3. Deployment
1. **Set Up GitHub Repository**:
   - Push the project to a GitHub repository.
   - Enable automatic deployment to Vercel.

2. **Configure Vercel**:
   - Link the GitHub repository to Vercel.
   - Set up environment variables for Supabase and AI API keys.

3. **Test Deployment**:
   - Verify that all pages and features work as expected on the live site.

---

## 5. File Structure
Organize the project files as follows:

```
mpap-frameworks/
├── public/
│   ├── assets/          # Images, icons, etc.
│   └── index.html       # Homepage
├── src/
│   ├── components/      # Reusable components (e.g., navbar, footer)
│   ├── pages/           # Framework pages, dashboard, about page
│   ├── styles/          # Tailwind CSS configuration
│   └── utils/           # Helper functions (e.g., API calls)
├── .env                 # Environment variables
├── package.json         # Project dependencies
└── README.md            # Project documentation
```

---

## 6. Testing
1. **Unit Testing**:
   - Test individual components (e.g., file upload, AI chat).
   - Use a testing library like Jest.

2. **Integration Testing**:
   - Test the interaction between frontend and backend.
   - Verify Supabase and AI API integrations.

3. **User Testing**:
   - Conduct usability testing with real users.
   - Collect feedback and iterate on the design.

---

## 7. Future Enhancements
- Add more frameworks and methods.
- Improve AI capabilities for secondary research.
- Enhance collaboration features (e.g., real-time editing).

---

This document provides a step-by-step guide to building the **MPAP Frameworks** website. Follow these instructions to ensure a successful implementation.