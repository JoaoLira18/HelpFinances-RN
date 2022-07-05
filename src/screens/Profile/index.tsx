import React from 'react';
import { View, TextInput, Text, Button } from 'react-native';

export function Profile() {
   return (
      <View>
         <Text testID='text_title' >Perfil</Text>

         <TextInput
            placeholder='Nome'
            autoCorrect={false}
            testID="input_name"
            value='Joao'
         />

         <TextInput
            placeholder='Sobrenome'
            autoCorrect={false}
            testID="input_sobrenome"
            value='Lira'
         />

         <Button title='Salvar' onPress={() => { }} />

      </View>
   );
}