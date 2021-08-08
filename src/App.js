import { Fragment, useState, useEffect, useCallback } from "react";
import "./App.css";
import AddMovie from "./components/AddMovie";
import MoviesList from "./components/MoviesList";

const App = () => {
  const [movies, setMovies] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  // useEffect(()=>{
  //    //fetchMoviesHandler();  // see difference by keeping and removie
  // },[fetchMoviesHandler]);  // this useEffect you see error because this shld be called after the initialization and definition

  //  const fetchMoviesHandler = async() => { // or we can use by other way see below
  //  async function fetchMoviesHandler(){

  const fetchMoviesHandler = useCallback(async () => {
    setIsLoading(true);
    setError(null); // for previous errors if we have
    try {
      const resonse = await fetch("https://react-http-18358-default-rtdb.firebaseio.com/movies.json");
      if (!resonse.ok) {
        throw new Error("Something went wrong ");
      }
      const data = await resonse.json();

      const loadedMovies =[];
      for(const key in data){
        loadedMovies.push({
          id:key,
          title:data[key].title,
          openingText:data[key].openingText,
          releaseDateRef:data[key].releaseDateRef
        })
      }

      // const Transformed = data.results.map((movieData) => {
      //   return {
      //     id: movieData.episode_id,
      //     title: movieData.title,
      //     releaseDate: movieData.release_date,
      //     openingText: movieData.opening_crawl,
      //   };
      // });
      setMovies(loadedMovies);
    } catch (error) {
      setError(error.message);
    }
    setIsLoading(false);
  }, []);

  useEffect(() => {}, [fetchMoviesHandler]);

  let content = <p>Found No movies</p>;

  if (movies.length > 0) {
    content = <MoviesList movies={movies} />;
  }
  if (error) {
    content = <p>{error}</p>;
  }
  if (isLoading) {
    content = <p>Loading...</p>;
  }

  const addMovieHandler = async(movie) => {
    // console.log(movie);
  const response = await fetch('https://react-http-18358-default-rtdb.firebaseio.com/movies.json',{
      method :'POST',
      body:JSON.stringify(movie),
      headers:{
      'content-Type':'application/JSON'  
      }
    });
    const data = await response.json();
    console.log(data);
  };
  return (
    <Fragment>
      <section>
        <AddMovie onAddMovie={addMovieHandler} />
      </section>
      <section>
        <button onClick={fetchMoviesHandler}>Fetch Movies</button>
      </section>
      <section>
        {/* {!isLoading && movies.length > 0 && <MoviesList movies={movies} />}
        {!isLoading && movies.length === 0 && !error && <p>Found no movies</p>}
        {!isLoading && error && <p>{error}</p>}
        {isLoading && <p>Loading... </p>} */}
        {content}
      </section>
    </Fragment>
  );
};

export default App;
