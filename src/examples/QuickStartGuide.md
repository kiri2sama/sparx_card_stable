# UI Library Quick Start Guide

This guide will help you quickly set up React Native Paper, which is the easiest UI library to implement for React Native projects.

## Quick Installation

```bash
# Install React Native Paper
npm install react-native-paper

# Install peer dependencies
npm install react-native-vector-icons

# For iOS, install pods
npx pod-install ios
```

## Basic Setup

1. Edit your `App.js` or main component:

```jsx
import React from 'react';
import { Provider as PaperProvider, DefaultTheme } from 'react-native-paper';
import SimpleUIExample from './src/examples/SimpleUIExample';

// Optional: Define a custom theme
const theme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    primary: '#6200ee',
    accent: '#03dac4',
  },
};

export default function App() {
  return (
    <PaperProvider theme={theme}>
      <SimpleUIExample />
    </PaperProvider>
  );
}
```

2. For Android, edit `android/app/build.gradle`:

```gradle
apply from: "../../node_modules/react-native-vector-icons/fonts.gradle"
```

## Common Components

Here are some commonly used components from React Native Paper:

### Buttons

```jsx
import { Button } from 'react-native-paper';

// Text Button
<Button onPress={() => console.log('Pressed')}>
  Press Me
</Button>

// Contained Button
<Button mode="contained" onPress={() => console.log('Pressed')}>
  Press Me
</Button>

// Outlined Button
<Button mode="outlined" onPress={() => console.log('Pressed')}>
  Press Me
</Button>

// Button with Icon
<Button icon="camera" mode="contained" onPress={() => console.log('Pressed')}>
  Take Photo
</Button>
```

### Cards

```jsx
import { Card, Title, Paragraph } from 'react-native-paper';

<Card>
  <Card.Cover source={{ uri: 'https://picsum.photos/700' }} />
  <Card.Content>
    <Title>Card Title</Title>
    <Paragraph>Card content</Paragraph>
  </Card.Content>
  <Card.Actions>
    <Button>Cancel</Button>
    <Button>Ok</Button>
  </Card.Actions>
</Card>
```

### Text Inputs

```jsx
import { TextInput } from 'react-native-paper';

const [text, setText] = React.useState('');

<TextInput
  label="Email"
  value={text}
  onChangeText={text => setText(text)}
/>

<TextInput
  label="Password"
  secureTextEntry
  right={<TextInput.Icon name="eye" />}
/>
```

### App Bar

```jsx
import { Appbar } from 'react-native-paper';

<Appbar.Header>
  <Appbar.BackAction onPress={() => {}} />
  <Appbar.Content title="Title" subtitle="Subtitle" />
  <Appbar.Action icon="magnify" onPress={() => {}} />
  <Appbar.Action icon="dots-vertical" onPress={() => {}} />
</Appbar.Header>
```

## Next Steps

1. Check out the [SimpleUIExample.tsx](./SimpleUIExample.tsx) file for a complete example
2. Explore the [React Native Paper documentation](https://callstack.github.io/react-native-paper/) for more components
3. For more advanced UI needs, consider exploring NativeBase or UI Kitten as described in the [Installation Guide](./InstallationGuide.md)

## Troubleshooting

If you encounter any issues:

1. Make sure all dependencies are properly installed
2. For iOS, ensure you've run `pod install`
3. For Android, verify the vector icons are properly linked
4. Check the console for any error messages

For more detailed troubleshooting, refer to the [Installation Guide](./InstallationGuide.md).