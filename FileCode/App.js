import React, { useState, useEffect } from 'react';
import {
  Text,
  SafeAreaView,
  StyleSheet,
  View,
  Image,
  TouchableOpacity,
  FlatList,
  Button,
  TextInput,
} from 'react-native';
import { fetchBikes } from './components/BikeSlice';
import { useSelector, useDispatch } from 'react-redux';
import { store } from './components/Store';
import { Provider } from 'react-redux';
import axios from 'axios';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
const AddProductScreen = ({ navigation }) => {
  const [name, setName] = useState('');
  const [price, setPrice] = useState('');
  const [urlImg, setUrlImg] = useState(''); 
  const [type, setType] = useState('');
  const [discount, setDiscount] = useState('');
  const [description, setDescription] = useState('');
  const dispatch = useDispatch();

  const handleAddProduct = () => {
    const newProduct = {
      name,
      price: parseFloat(price),
      image: urlImg,
      type,
    };

    dispatch(addProduct(newProduct))
      .unwrap()
      .then(() => {
        Alert.alert('Success', 'Product added successfully!');
        navigation.goBack();
      })
      .catch((error) => {
        Alert.alert('Error', 'There was an error adding the product.');
        console.error('Error adding product:', error);
      });
  };
  return (
    <View style={styles.container}>
      <Text style={styles.header}>Add New Bike</Text>
      <TextInput
        style={styles.input}
        placeholder="Name"
        value={name}
        onChangeText={setName}
      />
      <TextInput
        style={styles.input}
        placeholder="Price"
        value={price}
        onChangeText={setPrice}
        keyboardType="numeric"
      />
      <TextInput
        style={styles.input}
        placeholder="Image URL"
        value={urlImg}
        onChangeText={setUrlImg}
      />
      
      <Button title="Add Product" onPress={handleAddProduct} />
    </View>
  );
};
const HomeScreen = ({ navigation }) => {
  return (
    <SafeAreaView style={styles.container}>
      <View style={{ flex: 1, justifyContent: 'center' }}>
        <Text style={styles.textHeader}>
          A premium online store for sporter and their stylish choice
        </Text>
      </View>
      <View style={styles.anh}>
        <Image source={require('./assets/imgs/bifour_-removebg-preview.png')} />
      </View>
      <View style={styles.power}>
        <Text style={styles.textHeader}>POWER BIKE SHOP</Text>
      </View>
      <View style={styles.power}>
        <TouchableOpacity
          style={styles.btn}
          onPress={() => navigation.navigate('Screen2')}>
          <Text style={{ color: 'while' }}>Get started</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};
const Stack = createNativeStackNavigator();

const App = () => {
  return (
    <Provider store={store}>
      <NavigationContainer>
        <Stack.Navigator
          initialRouteName="Screen2"
          screenOptions={{ headerShown: false }}>
          <Stack.Screen name="HomeScreen" component={HomeScreen} />
          <Stack.Screen name="Screen2" component={Screen2} />
          <Stack.Screen name="Screen3" component={Screen3} />
          <Stack.Screen name="AddProductScreen" component={AddProductScreen} />
        </Stack.Navigator>
      </NavigationContainer>
    </Provider>
  );
};

const Screen2 = ({ navigation }) => {
  const dispatch = useDispatch();
  const bikes = useSelector((state) => state.bikes.items);
  const status = useSelector((state) => state.bikes.status);

  useEffect(() => {
    if (status === 'idle') {
      dispatch(fetchBikes());
    }
  }, [status, dispatch]);

  const render = ({ item }) => {
    return (
      <TouchableOpacity
        style={{
          flex: 1,
          backgroundColor: '#F7BA8326',
          alignItems: 'center',
          justifyContent: 'center',
          borderRadius: 20,
          margin: 5,
          padding: 5,
        }}
        onPress={() =>
          navigation.navigate('Screen3', {
            image: item.image,
            name: item.name,
            price: item.price,
          })
        }>
        <Image
          source={{ uri: item.img }}
          style={{ width: 100, height: 100 }}
        />
        <Text>{item.name}</Text>
        <Text>${item.price}</Text>
      </TouchableOpacity>
    );
  };

  return (
    <View style={{ flex: 1 }}>
      <View style={{ flex: 1, justifyContent: 'center' }}>
        <Text style={{ fontSize: 25, fontWeight: 'bold' }}>
          The world’s Best Bike
        </Text>
      </View>
      <View style={{ flex: 5 }}>
        <FlatList
          data={bikes}
          renderItem={render}
          keyExtractor={(item) => item.id.toString()}
          numColumns={2}
        />
      </View>
      <View style={{ flex: 1 }}>
        <TouchableOpacity
          style={{
            justifyContent: 'center',
            alignItems: 'center',
            marginTop: 20,
          }}
          onPress={() => navigation.navigate('AddProductScreen')}>
          <Image source={require('./assets/add.png')} />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const Screen3 = ({ route, navigation }) => {
  const [gia, setGia] = useState('');

  useEffect(() => {
    const finalPrice = (route.params.price * 15) / 100;
    setGia(finalPrice);
  }, [route.params.price]);

  return (
    <View style={{ flex: 1 }}>
      <View
        style={{
          flex: 5,
          backgroundColor: '#E941411A',
          justifyContent: 'center',
          alignItems: 'center',
          margin: 5,
          borderRadius: 10,
        }}>
        <Image
          style={{ height: 230, width: 250 }}
          source={route.params.image}
        />
      </View>
      <View style={{ flex: 2 }}>
        <Text style={styles.textPina}>{route.params.name}</Text>
        <Text style={styles.textPina2}>
          {route.params.dis} {route.params.price}$ {gia}$
        </Text>
      </View>
      <View style={{ flex: 2 }}>
        <Text style={styles.textPina}>Description</Text>
        <Text style={styles.textPina2}>{route.params.des}</Text>
      </View>
      <View style={{ flex: 1, alignItems: 'flex-end' }}>
        <TouchableOpacity
          style={styles.btn}
          onPress={() => navigation.navigate('Screen2')}>
          <Text style={{ color: 'while' }}>Add to card</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: '#ecf0f1',
  },
  textHeader: {
    fontFamily: 'VT323',
    fontSize: 26,
    fontWeight: 400,
    lineHeight: 26,
    textAlign: 'center',
  },
  anh: {
    flex: 3,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#E941411A',
    borderRadius: 40,
  },
  power: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  btn: {
    height: 40,
    width: 250,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 20,
    backgroundColor: '#E94141',
  },
  textPina: {
    fontFamily: 'Voltaire',
    fontSize: 35,
  },
  header: { fontSize: 24, fontWeight: 'bold', marginBottom: 20 },
  input: {
    borderColor: '#ccc',
    borderWidth: 1,
    padding: 10,
    marginBottom: 15,
    borderRadius: 5,
  },
});

export default App;
