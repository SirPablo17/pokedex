// ============================================================================
// APP: Arquivo de Inicialização
// ============================================================================
// Este é o arquivo principal que inicia toda a aplicação
// Ele cria as instâncias (objetos) das classes e conecta tudo
// ============================================================================

// IIFE - Immediately Invoked Function Expression (Função Imediatamente Invocada)
(function() {

    // Aguardamos o DOM estar completamente carregado antes de iniciar
    document.addEventListener('DOMContentLoaded', function() {

        console.log('Iniciando aplicação...');

        // PASSO 1: Criar instância do Service
        const apiService = new ApiService();

        // PASSO 2: Criar instância do Model
        const pokemonModel = new PokemonModel();

        // PASSO 3: Criar instância da View
        const pokemonView = new PokemonView();

        // PASSO 4: Criar instância do Controller
        // Passamos o model, view e service como parâmetros (injeção de dependência)
        const pokemonController = new PokemonController(pokemonModel, pokemonView, apiService);

        // PASSO 5: Inicializar o Controller
        pokemonController.init();

        console.log('Aplicação iniciada com sucesso!');
    });

})();