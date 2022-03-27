import React, {useEffect, useState} from 'react';
import { StyleSheet, Text, View, TextInput, TouchableOpacity, ActivityIndicator, Keyboard } from 'react-native';
import { StatusBar } from 'expo-status-bar';

import Picker from './src/components/Picker';
import api from './src/services/api';


export default function App() {
  const [moedas, setMoedas] = useState([]);
  const [loading, setLoading] = useState(true);
  
  const [moedaSelecionada, setMoedaSelecionada] = useState(null);
  const [moedaBValor, setMoedaBValor] = useState(0); // Valor Digitado

  const [valorMoeda, setValorMoeda] = useState(null);
  const [valorConvertido, setValorConvertido] = useState(0);

  useEffect(() => {
    async function loadMoedas(){
      const response = await api.get('/all');
   
      // Montar objeto de Array para usar no Picker
      let arrayMoedas = [];

      Object.keys(response.data).map((myKey) => {
        arrayMoedas.push({
          key: myKey,
          label: myKey,
          value: myKey
        })
      })
     setMoedas(arrayMoedas);
     setLoading(false);
    }

    loadMoedas();
  }, []);

  async function converter(){
    if(moedaSelecionada == null || moedaBValor === 0){
      alert('Por favor selecione uma moeda ou valor valido.');
      return;
    }

    // Devolve quanto é 1 dolar convertido em reais
    const response = await api.get(`all/${moedaSelecionada}-BRL`);
  
    let result = (response.data[moedaSelecionada].ask * parseFloat(moedaBValor));
    setValorConvertido(`R$ ${result.toFixed(2)}`);
    setValorMoeda(moedaBValor); 

    // Fechar o teclado
    Keyboard.dismiss();
  }

  // Renderização condicional...
  if(loading){
    return(
      <View style = {{justifyContent: 'center', alignItems: 'center', flex: 1}}>
        <ActivityIndicator color = "#FFF" size = {45}/>
      </View>
    )
  }else{
    return (
      <View style={styles.container}>
        <StatusBar style='light' translucent = {false}/>

        <View style = {styles.areaMoeda}>
          <Text style = {styles.titulo}>Selecione sua Moeda</Text>
          <Picker moedas = {moedas} onChange = {(moeda) => {setMoedaSelecionada(moeda); setValorConvertido(0) }} />
        </View>
  
        <View style = {styles.areaValor}>
          <Text style = {styles.titulo}>Digite um Valor para Converter em R$:</Text>
          <TextInput 
            placeholder='EX: 180'
            style = {styles.input}
            keyboardType = 'numeric'
            onChangeText={ (valor) => setMoedaBValor(valor) }
          />
        </View>
  
        <TouchableOpacity style = {styles.botaoArea} onPress = {converter}>
          <Text style = {styles.botaoTexto}>Converter</Text>
        </TouchableOpacity>
 
        {valorConvertido !== 0 && (
          // Renderização condiconal...
          <View style = {styles.areaResultado}>
            <Text style = {styles.valorConvertido}>
              {valorMoeda} {moedaSelecionada}
            </Text>
            <Text style = {{ fontSize: 18, margin: 10, color: '#000' }}>Corresponde a:</Text> 
            <Text style = {styles.valorConvertido}>{valorConvertido}</Text>
          </View>
        )}
  
        
  
      </View>
    );
  }  
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#101215',
    alignItems: 'center',
  
    paddingTop: 40
  },
  areaMoeda:{
    width: '90%',
    backgroundColor: '#F9F9F9',
    paddingTop: 9,
    borderTopLeftRadius: 9,
    borderTopRightRadius: 9,
    marginBottom: 1
  },
  titulo:{
    fontSize: 15,
    color: '#000',
    paddingTop: 5,
    paddingLeft: 5 
  },
  areaValor:{
    width: '90%',
    backgroundColor: '#F9F9F9',
    paddingBottom: 9,
    paddingTop: 9
  },
  input:{
    width: '100%',
    padding: 45,
    fontSize: 20,
    marginTop: 8,
    color: '#000'
  },
  botaoArea:{
    width: '90%',
    backgroundColor: '#FB4b57',
    height: 45,
    borderBottomLeftRadius: 9,
    borderBottomRightRadius: 9,
    justifyContent:  'center',
    alignItems: 'center'
  },
  botaoTexto:{
    fontSize: 17,
    color: '#FFF',
    fontWeight: 'bold'
  },
  areaResultado:{
    width: '90%',
    backgroundColor: '#FFF',
    marginTop: 35,
    alignContent: 'center',
    alignItems: 'center',
    padding: 25
  },
  valorConvertido:{
    fontSize: 39,
    fontWeight: 'bold',
    color: '#000'
  }
});
