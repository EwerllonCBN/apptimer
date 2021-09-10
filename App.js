import { StatusBar } from 'expo-status-bar';
import React, { useState } from 'react';
import { StyleSheet, Text, View, Picker, TouchableOpacity,TouchableHighlight, Modal} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient'; //Estilização do backgroundColor
import Contador from './Contador';
import { Audio } from 'expo-av';

export default function App(props) {
  const [estado, setarEstado] = useState('selecionar');

  var [modal, setModal] = useState(false);

  //Definição dos estados de segundos
  const [segundos, setarSegundos] = useState(1);

  //Definição dos estados de minutos
  const [minutos, setarMinutos] = useState(0);

  const [audioIndex, setAudioIndex] = useState(0)

  const [alarme, setAlarme] = useState();

  const [selecionado, setSelecionado] = useState(false)

  //Definição do sistema de alarmes e seus ids
  const [alarmSound, setarAlarmSound] = useState([
    {
      id: 1,
      selecionado: true,
      som: 'Alarme 1',
      file: require('./assets/Alarme1.mp3'),
    },
    {
      id: 2,
      selecionado: false,
      som: 'Alarme 2',
      file: require('./assets/Alarme2.mp3'),
    },
    {
      id: 3,
      selecionado: false,
      som: 'Alarme 3',
      file: require('./assets/Alarme3.mp3'),
    },
  ]);

  //Percorrendo a variavel numeros em um vetor pra definir os minutos
  var numeros = [];
  for (var i = 0; i <= 60; i++) {
    numeros.push(i); //O push acrescenta novos elementos ao final de uma matriz e retorna o novo comprimento da dela.
  }

  //Função para mudar a musica de forma assincrona
  const stopAlarme = async () => {
  
    const objetoAlarme = new Audio.Sound();

    try {
      var alarme;
      alarmSound.filter((val) => {
        if(val.selecionado == true){
                   Audio.setIsEnabledAsync(false)
        } else if (val.selecionado == false){
          Audio.setIsEnabledAsync(true)

        }
      });
      await objetoAlarme.unloadAsync();
      await objetoAlarme.loadAsync(alarme);
      
    } catch (error) {}

    setModal(!modal)
    setarEstado('selecionar');


  };

  //Função para alterar o botão selecionado criando um clone do vetor alarmSound
  function setarAlarme(id) {
    //Definindo o nome da variável local dentro da função como alarme temporario onde irá chamar o vetor alarmSound
    //Para ser manipulado com o .map e passando um valor como parametro
    //Assim criamos um clone do vetor que ja tinhamos e agora podemos manipular, definindo o qual botao queremos como true e false.
    //Basta sabermos o seu id dentro do vetor.
    let alarmsTime = alarmSound.map(function (val) {
      //Definindo as id de todos os alarmes dentro do vetor alarmSound, agora conseguimos manipula-lo de forma dinâmica.
      //Uma vez que passamos a id como parametro em 'function setarAlarme(id)', e definimos todos os selecionados como false
      //Podemos agora escolher quem nós queremos torna-los verdadeiros com uma condição relacional. vejamos.

      //Se o meu id for diferente do meu valor id, o selecionado continuará sendo falso.
      if (id != val.id) {
        val.selecionado = false; //Nessa condição o botão permanecerá sem evento algum
      } // Porém, caso o valor selecionado for o que eu quero
      else val.selecionado = true; //O valor do botão selecionado sera verdadeiro e a estilização será aplicada
      return val;
    });
    //Agora basta chamar o nosso hook que é setarAlarmSound com nossa
    setarAlarmSound(alarmsTime);

  }
  //Criando as condições de estados selecionados
  if (estado == 'selecionar') {
    console.disableYellowBox = true;
    return (
      <View style={styles.container}>
        <StatusBar hidden/>
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
        
        <Modal
        animationType="slide"
        transparent={true}
        visible={modal}
        onRequestClose={() => {
          Alert.alert('Modal has been closed.');
        }}
      >
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <View style={{ bottom: 5, padding: 5 }}>
              <Text style={{ fontSize: 18 }}>Parar Alarme?</Text>
            </View>
            <View style={{ flexDirection: 'row' }}>
              <TouchableHighlight
                style={{
                  ...styles.openButton,
                  backgroundColor: '#2196F3',
                  marginRight: 15,
                }}
                onPress={() => stopAlarme()}
              >
                <Text
                  style={{
                    ...styles.textStyle,
                  }}
                >
                  Sim
                </Text>
              </TouchableHighlight>

              <TouchableHighlight
                style={{
                  ...styles.openButton,
                  backgroundColor: '#2196F3',
                }}
                onPress={() => setModal(!modal)}
              >
                <Text style={styles.textStyle}>Não</Text>
              </TouchableHighlight>
            </View>
          </View>
        </View>
      </Modal>
        <Text style={{ color: 'white', fontSize: 30 }}>
          Selecione o seu tempo
        </Text>
        <View style={{ flexDirection: 'row' }}>
          <Text style={styles.textMin}>Min. </Text>
          <Picker
            selectedValue={minutos}
            onValueChange={(itemValue, valueIndex) => setarMinutos(itemValue)}
            style={{ height: 100, width: 80 }}
          >
            {
              //Mapeando o numeros com o looping e passando o val como parametro
              numeros.map(function (val) {
                //Retornando o
                return (
                  <Picker.Item label={val.toString()} value={val.toString()} />
                );
              })
            }
          </Picker>
          <Text style={styles.textSeg}>Seg. </Text>
          <Picker
            selectedValue={segundos}
            onValueChange={(itemValue, valueIndex) => setarSegundos(itemValue)}
            style={{
              height: 200,
              width: 80,
              color: 'white',
            }}
          >
            {numeros.map(function (val) {
              return (
                <Picker.Item label={val.toString()} value={val.toString()} />
              );
            })}
          </Picker>
        </View>
        <View style={{ flexDirection: 'row' }}>
          {
            //Criando de forma dinâmica as opções de alarme utilizando a função .map
            alarmSound.map(function (val) {
              //Crisando uma validação para saber qual dos botões estão selecionados
              //Se o valor selecionado for o um botão, o estilo dele muda.
              if (val.selecionado) {
                return (
                  <TouchableOpacity
                    onPress={() => setarAlarme(val.id)}
                    style={styles.btnSelecionado}
                  >
                    <Text style={{ color: 'white', fontSize: 16 }}>
                      {val.som}
                    </Text>
                  </TouchableOpacity>
                );
              } //Se não for o botão selecionado, o estilo continua o padão.
              //Uma função para validação do botão selecionado foi feito com o nome setarAlarme() ao ser pressionado.
              else {
                return (
                  <TouchableOpacity
                    onPress={() => setarAlarme(val.id)}
                    style={styles.btnEscolha}
                  >
                    <Text style={{ color: 'white', fontSize: 16 }}>
                      {val.som}
                    </Text>
                  </TouchableOpacity>
                );
              }
            })
          }
        </View>
        <TouchableOpacity
          onPress={() => setarEstado('iniciar')}
          style={styles.btnIniciar}
        >
          <Text
            style={{
              textAlign: 'center',
              paddingTop: 40,
              color: 'white',
              fontSize: 25,
            }}
          >
            Iniciar
          </Text>
        </TouchableOpacity>
      </View>
    );
  } else if (estado == 'iniciar') {
    return (
      <Contador
        alarme = {alarme}
        setAlarme = {setAlarme}
        modal= {modal}
        setModal = {setModal}
        alarmes={alarmSound}
        setarMinutos={setarMinutos}
        setarSegundos={setarSegundos}
        setarEstado={setarEstado}
        estado = {estado}
        minutos={minutos}
        segundos={segundos}
      >
  
      </Contador>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#3014e3',
    alignItems: 'center',
    justifyContent: 'center',
  },
  textMin: {
    paddingTop: 45,
    fontSize: 20,
    color: 'white',
    top: 50,
    left: 0,
  },
  textSeg: {
    paddingTop: 45,
    fontSize: 20,
    color: 'white',
    top: 50,
  },
  btnEscolha: {
    padding: 15,
    paddingBottom: 8,
    paddingTop: 8,
    top: 20,
    backgroundColor: 'rgba(41, 114, 217, 0.5)',
    borderRadius: 5,
    marginRight: 10,
  },
  btnSelecionado: {
    padding: 16,
    paddingBottom: 8,
    paddingTop: 8,
    top: 20,
    backgroundColor: 'rgba(116, 167, 191, 0.3)',
    borderRadius: 5,
    borderColor: 'white',
    borderWidth: 1,
    marginRight: 10,
  },
  btnIniciar: {
    backgroundColor: 'rgb(116, 67, 191)',
    height: 120,
    marginTop: 60,
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
