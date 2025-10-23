// ============================================================================
// CONTROLLER: PokemonController
// ============================================================================
// Este arquivo representa o CONTROLADOR da aplicação
// Ele é a ponte entre o Model (dados) e a View (interface)
// O Controller orquestra tudo: busca dados, processa e manda exibir na tela
// ============================================================================

// Criamos a classe PokemonController
class PokemonController {

    // O constructor recebe as instâncias do Model, View e Service
    constructor(model, view, service) {
        this.model = model;
        this.view = view;
        this.service = service;

        this.pokemonsPerPage = 20; // Padrão da PokeAPI
        this.currentPage = 0;      // Começa na página 0 (offset 0)
    }

    // Método para inicializar a aplicação
    async init() {
        await this.loadPokemons(); 
        this.view.bindSearchPokemon(this.searchPokemon.bind(this));
        
        // NOVO: Injeta os listeners dos botões de paginação
        this.view.bindPagination(
            this.goToNextPage.bind(this),
            this.goToPreviousPage.bind(this)
        );
    }

    async loadPokemons() {

        // Calcula o offset (ponto de partida)
        const offset = this.currentPage * this.pokemonsPerPage;
        
        // try/catch para capturar possíveis erros
        try {
            this.view.showLoading();
            this.view.hideError();
            
            // PASSO 3: Busca os Pokémons, passando limit e offset
            const detailedPokemons = await this.service.getUsers(this.pokemonsPerPage, offset);

            this.model.setPokemons(detailedPokemons);
            const storedPokemons = this.model.getPokemons();
            
            // Renderiza, e passa o estado da página para a View decidir se habilita os botões
            this.view.renderPokemons(storedPokemons);
            
            // NOVO: Atualiza o estado dos botões de paginação na View
            this.view.updatePagination(this.currentPage); 

            this.view.hideLoading();
            console.log(`Página ${this.currentPage + 1} de Pokémons carregada com sucesso!`);

        } catch (error) {
            this.view.hideLoading();
            this.view.showError('Erro ao carregar Pokémons. Tente novamente mais tarde.');
            console.error('Erro ao carregar Pokémons:', error);
        }
    }

    // NOVO MÉTODO: Avança para a próxima página
    goToNextPage() {
        this.currentPage++;
        this.loadPokemons();
        // Opcional: Rola a tela para o topo para ver os novos Pokémons
        window.scrollTo(0, 0); 
    }

    // NOVO MÉTODO: Volta para a página anterior
    goToPreviousPage() {
        if (this.currentPage > 0) {
            this.currentPage--;
            this.loadPokemons();
            window.scrollTo(0, 0); 
        }
    }

    async searchPokemon(searchTerm) {
        // Limpa o Model antes de buscar
        this.model.setPokemons([]); 

        try {
            this.view.showLoading();
            this.view.hideError();

            // Busca o Pokémon detalhado
            const pokemon = await this.service.getPokemonByNameOrId(searchTerm);

            // Armazena o único Pokémon no Model (em um array)
            this.model.setPokemons([pokemon]);

            // Renderiza o Pokémon encontrado
            const storedPokemon = this.model.getPokemons();
            this.view.renderPokemons(storedPokemon);
            
            this.view.hideLoading();
            console.log(`Pokémon "${searchTerm}" encontrado com sucesso!`);

        } catch (error) {
            // O erro capturado pode ser a mensagem "Pokémon não encontrado" do Service
            this.view.hideLoading();
            this.view.showError(error.message);
            console.error('Erro durante a busca:', error);
        }
    }
}