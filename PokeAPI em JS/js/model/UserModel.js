// ============================================================================
// MODEL: PokemonModel
// ============================================================================
// Este arquivo representa o MODELO de dados da aplicação
// Ele é responsável por armazenar e gerenciar os dados dos Pokémons
// No padrão MVC, o Model não sabe nada sobre a interface (View)
// ============================================================================

// Criamos a classe PokemonModel
class PokemonModel {

    // O constructor inicializa a classe
    constructor() {
        // this.pokemons é um array (lista) que vai armazenar todos os Pokémons
        // Começamos com um array vazio []
        this.pokemons = [];
    }

    // Método para definir/armazenar os Pokémons
    // Recebe um array de Pokémons detalhados como parâmetro
    setPokemons(pokemons) {
        // Atribuímos os Pokémons recebidos para a propriedade this.pokemons
        this.pokemons = pokemons;
    }

    // Método para obter/recuperar os Pokémons
    // Retorna o array de Pokémons armazenado
    getPokemons() {
        // return devolve os dados para quem chamou este método
        return this.pokemons;
    }


    // Método para obter a quantidade total de Pokémons
    getTotalPokemons() {
        // this.pokemons.length retorna o tamanho do array
        return this.pokemons.length;
    }
}