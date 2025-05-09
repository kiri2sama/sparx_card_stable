# SparX Card - Digital Business Card App

SparX Card is a modern digital business card application built with React Native and Expo. It allows users to create, share, and manage digital business cards using NFC technology and QR codes.

## Features

- Create and customize digital business cards
- Share business cards via NFC and QR codes
- Import contacts from device
- Save and manage business cards
- Track leads and analytics
- Social media profile integration
- Multiple card templates and customization options
- Dark mode support
- Offline functionality with data synchronization
- Multi-language support
- Accessibility features

## Getting Started

### Prerequisites

- Node.js (v14 or later)
- Yarn or npm
- Expo CLI
- iOS/Android development environment

### Installation

1. Clone the repository:
```bash
git clone https://github.com/yourusername/sparx-card.git
cd sparx-card
```

2. Install dependencies:
```bash
yarn install
```

3. Create a `.env` file based on `.env.example`:
```bash
cp .env.example .env
```

4. Start the development server:
```bash
yarn start
```

## Project Structure

```
sparx_card/
├── assets/              # Static assets like images
├── src/
│   ├── components/      # Reusable UI components
│   ├── examples/        # Example implementations
│   ├── i18n/            # Internationalization files
│   │   └── locales/     # Language translations
│   ├── navigation/      # Navigation configuration
│   ├── screens/         # App screens
│   ├── styles/          # Global styles and themes
│   ├── types/           # TypeScript type definitions
│   ├── utils/           # Utility functions
│   └── App.tsx          # Main app component
├── .env.example         # Example environment variables
└── package.json         # Project dependencies
```

## Key Technologies

- React Native
- Expo
- React Navigation
- React Native Paper
- NFC Manager
- QR Code Generator
- i18next for internationalization
- AsyncStorage for local storage

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- [React Native](https://reactnative.dev/)
- [Expo](https://expo.dev/)
- [React Native Paper](https://callstack.github.io/react-native-paper/)
- [React Navigation](https://reactnavigation.org/)