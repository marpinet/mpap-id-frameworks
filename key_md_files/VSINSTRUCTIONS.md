# Agent Instructions: Building the MPAP Frameworks Website (SDLC with Conventional Commits)

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

## 4. Development Steps (SDLC)

### 4.1. Planning
1. Define project scope and objectives.
2. Identify stakeholders and gather requirements.
3. Create a project timeline and milestones.

### 4.2. Analysis
1. Analyze technical feasibility.
2. Define system requirements and architecture.
3. Document use cases and user stories.

### 4.3. Design
1. Create wireframes and mockups for the UI.
2. Define database schema and API endpoints.
3. Plan integration points for AI and Supabase.

### 4.4. Implementation
#### Frontend Development
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

#### Backend Development
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

### 4.5. Testing
1. **Unit Testing**:
   - Test individual components (e.g., file upload, AI chat).
   - Use a testing library like Jest.

2. **Integration Testing**:
   - Test the interaction between frontend and backend.
   - Verify Supabase and AI API integrations.

3. **User Testing**:
   - Conduct usability testing with real users.
   - Collect feedback and iterate on the design.

### 4.6. Deployment
1. **Set Up GitHub Repository**:
   - Push the project to a GitHub repository.
   - Enable automatic deployment to Vercel.

2. **Configure Vercel**:
   - Link the GitHub repository to Vercel.
   - Set up environment variables for Supabase and AI API keys.

3. **Test Deployment**:
   - Verify that all pages and features work as expected on the live site.

### 4.7. Maintenance
1. Monitor system performance and user feedback.
2. Fix bugs and implement updates.
3. Plan for future enhancements.

---

## 5. Conventional Commits
Follow the [Conventional Commits](https://www.conventionalcommits.org/) specification for commit messages:

- **feat**: A new feature.
- **fix**: A bug fix.
- **docs**: Documentation only changes.
- **style**: Changes that do not affect the meaning of the code (white-space, formatting, etc.).
- **refactor**: A code change that neither fixes a bug nor adds a feature.
- **perf**: A code change that improves performance.
- **test**: Adding missing tests or correcting existing tests.
- **chore**: Changes to the build process or auxiliary tools and libraries.

---

## 6. File Structure
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

## 7. Future Enhancements
- Add more frameworks and methods.
- Improve AI capabilities for secondary research.
- Enhance collaboration features (e.g., real-time editing).

---

This document provides a step-by-step guide to building the **MPAP Frameworks** website following the SDLC process and Conventional Commits. Adhering to these guidelines ensures a structured and maintainable development process.