import * as DocumentPicker from 'expo-document-picker';

export default function YourComponent() {
  const pickDocument = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: '*/*', // all files
        multiple: false // allow only single file selection
      });
      
      if (result.type === 'success') {
        // Handle the selected document
        console.log(result.uri);
        console.log(result.name);
      }
    } catch (err) {
      console.error('Error picking document:', err);
    }
  };

  return (
    // Your component JSX
  );
}
