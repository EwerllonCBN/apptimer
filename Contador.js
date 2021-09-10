import { StatusBar } from 'expo-status-bar';
import React, { useEffect, useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  Picker,
  TouchableOpacity,
  TouchableHighlight,
  Modal,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient'; //Estilização do backgroundColor
import { Audio } from 'expo-av';

export default function Contador(props) {

  var done = false;

  useEffect(() => {
    const timer = setInterval(() => {
      props.setarSegundos(props.segundos - 1);

      if (props.segundos <= 0) {
        if (props.minutos > 0) {
          props.setarMinutos(minutos - 1);
          props.setarSegundos(59);
        } else {
          if (!done) {
            done = true;
            props.setarEstado('selecionar');
            props.setarMinutos(0);
            props.setarSegundos(0);
            playAlarme();
            props.setModal(!props.modal);
          }
        }
      }
    }, 1000);
    return () => clearInterval(timer);
  });


  async function playAlarme(val) {
    const objetoAlarme = new Audio.Sound();

    try {
      var alarme; 
      props.alarmes.map(function (val) {
        if (val.selecionado) {
          alarme = val.file;
        }
      });
      await objetoAlarme.loadAsync(alarme);
      await objetoAlarme.playAsync();
      //
    } catch (error) {}

  }


 async function resetar() {

    props.setarEstado('selecionar');
    props.setarMinutos(0);
    props.setarSegundos(0);
  }

  function formatarNumero(number) {
    var finalNumber = '';
    if (number < 10) {
      finalNumber = '0' + number;
    } else {
      finalNumber = number;
    }
    return finalNumber;
  }

  var segundos = formatarNumero(props.segundos);
  var minutos = formatarNumero(props.minutos);

  return (
    <View style={styles.container}>
      <StatusBar hidden />
      <LinearGradient
        colors={['rgba(59,29,105,1)', 'rgba(59 ,29,105,0.5)']}
        style={{
          position: 'absolute',
          left: 0,
          right: 0,
          top: 0,
          height: '100%',
        }}
      />
      <View style={{ flexDirection: 'row' }}>
        <Text style={styles.textContador}>{minutos} : </Text>
        <Text style={styles.textContador}>{segundos}</Text>
      </View>
      <TouchableOpacity onPress={() => resetar('iniciar')} style={styles.btnResetar}>
        <Text
          style={{
            textAlign: 'center',
            paddingTop: 40,
            color: 'white',
            fontSize: 25,
          }}
        >
          Resetar
        </Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#3014e3',
    alignItems: 'center',
    justifyContent: 'center',
  },
  textContador: {
    color: 'white',
    fontSize: 70,
  },
  btnResetar: {
    backgroundColor: 'rgb(116, 67, 191)',
    height: 120,
    marginTop: 30,
    width: 120,
    borderRadius: 70,
    borderColor: 'white',
    borderWidth: 2,
  },
  //Estilos da Modal

  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalView: {
    margin: 20,
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 35,
    alignItems: 'center',
    shadowColor: '#000',

    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    zIndex: 5,
  },
  openButton: {
    backgroundColor: '#F194FF',
    borderRadius: 10,
    padding: 25,
    elevation: 2,
    top: 15,
    alignItems: 'center',
    paddingBottom: 15,
    paddingTop: 15,
  },
  textStyle: {
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  modalText: {
    textAlign: 'center',
  },
});
