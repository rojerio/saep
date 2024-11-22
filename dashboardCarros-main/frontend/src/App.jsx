import React, { useEffect, useState } from 'react';

function App() {
  const [tarefas, setTarefas] = useState([]);
  const [usuarios, setUsuarios] = useState([]);
  const [isAddingTarefa, setIsAddingTarefa] = useState(false);
  const [isAddingUsuario, setIsAddingUsuario] = useState(false);
  const [novaTarefa, setNovaTarefa] = useState({
    id_usuarios: '',
    descricao: '',
    setor: '',
    prioridade: 'Média',
    status: '',
    situacao: 'começando',
  });
  const [novoUsuario, setNovoUsuario] = useState({
    nome: '',
    email: '',
  });

  // Filtrar tarefas por situação
  const filtroTarefasPorSituacao = (situacao) =>
    tarefas.filter((tarefa) => tarefa.situacao === situacao);

  const adicionarTarefa = () => setIsAddingTarefa(true);
  const adicionarUsuario = () => setIsAddingUsuario(true);

  // Função para mover a tarefa para o próximo status
  const mudarStatusTarefa = async (id, atualSituacao) => {
    let novoStatus;
    // Definir o próximo status dependendo do status atual
    switch (atualSituacao) {
      case 'começando':
        novoStatus = 'quase';
        break;
      case 'quase':
        novoStatus = 'pronto';
        break;
      case 'pronto':
        novoStatus = 'começando'; // Pode definir para voltar ao começo, se necessário
        break;
      default:
        novoStatus = 'começando';
    }

    try {
      const response = await fetch(`http://localhost:3000/tarefas/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ situacao: novoStatus }), // Atualiza o status da tarefa
      });

      if (!response.ok) {
        throw new Error('Erro ao atualizar status da tarefa');
      }

      buscarTarefas(); // Recarrega as tarefas após a atualização
    } catch (error) {
      console.error('Erro ao atualizar status da tarefa:', error);
      alert(error.message);
    }
  };

  const salvarTarefa = async () => {
    try {
      const response = await fetch('http://localhost:3000/tarefas', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(novaTarefa),
      });
      if (!response.ok) {
        throw new Error('Erro ao salvar tarefa');
      }
      setIsAddingTarefa(false);
      setNovaTarefa({
        id_usuarios: '',
        descricao: '',
        setor: '',
        prioridade: 'Média',
        status: '',
        situacao: 'começando',
      });
      buscarTarefas();
    } catch (error) {
      console.error('Erro ao salvar tarefa:', error);
      alert(error.message); // Exibe o erro no front-end
    }
  };

  const salvarUsuario = async () => {
    try {
      const response = await fetch('http://localhost:3000/usuarios', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(novoUsuario),
      });
      if (!response.ok) {
        throw new Error('Erro ao salvar usuario');
      }
      setIsAddingUsuario(false);
      setNovoUsuario({ nome: '', email: '' });
      buscarUsuarios();
    } catch (error) {
      console.error('Erro ao salvar usuario:', error);
      alert(error.message); // Exibe o erro no front-end
    }
  };

  const buscarTarefas = async () => {
    try {
      const response = await fetch('http://localhost:3000/tarefas');
      const data = await response.json();
      setTarefas(data);
    } catch (error) {
      console.error('Erro ao buscar tarefas:', error);
    }
  };

  const buscarUsuarios = async () => {
    try {
      const response = await fetch('http://localhost:3000/usuarios');
      const data = await response.json();
      setUsuarios(data);
    } catch (error) {
      console.error('Erro ao buscar usuarios:', error);
    }
  };

  useEffect(() => {
    buscarTarefas();
    buscarUsuarios();
  }, []);

  return (
    <div>
      <header>
        <h1>Gerenciamento de Tarefas</h1>
        <button onClick={adicionarTarefa}>Adicionar Tarefa</button>
        <button onClick={adicionarUsuario}>Adicionar Usuario</button>
      </header>
      <div className="dashboard">
        <div className="coluna-dashboard">
          <h2>Começando</h2>
          {filtroTarefasPorSituacao('começando').map((tarefa) => (
            <div key={tarefa.id}>
              <div>{tarefa.descricao}</div>
              <div>{tarefa.setor}</div>
              <div>{tarefa.prioridade}</div>
              <div>{usuarios.find((user) => user.id === tarefa.id_usuarios)?.nome}</div>
              <button onClick={() => mudarStatusTarefa(tarefa.id, tarefa.situacao)}>
                Mover para Quase Pronto
              </button>
            </div>
          ))}
        </div>
        <div className="coluna-dashboard">
          <h2>Quase Pronto</h2>
          {filtroTarefasPorSituacao('quase').map((tarefa) => (
            <div key={tarefa.id}>
              <div>{tarefa.descricao}</div>
              <div>{tarefa.setor}</div>
              <div>{tarefa.prioridade}</div>
              <div>{usuarios.find((user) => user.id === tarefa.id_usuarios)?.nome}</div>
              <button onClick={() => mudarStatusTarefa(tarefa.id, tarefa.situacao)}>
                Mover para Pronto
              </button>
            </div>
          ))}
        </div>
        <div className="coluna-dashboard">
          <h2>Pronto</h2>
          {filtroTarefasPorSituacao('pronto').map((tarefa) => (
            <div key={tarefa.id}>
              <div>{tarefa.descricao}</div>
              <div>{tarefa.setor}</div>
              <div>{tarefa.prioridade}</div>
              <div>{usuarios.find((user) => user.id === tarefa.id_usuarios)?.nome}</div>
              <button onClick={() => mudarStatusTarefa(tarefa.id, tarefa.situacao)}>
                Mover para Começando
              </button>
            </div>
          ))}
        </div>
      </div>
      {isAddingTarefa && (
        <div className="modal">
          <div className="modal-content">
            <h2>Adicionar Tarefa</h2>
            <select
              value={novaTarefa.id_usuarios}
              onChange={(e) =>
                setNovaTarefa({ ...novaTarefa, id_usuarios: e.target.value })
              }
            >
              <option value="">Selecione um Usuario</option>
              {usuarios.map((Usuario) => (
                <option key={Usuario.id} value={Usuario.id}>
                  {Usuario.nome}
                </option>
              ))}
            </select>
            <input
              placeholder="Descrição"
              value={novaTarefa.descricao}
              onChange={(e) =>
                setNovaTarefa({ ...novaTarefa, descricao: e.target.value })
              }
            />
            <input
              placeholder="Setor"
              value={novaTarefa.setor}
              onChange={(e) =>
                setNovaTarefa({ ...novaTarefa, setor: e.target.value })
              }
            />
            <select
              value={novaTarefa.prioridade}
              onChange={(e) =>
                setNovaTarefa({ ...novaTarefa, prioridade: e.target.value })
              }
            >
              <option value="Baixa">Baixa</option>
              <option value="Média">Média</option>
              <option value="Alta">Alta</option>
            </select>
            <button onClick={salvarTarefa}>Salvar</button>
            <button onClick={() => setIsAddingTarefa(false)}>Cancelar</button>
          </div>
        </div>
      )}
      {isAddingUsuario && (
        <div className="modal">
          <div className="modal-content">
            <h2>Adicionar Usuario</h2>
            <input
              placeholder="Nome"
              value={novoUsuario.nome}
              onChange={(e) =>
                setNovoUsuario({ ...novoUsuario, nome: e.target.value })
              }
            />
            <input
              placeholder="Email"
              value={novoUsuario.email}
              onChange={(e) =>
                setNovoUsuario({ ...novoUsuario, email: e.target.value })
              }
            />
            <button onClick={salvarUsuario}>Salvar</button>
            <button onClick={() => setIsAddingUsuario(false)}>Cancelar</button>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;