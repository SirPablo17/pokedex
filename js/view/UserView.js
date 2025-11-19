// ============================================================================
// VIEW: PokemonView
// ============================================================================
// Este arquivo representa a VISÃO da aplicação
// Ele é responsável por toda a manipulação da interface (o que aparece na tela)
// No padrão MVC, a View não sabe de onde vem os dados, só os exibe
// ============================================================================

// Criamos a classe PokemonView
class PokemonView {

    // O constructor inicializa a classe e captura os elementos HTML
    constructor() {
        // Elementos principais do Container e Status
        this.pokemonsContainer = document.getElementById('users-container');
        this.loadingElement = document.getElementById('loading');
        this.errorElement = document.getElementById('error');
        
        // Elementos de Busca
        this.searchForm = document.getElementById('search-form');
        this.searchInput = document.getElementById('search-input');
        
        // Elementos de Paginação
        this.prevButton = document.getElementById('prev-page-button');
        this.nextButton = document.getElementById('next-page-button');
        this.pageCounter = document.getElementById('page-counter');
        
        // Elemento da barra de busca
        this.searchBar = document.querySelector('.search-form-molecule'); 
        // Elemento da paginação
        this.paginationBar = document.querySelector('.pagination-organism');
    }

    // Método para exibir o indicador de carregamento
    showLoading() {
        this.loadingElement.classList.remove('hidden');
    }

    // Método para esconder o indicador de carregamento
    hideLoading() {
        this.loadingElement.classList.add('hidden');
    }

    // Método para exibir uma mensagem de erro
    showError(message) {
        this.errorElement.textContent = message;
        this.errorElement.classList.remove('hidden');
    }

    // Método para esconder a mensagem de erro
    hideError() {
        this.errorElement.classList.add('hidden');
    }

    // Método para injetar o handler de busca no Controller
    bindSearchPokemon(handler) {
        if (this.searchForm) {
            this.searchForm.addEventListener('submit', (e) => {
                e.preventDefault(); // Impede o envio padrão do formulário
                
                const searchTerm = this.searchInput.value.trim().toLowerCase();
                
                if (searchTerm) {
                    this.hideError(); // Limpa erros anteriores
                    // Chama a função do Controller (handler) passando o termo de busca
                    handler(searchTerm); 
                } else {
                    this.showError('Por favor, digite o nome ou ID do Pokémon para buscar.');
                }
            });
        }
    }
    
    // Método para injetar os handlers da paginação no Controller
    bindPagination(nextHandler, prevHandler) {
        if (this.nextButton) {
            this.nextButton.addEventListener('click', nextHandler);
        }
        if (this.prevButton) {
            this.prevButton.addEventListener('click', prevHandler);
        }
    }
    
    // Método para atualizar o estado visual da paginação
    updatePagination(currentPage, isSearchMode = false) {
        // Se estiver no modo de busca, esconde a paginação
        if (isSearchMode) {
            if (this.paginationBar) this.paginationBar.classList.add('hidden');
            return;
        }

        // Se estiver no modo de lista (Ver Todos), garante que a paginação está visível
        if (this.paginationBar) this.paginationBar.classList.remove('hidden');

        // Atualiza o contador de página
        if (this.pageCounter) {
            this.pageCounter.textContent = `Página ${currentPage + 1}`;
        }
        
        // Desabilita o botão Anterior se for a primeira página (Page 0)
        if (this.prevButton) {
            this.prevButton.disabled = (currentPage === 0);
        }
        
        // O botão "Próximo" fica habilitado, pois a API não nos dá o total de itens de forma fácil.
        if (this.nextButton) {
             this.nextButton.disabled = false;
        }
    }

    // Método para renderizar (desenhar/exibir) a lista de Pokémons na tela
    renderPokemons(pokemons) {

        // Limpamos o container
        this.pokemonsContainer.innerHTML = '';

        // Verificamos se há apenas um Pokémon (modo busca) ou mais de um (modo lista)
        const isSearchMode = pokemons.length === 1 && !this.searchInput.value.trim(); 
        
        // Oculta/Mostra paginação com base no modo
        // Esta chamada será feita no Controller, mas é bom ter uma verificação aqui também
        // if (this.paginationBar) {
        //     this.paginationBar.classList.toggle('hidden', pokemons.length <= 1);
        // }


        if (pokemons.length === 0) {
            this.pokemonsContainer.innerHTML = '<p class="text-center">Nenhum Pokémon encontrado. Tente outra busca ou recarregue a lista.</p>';
            return;
        }
        
        // Para cada Pokémon, criamos o card e adicionamos ao container
        pokemons.forEach(pokemon => {
            const pokemonCard = this.createPokemonCard(pokemon);
            this.pokemonsContainer.appendChild(pokemonCard);
        });
    }

    // Método para criar o HTML de um card de Pokémon
    createPokemonCard(pokemon) {

        const card = document.createElement('div');
        card.classList.add('pokemon-card');
        
        // Formata os Tipos (Array de objetos) para uma string de spans estilizados
        const types = pokemon.types
            .map(t => `<span class="pokemon-type type-${t.type.name}">${t.type.name.toUpperCase()}</span>`)
            .join(' ');
            
        // Formata as Habilidades
        const abilities = pokemon.abilities
            .map(a => a.ability.name)
            .join(', ');

        // Definimos o conteúdo HTML interno do card
        card.innerHTML = `
            <div class="pokemon-header">
                <h2 class="pokemon-name">${pokemon.name.toUpperCase()}</h2>
                <span class="pokemon-id">#${pokemon.id.toString().padStart(3, '0')}</span>
            </div>
            <div class="pokemon-image-container">
                <img src="${pokemon.sprites.front_default}" alt="${pokemon.name}" class="pokemon-image">
            </div>
            <p class="pokemon-types">${types}</p>
            <div class="pokemon-stats">
                <p><strong>Altura:</strong> ${pokemon.height / 10} m</p>
                <p><strong>Peso:</strong> ${pokemon.weight / 10} kg</p>
                <p><strong>Habilidades:</strong> ${abilities}</p>
            </div>
        `;

        // Retornamos o elemento criado
        return card;
    }
}