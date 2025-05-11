import React, { useState } from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { 
  Button, 
  Card, 
  Title, 
  Paragraph, 
  TextInput, 
  Appbar, 
  Provider as PaperProvider,
  DefaultTheme,
  DarkTheme,
  Switch,
  Text
} from 'react-native-paper';

// Define a simple theme
const theme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    primary: '#6200ee',
    accent: '#03dac4',
  },
};

const SimpleUIExample = () => {
  const [darkMode, setDarkMode] = useState(false);
  const [text, setText] = useState('');

  const toggleTheme = () => {
    setDarkMode(!darkMode);
  };

  return (
    <PaperProvider theme={darkMode ? DarkTheme : theme}>
      <View style={styles.container}>
        <Appbar.Header>
          <Appbar.Content title="Simple UI Example" />
          <View style={styles.themeToggle}>
            <Text style={{ color: 'white', marginRight: 8 }}>Dark Mode</Text>
            <Switch value={darkMode} onValueChange={toggleTheme} />
          </View>
        </Appbar.Header>

        <ScrollView style={styles.content}>
          {/* Simple Card */}
          <Card style={styles.card}>
            <Card.Content>
              <Title>Welcome to Your App</Title>
              <Paragraph>
                This is a simple example using React Native Paper components.
                You can easily customize and extend these components.
              </Paragraph>
            </Card.Content>
            <Card.Actions>
              <Button>Cancel</Button>
              <Button mode="contained">OK</Button>
            </Card.Actions>
          </Card>

          {/* Simple Form */}
          <Card style={styles.card}>
            <Card.Content>
              <Title>Contact Form</Title>
              <TextInput
                label="Name"
                value={text}
                onChangeText={text => setText(text)}
                style={styles.input}
              />
              <TextInput
                label="Email"
                keyboardType="email-address"
                style={styles.input}
              />
              <TextInput
                label="Message"
                multiline
                numberOfLines={4}
                style={styles.input}
              />
              <Button 
                mode="contained" 
                style={styles.button}
                onPress={() => console.log('Submit pressed')}
              >
                Submit
              </Button>
            </Card.Content>
          </Card>
        </ScrollView>
      </View>
    </PaperProvider>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    padding: 16,
  },
  card: {
    marginBottom: 16,
  },
  input: {
    marginBottom: 12,
  },
  button: {
    marginTop: 8,
  },
  themeToggle: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 8,
  }
});

export default SimpleUIExample;