# Parcha Flash Check

A modern React application that demonstrates the capabilities of the Parcha API for flash card generation from PDF documents. This project serves as both a reference implementation and a practical tool for developers interested in integrating Parcha's AI-powered flash card generation capabilities into their applications.

## 🚀 Features

- PDF document upload and processing
- Integration with Parcha API for flash card generation
- Modern UI built with Mantine
- Responsive design for various screen sizes
- TypeScript support for type safety
- PDF preview and handling

## 🛠️ Tech Stack

- React 18.3 with TypeScript
- Vite for blazing fast development
- Mantine UI components
- PDF.js for document handling
- Axios for API communication

## 📋 Prerequisites

- Node.js (LTS version recommended)
- npm or yarn
- A Parcha API key

## 🔧 Installation

1. Clone the repository:
```bash
git clone https://github.com/yourusername/parcha-flash-check.git
cd parcha-flash-check
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file in the root directory and add your Parcha API key:
```env
VITE_PARCHA_API_KEY=your_api_key_here
```

## 🚀 Development

To start the development server:

```bash
npm run dev
```

The application will be available at `http://localhost:5173`

## 🏗️ Building for Production

To create a production build:

```bash
npm run build
```

To preview the production build:

```bash
npm run preview
```

## 🧪 Linting

To run the linter:

```bash
npm run lint
```

## 📁 Project Structure

```
src/
├── components/     # Reusable UI components
├── services/      # API and service integrations
├── utils/         # Helper functions and utilities
├── context/       # React context providers
├── types/         # TypeScript type definitions
└── assets/        # Static assets
```

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request. For major changes, please open an issue first to discuss what you would like to change.

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🙏 Acknowledgments

- Built with [Parcha API](https://parcha.ai)
- UI components from [Mantine](https://mantine.dev)
- PDF handling with [React PDF Viewer](https://react-pdf-viewer.dev)
