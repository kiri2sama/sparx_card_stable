import React from 'react';
import {
  NativeBaseProvider,
  Box,
  Text,
  Heading,
  VStack,
  FormControl,
  Input,
  Button,
  HStack,
  Center,
  Avatar,
  Badge,
  IconButton,
  Icon,
  Divider,
  Fab,
  ScrollView,
  Card,
  Image,
  Stack,
  Pressable,
  useToast
} from 'native-base';
// Import MaterialIcons from react-native-vector-icons instead of Expo
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';

const NativeBaseExample = () => {
  const toast = useToast();

  return (
    <NativeBaseProvider>
      {/* Add a theme config to avoid initialization errors */}
      <Box safeArea flex={1} p={2} w="100%" mx="auto">
        {/* Header */}
        <HStack bg="primary.600" px={4} py={3} justifyContent="space-between" alignItems="center">
          <HStack space={4} alignItems="center">
            <IconButton 
              icon={<Icon as={<MaterialIcons name="menu" />} size="sm" color="white" />} 
            />
            <Text color="white" fontSize="20" fontWeight="bold">NativeBase</Text>
          </HStack>
          <HStack space={2}>
            <IconButton 
              icon={<Icon as={<MaterialIcons name="favorite" />} size="sm" color="white" />} 
            />
            <IconButton 
              icon={<Icon as={<MaterialIcons name="search" />} size="sm" color="white" />} 
            />
            <IconButton 
              icon={<Icon as={<MaterialIcons name="more-vert" />} size="sm" color="white" />} 
            />
          </HStack>
        </HStack>

        <ScrollView showsVerticalScrollIndicator={false}>
          {/* Card */}
          <Box mt={4}>
            <Card>
              <Image
                source={{
                  uri: "https://picsum.photos/700"
                }}
                alt="Card Image"
                height={200}
                width="100%"
              />
              <Stack space={4} p={4}>
                <Heading size="md">Card Title</Heading>
                <Text>
                  This is a simple card component built with NativeBase, with an image, title, and description.
                </Text>
                <HStack space={2} mt={2}>
                  <Button size="sm" variant="subtle">Cancel</Button>
                  <Button size="sm">Submit</Button>
                </HStack>
              </Stack>
            </Card>
          </Box>

          {/* Form */}
          <Box mt={4}>
            <VStack space={3}>
              <FormControl>
                <FormControl.Label>Email</FormControl.Label>
                <Input p={2} placeholder="john@example.com" />
              </FormControl>
              <FormControl>
                <FormControl.Label>Password</FormControl.Label>
                <Input p={2} type="password" placeholder="********" />
              </FormControl>
              <Button
                mt={2}
                colorScheme="primary"
                onPress={() => 
                  toast.show({
                    description: "Form submitted successfully!",
                    placement: "top"
                  })
                }
              >
                Sign in
              </Button>
            </VStack>
          </Box>

          {/* Avatars */}
          <Box mt={4}>
            <Heading size="md" mb={4}>Avatars</Heading>
            <HStack space={2} justifyContent="center">
              <Avatar 
                bg="green.500" 
                source={{
                  uri: "https://ui-avatars.com/api/?name=John+Doe"
                }}
              >
                JD
                <Avatar.Badge bg="red.500" />
              </Avatar>
              <Avatar bg="amber.500">
                <Icon as={<MaterialIcons name="person" />} color="white" size="sm" />
              </Avatar>
              <Avatar bg="lightBlue.400">
                TS
              </Avatar>
            </HStack>
          </Box>

          {/* Badges */}
          <Box mt={4}>
            <Heading size="md" mb={4}>Badges</Heading>
            <HStack space={2} justifyContent="center">
              <Badge colorScheme="success" variant="solid">
                SUCCESS
              </Badge>
              <Badge colorScheme="error" variant="outline">
                ERROR
              </Badge>
              <Badge colorScheme="info" variant="subtle">
                INFO
              </Badge>
            </HStack>
          </Box>

          <Divider my={4} />

          {/* Pressable Cards */}
          <VStack space={3} mb={4}>
            {["Primary", "Secondary", "Success"].map((item) => (
              <Pressable key={item} onPress={() => console.log(item)}>
                {({isPressed}) => {
                  return (
                    <Box
                      bg={isPressed ? "coolGray.200" : "coolGray.100"}
                      p={5}
                      rounded="8"
                      style={{
                        transform: [{
                          scale: isPressed ? 0.96 : 1
                        }]
                      }}
                    >
                      <HStack alignItems="center">
                        <Badge colorScheme="darkBlue" _text={{color: "white"}} variant="solid" rounded="4">
                          {item}
                        </Badge>
                        <Text fontSize={14} color="coolGray.800" ml={2}>
                          {item} Card Item
                        </Text>
                      </HStack>
                    </Box>
                  )
                }}
              </Pressable>
            ))}
          </VStack>
        </ScrollView>

        {/* Floating Action Button */}
        <Fab
          position="absolute"
          size="sm"
          icon={<Icon color="white" as={<MaterialIcons name="add" />} size="sm" />}
          bottom={4}
          right={4}
          onPress={() => console.log('Pressed')}
        />
      </Box>
    </NativeBaseProvider>
  );
};

export default NativeBaseExample;