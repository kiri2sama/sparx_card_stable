import React, { useState } from 'react';
import { View, ScrollView } from 'react-native';
import {
  ApplicationProvider,
  Layout,
  Text,
  Button,
  Card,
  Input,
  TopNavigation,
  TopNavigationAction,
  Icon,
  Avatar,
  Divider,
  Toggle,
  BottomNavigation,
  BottomNavigationTab,
  Tab,
  TabBar,
  List,
  ListItem,
  Spinner
} from '@ui-kitten/components';
import * as eva from '@eva-design/eva';
// Import UI Kitten icons
import { EvaIconsPack } from '@ui-kitten/eva-icons';

// Icons
const BackIcon = (props) => (
  <Icon {...props} name='arrow-back' />
);

const MenuIcon = (props) => (
  <Icon {...props} name='menu' />
);

const InfoIcon = (props) => (
  <Icon {...props} name='info' />
);

const LogoutIcon = (props) => (
  <Icon {...props} name='log-out' />
);

const HomeIcon = (props) => (
  <Icon {...props} name='home' />
);

const BellIcon = (props) => (
  <Icon {...props} name='bell' />
);

const EmailIcon = (props) => (
  <Icon {...props} name='email' />
);

const PersonIcon = (props) => (
  <Icon {...props} name='person' />
);

const UIKittenExample = () => {
  const [theme, setTheme] = useState('light');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [checked, setChecked] = useState(false);
  const [value, setValue] = useState('');

  const toggleTheme = () => {
    const nextTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(nextTheme);
  };

  const renderBackAction = () => (
    <TopNavigationAction icon={BackIcon} />
  );

  const renderMenuAction = () => (
    <TopNavigationAction icon={MenuIcon} />
  );

  const renderRightActions = () => (
    <>
      <TopNavigationAction icon={InfoIcon} />
      <TopNavigationAction icon={LogoutIcon} />
    </>
  );

  const data = new Array(4).fill({
    title: 'Item',
    description: 'Description for Item',
  });

  const renderItem = ({ item, index }: { item: any; index: number }) => (
    <ListItem
      title={`${item.title} ${index + 1}`}
      description={`${item.description} ${index + 1}`}
      accessoryLeft={PersonIcon}
      accessoryRight={(props) => <Button size='small'>FOLLOW</Button>}
    />
  );

  return (
    <ApplicationProvider {...eva} theme={theme === 'light' ? eva.light : eva.dark}>
      <Layout style={{ flex: 1 }}>
        <TopNavigation
          title='UI Kitten Example'
          subtitle='Subtitle'
          accessoryLeft={renderMenuAction}
          accessoryRight={renderRightActions}
        />
        <Divider />

        <ScrollView>
          <Layout style={{ padding: 16 }}>
            {/* Theme Toggle */}
            <Card style={{ marginBottom: 16 }}>
              <Text category='h6'>Theme</Text>
              <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 8 }}>
                <Text>Use Dark Theme:</Text>
                <Toggle
                  checked={theme === 'dark'}
                  onChange={toggleTheme}
                />
              </View>
            </Card>

            {/* Card Example */}
            <Card style={{ marginBottom: 16 }}>
              <Text category='h6'>Card with Image</Text>
              <Text category='p1' style={{ marginTop: 8 }}>
                Cards contain content and actions about a single subject.
              </Text>
              <View style={{ height: 200, backgroundColor: '#ccc', marginVertical: 16, justifyContent: 'center', alignItems: 'center' }}>
                <Text>Image Placeholder</Text>
              </View>
              <View style={{ flexDirection: 'row', justifyContent: 'flex-end' }}>
                <Button style={{ marginHorizontal: 4 }} appearance='outline'>
                  CANCEL
                </Button>
                <Button style={{ marginHorizontal: 4 }}>
                  ACCEPT
                </Button>
              </View>
            </Card>

            {/* Input Example */}
            <Card style={{ marginBottom: 16 }}>
              <Text category='h6'>Input</Text>
              <Input
                placeholder='Place your text'
                value={value}
                onChangeText={nextValue => setValue(nextValue)}
                style={{ marginTop: 8 }}
              />
              <Input
                placeholder='Password'
                secureTextEntry={true}
                style={{ marginTop: 8 }}
              />
            </Card>

            {/* Avatar Example */}
            <Card style={{ marginBottom: 16 }}>
              <Text category='h6'>Avatars</Text>
              <View style={{ flexDirection: 'row', justifyContent: 'space-around', marginTop: 16 }}>
                <Avatar source={{ uri: 'https://ui-avatars.com/api/?name=John+Doe' }} />
                <Avatar source={{ uri: 'https://ui-avatars.com/api/?name=Jane+Smith' }} />
                <Avatar style={{ backgroundColor: 'orange' }}>JD</Avatar>
                <Avatar style={{ backgroundColor: 'purple' }} icon={PersonIcon} />
              </View>
            </Card>

            {/* Tab Example */}
            <Card style={{ marginBottom: 16 }}>
              <Text category='h6'>Tabs</Text>
              <TabBar
                selectedIndex={selectedIndex}
                onSelect={index => setSelectedIndex(index)}
                style={{ marginTop: 16 }}
              >
                <Tab title='USERS' icon={PersonIcon} />
                <Tab title='ORDERS' icon={EmailIcon} />
                <Tab title='TRANSACTIONS' icon={BellIcon} />
              </TabBar>
            </Card>

            {/* List Example */}
            <Card style={{ marginBottom: 16 }}>
              <Text category='h6'>List</Text>
              <List
                data={data}
                renderItem={renderItem}
                style={{ marginTop: 16 }}
              />
            </Card>

            {/* Loading Indicators */}
            <Card style={{ marginBottom: 16 }}>
              <Text category='h6'>Spinners</Text>
              <View style={{ flexDirection: 'row', justifyContent: 'space-around', marginTop: 16 }}>
                <Spinner size='small' />
                <Spinner size='medium' />
                <Spinner size='large' />
              </View>
            </Card>
          </Layout>
        </ScrollView>

        <BottomNavigation
          selectedIndex={selectedIndex}
          onSelect={index => setSelectedIndex(index)}
        >
          <BottomNavigationTab title='HOME' icon={HomeIcon} />
          <BottomNavigationTab title='NOTIFICATIONS' icon={BellIcon} />
          <BottomNavigationTab title='MESSAGES' icon={EmailIcon} />
          <BottomNavigationTab title='PROFILE' icon={PersonIcon} />
        </BottomNavigation>
      </Layout>
    </ApplicationProvider>
  );
};

export default UIKittenExample;