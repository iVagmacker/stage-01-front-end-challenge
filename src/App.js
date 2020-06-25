import React, { useState, useEffect } from 'react';
import { FiThumbsUp } from 'react-icons/fi';
import Api from './services/api';

import './styles.css';

function App() {
  const [repositories, setRepositories] = useState([]);

  useEffect(() => {
    Api.get('repositories').then((response) => {
      setRepositories(response.data);
    });
  }, []);

  //useState retorna um array com 2 posições
  //
  //1. Variável com o seu valor inicial
  //2. Função para atualizarmos esse valor

  async function handleAddRepository() {
    const response = await Api.post('repositories', {
      title: `Challenge React - ${Date.now()}`,
      url: 'https://github.com/iVagmacker',
      techs: ['NodeJS', 'ReactJs', 'React Native'],
    });

    const repository = response.data;

    setRepositories([...repositories, repository]);
  }

  async function handleLikeRepository(id) {
    const response = await Api.post(`repositories/${id}/like`);

    if (response.status === 200) {
      const repositoryIndex = repositories.findIndex(
        (repository) => repository.id === id
      );

      const listRepositories = [...repositories];

      listRepositories[repositoryIndex].likes = response.data.likes;

      setRepositories(listRepositories);
    }
  }

  async function handleRemoveRepository(id) {
    const index = repositories.findIndex((repository) => repository.id === id);

    if (index >= 0) {
      repositories.splice(index, 1);

      setRepositories([...repositories]);

      await Api.delete(`repositories/${id}`);
    }
  }

  return (
    <>
      <div className="board">
        <div className="boardTitle">
          <p>List of repositories</p>
          <button onClick={handleAddRepository}>Adicionar</button>
        </div>
        <div className="cards" data-testid="repository-list">
          {repositories.map((repository) => (
            <div className="card" key={repository.id}>
              <div className="title">
                <p>{repository.title}</p>
                <div>
                  <FiThumbsUp />
                  <p>{repository.likes}</p>
                </div>
              </div>
              <p className="link">
                <span>GitHub: </span>
                <a href={repository.url} target="_blank">
                  {repository.url}
                </a>
              </p>
              <div className="techs">
                {repository.techs.map((tech) => (
                  <div key={tech}>{tech}</div>
                ))}
              </div>
              <div className="buttons">
                <button
                  className="buttonLike"
                  onClick={() => handleLikeRepository(repository.id)}
                >
                  Gostei
                </button>
                <button
                  className="buttonTrash"
                  onClick={() => handleRemoveRepository(repository.id)}
                >
                  Remover
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}

export default App;
