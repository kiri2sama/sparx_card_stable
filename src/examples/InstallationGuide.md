# UI Library Installation Guide

This guide provides installation instructions for the three recommended UI libraries.

## 1. React Native Paper

React Native Paper is a Material Design implementation for React Native.

### Installation

```bash
# Using npm
npm install react-native-paper

# Using yarn
yarn add react-native-paper

# Install peer dependencies
npm install react-native-vector-icons
# or
yarn add react-native-vector-icons
```

### Setup

Add this to your `App.js` or main component:

```jsx
import { Provider as PaperProvider } from 'react-native-paper';

export default function App() {
  return (
    <PaperProvider>
      {/* Your app content */}
    </PaperProvider>
  );
}
```

For iOS, you need to link the vector icons:

```bash
npx pod-install ios
```

For Android, edit `android/app/build.gradle`:

```gradle
apply from: "../../node_modules/react-native-vector-icons/fonts.gradle"
```

## 2. NativeBase

NativeBase is a component library that enables you to build universal design systems.

### Installation

```bash
# Using npm
npm install native-base

# Using yarn
yarn add native-base

# Install peer dependencies
npm install react-native-svg react-native-safe-area-context
# or
yarn add react-native-svg react-native-safe-area-context
```

### Setup

Add this to your `App.js` or main component:

```jsx
import { NativeBaseProvider } from 'native-base';

export default function App() {
  return (
    <NativeBaseProvider>
      {/* Your app content */}
    </NativeBaseProvider>
  );
}
```

For Expo users, you may need:

```bash
expo install react-native-svg react-native-safe-area-context
```

## 3. UI Kitten

UI Kitten is a React Native UI library based on Eva Design System.

### Installation

```bash
# Using npm
npm install @ui-kitten/components @eva-design/eva

# Using yarn
yarn add @ui-kitten/components @eva-design/eva
```

### Setup

Add this to your `App.js` or main component:

```jsx
import * as eva from '@eva-design/eva';
import { ApplicationProvider } from '@ui-kitten/components';

export default function App() {
  return (
    <ApplicationProvider {...eva} theme={eva.light}>
      {/* Your app content */}
    </ApplicationProvider>
  );
}
```

For UI Kitten icons:

```bash
# Using npm
npm install @ui-kitten/eva-icons

# Using yarn
yarn add @ui-kitten/eva-icons
```

## Comparison

| Feature | React Native Paper | NativeBase | UI Kitten |
|---------|-------------------|------------|-----------|
| Design System | Material Design | Custom | Eva Design System |
| Theming | ✅ | ✅ | ✅ |
| Dark Mode | ✅ | ✅ | ✅ |
| Web Support | ✅ | ✅ | ✅ |
| Component Count | 30+ | 40+ | 20+ |
| Customization | Good | Excellent | Excellent |
| TypeScript | ✅ | ✅ | ✅ |
| Learning Curve | Low | Medium | Medium |
| Community | Large | Large | Medium |

## Recommendation

- **React Native Paper**: Best for Material Design lovers and simplicity
- **NativeBase**: Best for maximum customization and component variety
- **UI Kitten**: Best for consistent theming and design system adherence

## Troubleshooting

### React Native Paper

- If you encounter issues with vector icons, make sure to properly link them:
  ```bash
  # For React Native 0.60 and above
  npx react-native link react-native-vector-icons
  ```
- For web support, you may need to add the following to your webpack config:
  ```javascript
  module.exports = {
    // ...
    resolve: {
      alias: {
        'react-native$': 'react-native-web',
      },
    },
  };
  ```

### NativeBase

- If you see the error "NativeBase: missing theme config", make sure to provide a theme:
  ```jsx
  import { NativeBaseProvider, extendTheme } from 'native-base';
  
  const theme = extendTheme({
    // your custom theme here
  });
  
  export default function App() {
    return (
      <NativeBaseProvider theme={theme}>
        {/* Your app content */}
      </NativeBaseProvider>
    );
  }
  ```
- For Expo users, make sure to install the correct versions of dependencies:
  ```bash
  expo install react-native-svg@12.1.1 react-native-safe-area-context@3.3.2
  ```

### UI Kitten

- If you encounter issues with icons, make sure to register the icon pack:
  ```jsx
  import * as eva from '@eva-design/eva';
  import { ApplicationProvider, IconRegistry } from '@ui-kitten/components';
  import { EvaIconsPack } from '@ui-kitten/eva-icons';
  
  export default () => (
    <>
      <IconRegistry icons={EvaIconsPack} />
      <ApplicationProvider {...eva} theme={eva.light}>
        {/* Your app content */}
      </ApplicationProvider>
    </>
  );
  ```
- For TypeScript users, you may need to add proper type definitions for your components.