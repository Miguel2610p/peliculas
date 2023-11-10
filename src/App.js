import { useEffect } from 'react';
import axios from 'axios'
import './App.css';
import { useState } from 'react';
import YouTube from 'react-youtube';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUpLong } from '@fortawesome/free-solid-svg-icons';



function App() {
  const API_URL = "https://api.themoviedb.org/3";
  const API_KEY = "4f5f43495afcc67e9553f6c684a82f84";
  const IMAGE_PATH = "https://image.tmdb.org/t/p/original";

  // endpoint para las imagenes
  const URL_IMAGE = "https://image.tmdb.org/t/p/original";
  
  // variables de estado
  const [movies, setMovies] = useState([]);
  const [searchKey, setSearchKey] = useState("");
  const [trailer, setTrailer] = useState(null);
  const [movie, setMovie] = useState({ title: "Loading Movies" });
  const [playing, setPlaying] = useState(false);
  const [notFound, setNotFound] = useState(false);


  // funcion para realizar la peticion por get a la api
  const fetchMovies = async (searchKey) => {
    const type = searchKey ? "search" : "discover";
    const {
      data: { results },
    } = await axios.get(`${API_URL}/${type}/movie`, {
      params: {
        api_key: API_KEY,
        query: searchKey,
      },
    });

    setMovies(results);
    setMovie(results[0]);

    if (results.length) {
      await fetchMovie(results[0].id);
      setNotFound(false); // Se encontraron resultados, así que establecemos notFound en false
    } else {
      setNotFound(true); // No se encontraron resultados, establecemos notFound en true
    }
  };

  // funcion para la peticion de un solo objeto y mostrar en reproductor de videos
  const fetchMovie = async (id) => {
    const { data } = await axios.get(`${API_URL}/movie/${id}`, {
      params: {
        api_key: API_KEY,
        append_to_response: "videos",
      },
    });

    if (data.videos && data.videos.results) {
      const trailer = data.videos.results.find(
        (vid) => vid.name === "Official Trailer"
      );
      setTrailer(trailer ? trailer : data.videos.results[0]);
    }
    //return data
    setMovie(data);
  };

  const selectMovie = async (movie) => {
    fetchMovie(movie.id);
    setMovie(movie);
    window.scrollTo(0, 0);
  };

  // funcion para buscar peliculas
  const searchMovies = (e) => {
    e.preventDefault();
    fetchMovies(searchKey)
  };
  

  useEffect(() => {
    fetchMovies();
  }, []);

  return (
    <div>
      <h2 className="titulo">Tráilers de Peliculas</h2>
      
      {/* el buscador */}
      <br></br>
      <form className="container mb-4" onSubmit={searchMovies}>
        <input type="text" placeholder="Película" onChange={(e) => setSearchKey(e.target.value)}/>
        <button className="btn btn-primary" style={{ marginLeft: '10px' }}>Buscar</button>
      </form>  
      
      {notFound && (
    <div className="text-center mt-4">
      <h2>No se encontraron resultados</h2>
      <br></br>
      <button className="btn btn-primary" onClick={() => window.location.reload()}>Volver a la pantalla principal</button>
    </div>
    )}
  
      <div>
        <main>
          {movie ? (
            <div
              className="viewtrailer"
              style={{
                backgroundImage: `url("${IMAGE_PATH}${movie.backdrop_path}")`,
              }}
            >
              {playing ? (
                <>
                  <YouTube
                    videoId={trailer.key}
                    className="reproductor container"
                    containerClassName={"youtube-container amru"}
                    opts={{
                        width: "100%",
                        height: "100%",
                        playerVars: {
                        autoplay: 1,
                        controls: 0,
                        cc_load_policy: 0,
                        fs: 0,
                        iv_load_policy: 0,
                        modestbranding: 0,
                        rel: 0,
                        showinfo: 0,
                      },
                    }}
                  />
                  <button onClick={() => setPlaying(false)} className="boton">
                    Close
                  </button>
                </>
              ) : (
                <div className="container">
                  <div className="">
                    {trailer ? (
                      <button className="boton" onClick={() => setPlaying(true)} type="button">Play Trailer</button>
                    ) : (
                      "Sorry, no trailer available"
                    )}
                    <h1 className="text-white">{movie.title}</h1>
                    <p className="text-white">{movie.overview}</p>
                  </div>
                </div>
              )}
            </div>
          ) : null}
        </main>
      </div>

      {/* contenedor para mostrar los posters y las peliculas en la peticion a la api */}
      <div className="container mt-3">
        <div className="row">
          {movies.map((movie) => (
            <div key={movie.id} className="col-md-4 mb-3" onClick={() => selectMovie(movie)}>
              <img src={`${URL_IMAGE + movie.poster_path}`} alt="" height={600} width="100%"/>
              <h4 className="text-center">{movie.title}</h4>
            </div>
          ))}
        </div>
      </div>
      <div className="scroll-to-top" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
  <div className="up-arrow">
    <FontAwesomeIcon icon={faUpLong} />
  </div>
</div>
      
    </div>

    
  );
}

export default App;