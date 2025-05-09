import React from 'react';
import { View, StyleSheet } from 'react-native';
import { 
  Button, 
  Card, 
  Title, 
  Paragraph, 
  TextInput, 
  Appbar, 
  Avatar, 
  Chip,
  FAB,
  Snackbar
} from 'react-native-paper';

const PaperExample = () => {
  const [text, setText] = React.useState('');
  const [visible, setVisible] = React.useState(false);

  return (
    <View style={styles.container}>
      {/* Appbar */}
      <Appbar.Header>
        <Appbar.BackAction onPress={() => {}} />
        <Appbar.Content title="React Native Paper" />
        <Appbar.Action icon="magnify" onPress={() => {}} />
        <Appbar.Action icon="dots-vertical" onPress={() => {}} />
      </Appbar.Header>

      <View style={styles.content}>
        {/* Card */}
        <Card style={styles.card}>
          <Card.Cover source={{ uri: 'https://picsum.photos/700' }} />
          <Card.Content>
            <Title>Card Title</Title>
            <Paragraph>Card content with some description text that explains this card.</Paragraph>
          </Card.Content>
          <Card.Actions>
            <Button>Cancel</Button>
            <Button mode="contained">Ok</Button>
          </Card.Actions>
        </Card>

        {/* Text Input */}
        <TextInput
          label="Email"
          value={text}
          onChangeText={text => setText(text)}
          style={styles.input}
        />

        {/* Chips */}
        <View style={styles.chipContainer}>
          <Chip icon="information" onPress={() => {}} style={styles.chip}>Information</Chip>
          <Chip icon="check" onPress={() => {}} style={styles.chip}>Success</Chip>
          <Chip icon="alert" onPress={() => {}} style={styles.chip}>Warning</Chip>
        </View>

        {/* Avatar */}
        <View style={styles.avatarContainer}>
          <Avatar.Icon size={40} icon="folder" />
          <Avatar.Image size={40} source={{ uri: 'https://ui-avatars.com/api/?name=John+Doe' }} />
          <Avatar.Text size={40} label="JD" />
        </View>

        {/* Button */}
        <Button 
          mode="contained" 
          icon="email"
          onPress={() => setVisible(true)}
          style={styles.button}
        >
          Show Snackbar
        </Button>
      </View>

      {/* FAB */}
      <FAB
        style={styles.fab}
        icon="plus"
        onPress={() => {}}
      />

      {/* Snackbar */}
      <Snackbar
        visible={visible}
        onDismiss={() => setVisible(false)}
        action={{
          label: 'Undo',
          onPress: () => {},
        }}>
        This is a snackbar notification.
      </Snackbar>
    </View>
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
    marginBottom: 16,
  },
  button: {
    marginTop: 16,
  },
  chipContainer: {
    flexDirection: 'row',
    marginBottom: 16,
  },
  chip: {
    marginRight: 8,
  },
  avatarContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginVertical: 16,
  },
  fab: {
    position: 'absolute',
    margin: 16,
    right: 0,
    bottom: 0,
  },
});

export default PaperExample;