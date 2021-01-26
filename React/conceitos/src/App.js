import React, { useState, useEffect } from "react"

import "./styles.css"

import api from './services/api'

function App() {
	const [repositories, setRepositories] = useState([])	

	useEffect(() => {
		api.get('/repositories').then(res => setRepositories(res.data))
	}, [])

	async function handleAddRepository() {
		const response = await api.post('/repositories', {
			url: "https://github.com/josepholiveira",
			title: "Desafio ReactJS",
			techs: ["React", "Node.js"],
		})

		setRepositories([...repositories, response.data])
	}

	async function handleRemoveRepository(id) {
		await api.delete(`/repositories/${id}`)
		
		setRepositories( repositories.filter(rep => rep.id !== id) )
	}

	return (
		<div>
			<ul data-testid="repository-list">
				{
					repositories.map(({id, title}) => (
						<li key={id}>
							{title}

							<button onClick={() => handleRemoveRepository(id)}>
								Remover
							</button>
						</li>
					))
				}
			</ul>

			<button onClick={handleAddRepository}>Adicionar</button>
		</div>
	);
}

export default App;
