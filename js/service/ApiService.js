// ============================================================================
// SERVICE: ApiService
// ============================================================================
// Este arquivo é responsável por fazer a comunicação com a API externa
// Ele contém os métodos para buscar dados do servidor (PokeAPI)
// ============================================================================

// Criamos uma classe chamada ApiService
// Uma classe é como um molde/modelo que agrupa funções relacionadas
class ApiService {

    // O constructor é o primeiro método executado quando criamos um objeto desta classe
    // Aqui definimos a URL base da API que vamos usar
    constructor() {
        // this.baseURL é uma propriedade (variável) da classe
        // Ela armazena o endereço principal da API PokeAPI
        this.baseURL = 'https://pokeapi.co/api/v2/pokemon';
    }

    // NOVO MÉTODO: Busca detalhes de um Pokémon individual usando sua URL
    async getPokemonDetails(url) {
        try {
            const response = await fetch(url);
            if (!response.ok) {
                // Se a API retornar um 404 ou 500
                throw new Error(`Erro ao buscar detalhes do Pokémon: ${url}. Status: ${response.status}`);
            }
            // Retorna os dados completos (id, sprites, types, etc.)
            return await response.json();
        } catch (error) {
            console.error('Erro na requisição de detalhes:', error);
            throw error;
        }
    }

    // Método para buscar a lista inicial e os detalhes de todos os Pokémons
    // No Controller, este método é chamado de forma genérica, como antes.
    async getUsers(limit = 20, offset = 0) {

        // try/catch é uma estrutura para lidar com erros
        try {

            // PASSO 1: Busca a lista inicial de nomes e URLs
            const response = await fetch(`${this.baseURL}?limit=${limit}&offset=${offset}`);

            if (!response.ok) {
                throw new Error('Erro ao buscar a lista inicial de Pokémons');
            }

            const data = await response.json();

            // PASSO 2: Cria um array de Promises para buscar os detalhes de cada Pokémon
            const detailPromises = data.results.map(pokemon => 
                this.getPokemonDetails(pokemon.url)
            );

            // PASSO 3: Espera que todas as Promises de detalhes sejam resolvidas
            // Se houver falha em um detalhe, o Promise.all falha, caindo no catch principal.
            const detailedPokemons = await Promise.all(detailPromises);

            // Retorna o array de Pokémons com todos os dados
            return detailedPokemons;

        } catch (error) {
            // Se aconteceu algum erro no try, ele cai aqui
            console.error('Erro na requisição principal:', error);
            // throw error relança o erro para ser tratado por quem chamou o método
            throw error;
        }
    }

    async getPokemonByNameOrId(term) {
        try {
            // A API permite buscar diretamente no endpoint /pokemon/ com o termo
            const response = await fetch(`${this.baseURL}/${term}`);

            if (!response.ok) {
                // Se o Pokémon não for encontrado, a API retorna 404
                if (response.status === 404) {
                    throw new Error(`Pokémon "${term}" não encontrado.`);
                }
                throw new Error(`Erro na busca: Status ${response.status}`);
            }

            // Retorna o objeto Pokémon detalhado
            return await response.json();

        } catch (error) {
            console.error('Erro na requisição de busca:', error);
            throw error;
        }
    }
}