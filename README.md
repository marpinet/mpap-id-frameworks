# MPAP Frameworks

Interactive platform for design frameworks and sense-making processes, inspired by Vijay Kumar's 101 Design Methods.

## Features

- 🎨 **14+ Design Frameworks** across 5 categories
- 📝 **Three Interaction Modes**: Guided steps, file upload, AI chat (coming soon)
- 💾 **Save & Organize**: Save your work and access it anywhere
- 🌓 **Dark Mode**: Full dark mode support
- 🔐 **Authentication**: Secure user accounts with Supabase
- 📱 **Responsive**: Works on desktop, tablet, and mobile

## Quick Start

### Development

1. Clone the repository
```bash
git clone https://github.com/marpinet/mpap-id-frameworks.git
cd mpap-id-frameworks
```

2. Install dependencies
```bash
npm install
```

3. Set up environment variables
```bash
cp .env.example .env
```
Add your Supabase credentials to `.env`

4. Run development server
```bash
npm run dev
```

5. Open [http://localhost:3000](http://localhost:3000)

### Build for Production

```bash
npm run build
```

### Preview Production Build

```bash
npm run preview
```

## Tech Stack

- **Frontend**: HTML, Tailwind CSS, JavaScript (ES6+)
- **Build Tool**: Vite
- **Backend**: Supabase (Authentication, Database, Storage)
- **Deployment**: Vercel

## Project Structure

```
mpap-id-frameworks/
├── src/
│   ├── js/
│   │   ├── auth.js          # Authentication logic
│   │   ├── supabase.js      # Supabase client & helpers
│   │   ├── frameworks.js    # Framework definitions
│   │   ├── main.js          # Homepage logic
│   │   ├── framework-page.js # Framework interaction
│   │   └── profile.js       # User profile
│   └── styles/
│       └── main.css         # Tailwind styles
├── framework_md_files/      # Framework documentation
├── key_md_files/           # Project documentation
├── public/                 # Static assets
├── index.html             # Homepage
├── framework.html         # Framework workspace
├── profile.html           # User profile
└── package.json
```

## Environment Variables

Required environment variables (add to `.env`):

```env
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

## Supabase Setup

See [SUPABASE_SETUP.md](./SUPABASE_SETUP.md) for detailed instructions on:
- Creating database tables
- Setting up Row Level Security policies
- Configuring storage buckets
- Email templates

## Deployment

### Deploy to Vercel

1. Push your code to GitHub
2. Import your repository in [Vercel](https://vercel.com)
3. Add environment variables in Vercel dashboard
4. Deploy!

Vercel will automatically detect the Vite configuration and deploy your site.

### Manual Deployment

```bash
npm run build
# Deploy the 'dist' folder to your hosting provider
```

## Framework Categories

1. **Sensing Intent** - Define project scope and goals
2. **Knowing Content** - Analyze resources and systems
3. **Knowing People** - Understand stakeholders and users
4. **Framing Insights** - Convert research into actionable insights
5. **Framing Solutions** - Develop strategic solutions

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

MIT License - see LICENSE file for details

## Support

For issues or questions, please open an issue on GitHub.

---

Built with ❤️ for designers and strategists
