import { StatusBar } from 'expo-status-bar';
import React, {useState} from 'react';
import { StyleSheet, Text, View, Switch, Dimensions, Image,  ScrollView,
        TouchableOpacity, Button, TextInput } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {LineChart, PieChart} from "react-native-chart-kit";
import poster1 from './assets/Poster_01.jpg';
import poster2 from './assets/Poster_02.jpg';
import poster3 from './assets/Poster_03.jpg';
import poster5 from './assets/Poster_05.jpg';
import poster6 from './assets/Poster_06.jpg';
import poster7 from './assets/Poster_07.jpg';
import poster8 from './assets/Poster_08.jpg';
import poster10 from './assets/Poster_10.jpg';
import moviesList from './assets/MoviesList.json';
import { SearchBar } from 'react-native-elements';

const posters = {
  poster1: poster1,
  poster2: poster2,
  poster3: poster3,
  poster5: poster5,
  poster6: poster6,
  poster7: poster7,
  poster8: poster8,
  poster10: poster10,
}

function General() {
  return (
    <View style={styles.container}>
      <Image source={posters['poster1']}/>
      <Text>Юлія Тарасенко</Text>
      <Text>Група ІО-82</Text>
      <Text>3К ІО-8222</Text>
    </View>
  );
}

function SecondPage() {
  const [isEnabled, setIsEnabled] = useState(false);
  const toggleSwitch = () => setIsEnabled(previousState => !previousState);

  let fnX = [0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8, 0.9, 1,
            1.1, 1.2, 1.3, 1.4, 1.5, 1.6, 1.7, 1.8, 1.9, 2,
            2.1, 2.2, 2.3, 2.4, 2.5, 2.6, 2.7, 2.8, 2.9, 3,
            3.1, 3.2, 3.3, 3.4, 3.5, 3.6, 3.7, 3.8, 3.9, 4];
  let fnY = fnX.map(x => Math.log(x));
  
  const data = [
    {
      percent: 10,
      color: "yellow"
    }, 
    {
      percent: 20,
      color: "green"
    },
    {
      percent: 25,
      color: "blue"
    },
    {
      percent: 5,
      color: "red"
    },
    {
      percent: 40,
      color: "turquoise"
    }
  ];
  const chartConfig = {
    backgroundGradientFrom: "#1E2923",
    backgroundGradientFromOpacity: 0,
    backgroundGradientTo: "#08130D",
    backgroundGradientToOpacity: 0.5,
    color: (opacity = 1) => `rgba(26, 255, 146, ${opacity})`,
    strokeWidth: 2,
    barPercentage: 0.5,
    useShadowColorFromDataset: false
  };
  let main = <PieChart
              data={data}
              width={Dimensions.get("window").width}
              height={250}
              chartConfig={chartConfig}
              accessor={"percent"}
              backgroundColor={"transparent"}
              paddingLeft={"15"}
              center={[0, 0]}
              absolute
            />;

  if (isEnabled) {
    main = <LineChart data={{
      datasets: [
        {
          data: fnY
        }
      ]
    }}
    width={Dimensions.get("window").width}
    height={220}
    chartConfig={{
      backgroundColor: "#e26a00",
      backgroundGradientFrom: "#fb8c00",
      backgroundGradientTo: "#ffa726",
      decimalPlaces: 2, // optional, defaults to 2dp
      color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
      labelColor: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
      style: {
        borderRadius: 16
      },
      propsForDots: {
        r: "6",
        strokeWidth: "2",
        stroke: "#ffa726"
      }
    }}
    bezier
    style={{
      marginVertical: 8,
      borderRadius: 16
    }}/>;
  }

  return (
    <View style={styles.container}>
      <Switch onValueChange={toggleSwitch} value={isEnabled}/>
      {main}
    </View>
  );
}

function MoviesList() {
  function MovieInfo(movie, index) {
    let renderedMovieInfo = [];
    for (let [label, info] of Object.entries(movie)) {
      if(label === 'Poster') {
        renderedMovieInfo.unshift(<Image source={posters[`poster${index}`]} key="image" 
        style={styles.detailedImg}/>);
      } else {
        renderedMovieInfo.push(
          <View key={label} style={styles.labelContainer}>
            <Text style={styles.labelDetailed}>{label}:</Text>
            <Text style={styles.infoDetailed}>{info}</Text>
          </View>
        );
      }
    }
    return renderedMovieInfo;
  }

  let [moviesState, setMovies] = useState([...moviesList]);
  let [showDetailed, setShowDetailed] = useState(false);
  let [indexDetailed, setIndexDetailed] = useState(0);
  let [search, setSearch] = useState('');
  let [showNewForm, setShowNewForm] = useState(false);
  let [formTitle, setFormTitle] = useState('');
  let [formType, setFormType] = useState('');
  let [formYear, setFormYear] = useState('');

  let detailMovieList = moviesState
  .map((movie, index) => {
    return (
      <View key={index} style={styles.detailedContainer}>
        <View style={styles.buttonBackContainer}>
          <Button title="Back" onPress={() => setShowDetailed(false)} style={styles.buttonBack}/>
        </View>
        {MovieInfo(movie, index)}
        <View style={styles.buttonDeleteContainer}>
          <Button color="red" title="Delete" onPress={() => {
            let newMoviesState = [...moviesState];
            newMoviesState.splice(index, 1);
            setMovies(newMoviesState);
            setShowDetailed(false);
          }}/>
        </View>
      </View>
    );
  })

  let renderedDetailed = detailMovieList[indexDetailed];

  let renderedMovies = moviesState
  .filter(movie => {
    if (search === '') {return true}
    return movie.Title.toLowerCase().includes(search.toLowerCase());
  })
  .map((movie, index) => {
    return (
    <TouchableOpacity key={index} onPress={() => {
      setIndexDetailed(index);
      setShowDetailed(true);
    }}>
      <View style={styles.film} key={index}>
        {posters[`poster${index}`] ? <Image source={posters[`poster${index}`]} style={styles.imgFilm}/> : null}
        <View style={styles.infoFilm}>
          <Text>{movie.Title}</Text>
          <Text>{movie.Year}</Text>
          <Text>{movie.Type}</Text>
        </View>
      </View>
    </TouchableOpacity>
    )
  });

  let finalRender = (
    <ScrollView>
    {showDetailed ? null : <SearchBar
      placeholder=""
      onChangeText={search => setSearch(search)}
      value={search}
      styles={styles.moviesContainer}
    />}
    {showDetailed ? null : <View style={styles.buttonPlusContainer}>
        <Button title="+" onPress={() => setShowNewForm(true)}/>
      </View>}
    {showDetailed ? renderedDetailed : 
    (renderedMovies.length ? renderedMovies : <Text>No items found</Text>)}
  </ScrollView>
  );
  if (showNewForm) {
    finalRender = (
      <View style={styles.newFormContainer}>
        <View style={styles.buttonBackContainer}>
          <Button title="Back" onPress={() => setShowNewForm(false)} style={styles.buttonBack}/>
        </View>
      <Text>Title</Text>
      <TextInput onChangeText={setFormTitle} value={formTitle} style={styles.input}/>
      <Text>Type</Text>
      <TextInput onChangeText={setFormType} value={formType} style={styles.input}/>
      <Text>Year</Text>
      <TextInput onChangeText={setFormYear} value={formYear} style={styles.input}
      keyboardType="numeric"/>
      <View style={styles.buttonAddContainer}>
          <Button title="Add" onPress={() => {
            if (!Number(formYear)) {return}
            setMovies([...moviesState, 
              {"Title": formTitle, "Type": formType, "Year": formYear}]);
            setShowNewForm(false);
            setFormTitle('');
            setFormType('');
            setFormYear('');
          }}/>
      </View>
    </View>
    );
  }

  return (
    <View>
      {finalRender}
    </View>
  );
}

const Tab = createBottomTabNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Tab.Navigator
              screenOptions={({ route }) => ({
          tabBarIcon: ({ focused, color, size }) => {
            let iconName;

            if (route.name === 'General') {
              iconName = focused
                ? 'ios-information-circle'
                : 'ios-information-circle-outline';
            } else if (route.name === 'Second page') {
              iconName = 'ios-list';
            } else if (route.name === 'Movies list') {
              iconName = 'ios-videocam-outline';
            }

            return <Ionicons name={iconName} size={size} color={color} />;
          },
        })}
        tabBarOptions={{
          activeTintColor: 'tomato',
          inactiveTintColor: 'gray',
        }}>
        <Tab.Screen name="General" component={General} />
        <Tab.Screen name="Second page" component={SecondPage} />
        <Tab.Screen name="Movies list" component={MoviesList} />
      </Tab.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  film: {
    borderBottomColor: 'grey',
    borderStyle: 'solid',
    borderWidth: 2,
    padding: 30,
    flexDirection: 'row'
  },
  imgFilm: {
    width: null,
    flex: 1,
    height: 150
  },
  infoFilm: {
    flex: 3,
    padding: 10
  },
  detailedContainer : {
    paddingTop: 30
  },
  detailedImg: {
    alignSelf: 'center'
  },
  labelContainer: {
    flexDirection: 'row', 
    paddingBottom: 20
  },
  labelDetailed: {
    color: 'grey',
    marginRight: 3
  },
  infoDetailed: {
    flex: 1
  },
  buttonBackContainer: {
    alignSelf: 'flex-start'
  },
  buttonPlusContainer: {
    width: "10%",
    alignSelf: "flex-end"
  },
  buttonAddContainer: {
    width: "20%",
    alignSelf: "center"
  },
  moviesContainer: {
    marginTop: 50
  },
  newFormContainer: {
    paddingTop: 30
  },
  input: {
    borderWidth: 1,
    margin: 12,
    height: 40
  },
  buttonDeleteContainer: {
    alignSelf: 'center'
  }
});
