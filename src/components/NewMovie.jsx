import React, { useState, useEffect } from 'react';
import axios from 'axios';

function NewMovie() {
  const [addMovieData, setAddMovieData] = useState({
    title: '',
    description: '',
    year: '',
  });

  const [editId, setEditId] = useState(null);

  const [movies, setMovies] = useState([]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setAddMovieData({ ...addMovieData, [name]: value });
  };

  const handleShowMovieData = async () => {
    try {
      const response = await axios.get(
        'https://movies-8314d-default-rtdb.firebaseio.com/movies.json'
      );
      const fetchedMovies = response.data;
      const moviesArray = fetchedMovies
        ? Object.keys(fetchedMovies).map((key) => ({
            id: key,
            ...fetchedMovies[key],
          }))
        : [];
      setMovies(moviesArray);
    } catch (error) {
      console.error('Error fetching movies:', error);
    }
  };

  useEffect(() => {
    handleShowMovieData();
  }, []);

  const handleAddOrUpdateMovie = async () => {
    try {
      if (editId) {
        await axios.put(
          `https://movies-8314d-default-rtdb.firebaseio.com/movies/${editId}.json`,
          addMovieData
        );

        setMovies((prevMovies) =>
          prevMovies.map((movie) =>
            movie.id === editId ? { id: movie.id, ...addMovieData } : movie
          )
        );
        setEditId(null);
      } else {
        const response = await axios.post(
          'https://movies-8314d-default-rtdb.firebaseio.com/movies.json',
          addMovieData
        );

        const newMovie = { id: response.data.name, ...addMovieData };
        setMovies((prevMovies) => [...prevMovies, newMovie]);
      }

      setAddMovieData({
        title: '',
        description: '',
        year: '',
      });
    } catch (error) {
      console.error('Error adding/updating movie:', error);
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(
        `https://movies-8314d-default-rtdb.firebaseio.com/movies/${id}.json`
      );

      setMovies((prevMovies) => prevMovies.filter((movie) => movie.id !== id));
    } catch (error) {
      console.error('Error deleting movie:', error);
    }
  };

  const handleEditData = (movie) => {
    setAddMovieData({
      title: movie.title,
      description: movie.description,
      year: movie.year,

    });
    setEditId(movie.id);
  };

  return (
    <>
      <div className="add">
        <h3>{editId ? 'Edit Movie' : 'Add Movie'}</h3>
        <input
          type="text"
          name="title"
          value={addMovieData.title}
          placeholder="Title"
          onChange={handleChange}
        />
        <input
          type="text"
          name="description"
          value={addMovieData.description}
          placeholder="Description"
          onChange={handleChange}
        />
        <input
          type="text"
          name="year"
          value={addMovieData.year}
          placeholder="Year"
          onChange={handleChange}
        />
        <button onClick={handleAddOrUpdateMovie}>
          {editId ? 'Update Movie' : 'Add Movie'}
        </button>
      </div>

      <div className="outerDiv">
        {movies.length > 0 ? (
          movies.map((movie) => (
            <div className="innerDiv" key={movie.id}>
              <h2>
                Title: <strong>{movie.title}</strong>
              </h2>
              <p>
                Description: <span>{movie.description}</span>
              </p>
              <p>
                Year: <span>{movie.year}</span>
              </p>
              <button className="delete" onClick={() => handleDelete(movie.id)}>
                Delete
              </button>
              <button className="delete" onClick={() => handleEditData(movie)}>
                Edit
              </button>
            </div>
          ))
        ) : (
          'No Data Available'
        )}
      </div>
    </>
  );
}

export default NewMovie;
