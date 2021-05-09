import { StatusBar } from 'expo-status-bar';
import React, {useState, useEffect} from 'react';
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
import * as ImagePicker from 'expo-image-picker';

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
  function MovieInfo(movie) {
    let renderedMovieInfo = [];
    for (let [label, info] of Object.entries(movie)) {
      if(label === 'Poster') {
        renderedMovieInfo.unshift(<Image source={{uri: movie.Poster}} key="image" 
        style={styles.detailedImg}/>);
      } else if (label === 'Ratings'){
        continue
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

  let [moviesState, setMovies] = useState([]);
  let [showDetailed, setShowDetailed] = useState(false);
  let [filmDetailed, setFilmDetailed] = useState({});
  let [search, setSearch] = useState('');
  let [showNewForm, setShowNewForm] = useState(false);
  let [formTitle, setFormTitle] = useState('');
  let [formType, setFormType] = useState('');
  let [formYear, setFormYear] = useState('');

  // let detailMovieList = moviesState
  // .map((movie, index) => {
  //   return (
  //     <View key={index} style={styles.detailedContainer}>
  //       <View style={styles.buttonBackContainer}>
  //         <Button title="Back" onPress={() => setShowDetailed(false)} style={styles.buttonBack}/>
  //       </View>
  //       {MovieInfo(movie, index)}
  //       <View style={styles.buttonDeleteContainer}>
  //         <Button color="red" title="Delete" onPress={() => {
  //           let newMoviesState = [...moviesState];
  //           newMoviesState.splice(index, 1);
  //           setMovies(newMoviesState);
  //           setShowDetailed(false);
  //         }}/>
  //       </View>
  //     </View>
  //   );
  // });

  let detailMovie =  (
      <View style={styles.detailedContainer}>
        <View style={styles.buttonBackContainer}>
          <Button title="Back" onPress={() => setShowDetailed(false)} style={styles.buttonBack}/>
        </View>
        {MovieInfo(filmDetailed)}
      </View>
    );

  // let renderedDetailed = detailMovieList[indexDetailed];

  useEffect(() => {
    if (search.length < 3) {return}
    if (search.length === 0) {setMovies([]);}
    fetch(`http://www.omdbapi.com/?apikey=7e9fe69e&s=${search}&page=1`)
    .then(response => {
      return response.json();
    })
    .then(films => {
      setMovies(films.Search);
    });
  }, [search]);

  let renderedMovies = moviesState
  // .filter(movie => {
  //   if (search === '') {return true}
  //   return movie.Title.toLowerCase().includes(search.toLowerCase());
  // })
  .map((movie, index) => {
    return (
    <TouchableOpacity key={index} onPress={() => {
      fetch(`http://www.omdbapi.com/?apikey=7e9fe69e&i=${movie.imdbID}`)
      .then(response => {
        return response.json();
      })
      .then(film => {
        setFilmDetailed(film);
        setShowDetailed(true);
      });
    }}>
      <View style={styles.film} key={index}>
        <Image source={{uri: movie.Poster}} style={styles.imgFilm}/>
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
    {showDetailed ? detailMovie : 
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

function ImageList(){
  function getRandomInt(max) {
    return Math.floor(Math.random() * max);
  }

  const [imageList, setImageList] = useState([]);

  // useEffect(() => {
  //   (async () => {
  //     if (Platform.OS !== 'web') {
  //       const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
  //       if (status !== 'granted') {
  //         alert('Sorry, we need camera roll permissions to make this work!');
  //       }
  //     }
  //   })();
  // }, []);

  useEffect(() => {
    fetch(`https://pixabay.com/api/?key=19193969-87191e5db266905fe8936d565&q=small+animals&image_type=photo&per_page=18`)
    .then(data => data.json())
    .then(info => {
      setImageList(info.hits.map(img => img.webformatURL));
    });
  }, []);

  // const pickImage = async () => {
  //   let result = await ImagePicker.launchImageLibraryAsync({
  //     mediaTypes: ImagePicker.MediaTypeOptions.All,
  //     allowsEditing: true,
  //     aspect: [4, 3],
  //     quality: 1,
  //   });

  //   console.log(result);

  //   if (!result.cancelled) {
  //     setImageList([...imageList, result.uri]);
  //   }
  // };

  let renderedImages = [];
  let windowWidth = Dimensions.get('window').width;
  let intermediateContainer = null;
  let intermediateBigImg = null;
  let i = 0;
  if (imageList){
    for (let image of imageList) {
      let divider = 1;
      let height = 75;
      if (i === 0) {
        divider = 3;
      } else if (i === 1 | i === 2) {
        divider = 2;
      }
      if (i === 1) {
        intermediateContainer = (
          <Image key={i+getRandomInt(1000)} source={{ uri: image }} style={{ width: (windowWidth  / 5) * divider,
            height: height * divider}}/>
        );
        renderedImages.push(
          <Image key={i+getRandomInt(1000)} source={{ uri: image }} style={{ width: (windowWidth  / 5) * divider,
             height: height * divider}}/>);
      } else if (i === 2) {
        renderedImages[renderedImages.length-1] = (<View key={i+getRandomInt(1000)}>
          {intermediateContainer}
          <Image key={i+getRandomInt(1000)} source={{ uri: image }} style={{ width: (windowWidth  / 5) * divider,
           height: height * divider}}/>
        </View>);
        intermediateContainer = null;
      } else if (i === 3) {
        intermediateBigImg = renderedImages[renderedImages.length-2];
        renderedImages[renderedImages.length-2] = (
          <View key={i+getRandomInt(1000)}>
            {renderedImages[renderedImages.length-2]}
            <View style={{flexDirection: 'row'}}>
            <Image source={{ uri: image }} style={{ width: (windowWidth  / 5) * divider,
              height: height * divider}}/>
            </View>
          </View>
        );
        intermediateContainer = [<Image key={i+getRandomInt(1000)} source={{ uri: image }} style={{ width: (windowWidth  / 5) * divider,
          height: height * divider}}/>];
      } else if (i === 4 | i === 5) {
        renderedImages[renderedImages.length-2] = (
          <View key={i+getRandomInt(1000)}>
            {intermediateBigImg}
            <View style={{flexDirection: 'row'}}>
              {intermediateContainer}
            </View>
          </View>
        );
        intermediateContainer.push(<Image key={i+getRandomInt(1000)} source={{ uri: image }} style={{ width: (windowWidth  / 5) * divider,
          height: height * divider}}/>);
      } else {
        renderedImages.push(
          <Image key={i+getRandomInt(1000)} source={{ uri: image }} style={{ width: (windowWidth  / 5) * divider,
             height: height * divider}}/>);
      }
      i++;
      if (i > 5) {
        i = 0;
        intermediateBigImg = null;
        intermediateContainer = null;
      }
    }
  }

  return (
    <ScrollView>
    <View style={styles.containerImages}>
          <View style={styles.containerImagesDirection}>{renderedImages}</View>
    </View>
    </ScrollView>
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
            } else if (route.name === 'Image list') {
              iconName = 'ios-image-outline';
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
        <Tab.Screen name="Image list" component={ImageList} />
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
    alignSelf: 'center',
    width: 400,
    height: 400,
    marginTop: 10
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
  },
  containerImages: {
    paddingTop: 30
  },
  containerImagesDirection: {
    flexDirection: "row",
    flexWrap: 'wrap'
  }
});
