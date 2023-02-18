import * as sc from './ItemScreen.sc';
import React, {useContext, useState} from 'react';
import {ListItem} from '../../components/ListItem/ListItem';
import {UserCard} from '../../components/UserCard/UserCard';
import {MainButton} from '../../components/MainButton/MainButton';
import firestore from '@react-native-firebase/firestore';
import {ActivityIndicator, Alert} from 'react-native';
import {AuthenticationContext} from '../../services/authentication/authentication.context';
import storage from '@react-native-firebase/storage';

export const ItemScreen = ({navigation, route}) => {
  const authContext = useContext(AuthenticationContext);
  const currUserId = authContext.user ? authContext.user.uid : null;

  const [deleting, setDeleting] = useState(false);

  const handleDelete = (itemID: string) => {
    Alert.alert(
      'Are you sure to delete this item?',
      '',
      [
        {
          text: 'Cancel',
          onPress: () => console.log('Cancel Pressed!'),
          style: 'cancel',
        },
        {
          text: 'Delete',
          onPress: () => deletePost(itemID),
          style: 'destructive',
        },
      ],
      {cancelable: false},
    );
  };

  const deletePost = (itemID: string) => {
    setDeleting(true);
    firestore()
      .collection('Items')
      .doc(itemID)
      .get()
      .then(documentSnapshot => {
        if (documentSnapshot.exists) {
          const {image} = documentSnapshot.data();

          if (image != null) {
            const storageRef = storage().refFromURL(image);
            const imageRef = storage().ref(storageRef.fullPath);

            imageRef
              .delete()
              .then(() => {
                deleteFirestoreData(itemID);
              })
              .catch(e => {
                console.log('Error while deleting the image. ', e);
              });
            // If the item image is not available
          } else {
            deleteFirestoreData(itemID);
          }
        }
      });
  };

  const deleteFirestoreData = (itemID: string) => {
    firestore()
      .collection('Items')
      .doc(itemID)
      .delete()
      .then(() => {
        setDeleting(false);
        Alert.alert('Item successfully deleted!', '');
        setTimeout(() => {
          navigation.navigate('MyItemsScreen');
        }, 500);
      })
      .catch(e => console.log('Error deleting item data.', e));
  };

  //console.log('route.params.data');
  // console.log(route.params.data);
  // console.log('route.params.data.itemID');
  // console.log(route.params.data.itemID);

  return (
    <sc.ItemScreen>
      <UserCard></UserCard>
      <ListItem item={route.params.data} />
      {deleting ? (
        <sc.ButtonContainer>
          <ActivityIndicator size="large" color="#000000" />
        </sc.ButtonContainer>
      ) : (
        <sc.ButtonContainer>
          {route.params.data.userID == currUserId ? (
            <MainButton
              onPress={() => handleDelete(route.params.data.itemID)}
              title={'Delete Item'}
            />
          ) : (
            <MainButton
              onPress={() => navigation.navigate('ListScreen')}
              title={'Request Pick-Up'}
            />
          )}
        </sc.ButtonContainer>
      )}
    </sc.ItemScreen>
  );
};
