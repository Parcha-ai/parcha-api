# Document Validation Playground

A modern React application built with Vite and TypeScript for performing quick business verifications using the Parcha API. The app features a clean UI built with Mantine components and includes PDF viewing capabilities.

## 🚀 Prerequisites

- Node.js (v18 or higher)
- npm or yarn package manager
- Parcha API credentials (API key and agent key)

## 📦 Installation

1. Clone the repository:
```bash
git clone https://github.com/Parcha-ai/parcha-api.git
cd parcha-api/typescript/examples/flash_check
```

2. Install dependencies:
```bash
npm install
# or if you use yarn
yarn install
```

3. Configure environment variables:

Create a `.env` file in the project root with the following variables:
```env
# Required: Your Parcha API key from the dashboard
VITE_API_KEY=your_api_key_here

# Required: Your agent key for document validation
# Please ask the Parcha team for your unique agent key.
VITE_AGENT_KEY=parcha-poa-v1

# Optional: API URL - defaults to https://demo.parcha.ai/api/v1
VITE_API_URL=http://localhost:8001/api/v1
```

> 💡 **Note:** You can get your API credentials from the [Parcha Dashboard](https://demo.parcha.ai). If you don't have access yet, [contact our team](mailto:support@parcha.ai).

## 🛠️ Development

To run the development server:

```bash
npm run dev
# or with yarn
yarn dev
```

This will start the development server at `http://localhost:5173`. The app features hot module replacement (HMR) for a smooth development experience.

## 🏗️ Building for Production

To create a production build:

```bash
npm run build
# or with yarn
yarn build
```

To preview the production build locally:

```bash
npm run preview
# or with yarn
yarn preview
```

## 🧰 Tech Stack

- React 18
- TypeScript
- Vite
- Mantine UI Components
- PDF.js for PDF handling
- Axios for API requests

## 📝 Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Create production build
- `npm run lint` - Run ESLint
- `npm run preview` - Preview production build

## 📚 Features

- Modern React with TypeScript
- Fast development with Vite
- Beautiful UI with Mantine components
- PDF file handling and preview
- File drag and drop support
- Real-time notifications
- Type-safe development experience

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details. 