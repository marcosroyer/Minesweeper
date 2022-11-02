class Quadrado{
    constructor(){
        this.conteudo = '', 
        this.anterior = '',
        this.classes = {naoClicado: '', clicado: ''}  
        this.clicado = false
        this.tomClaro = false
        this.numero = null
        this.flag = false
        this.original = ''
    }
}

class Tabuleiro{
    
    constructor(tamanho){
        this.tamanho = tamanho
        this.espacamento = tamanho === 8 ? 1 : 3
        this.inicio = null
        this.tabuleiro = [...Array(this.tamanho)].map( () => [...Array(this.tamanho)])  //.fill('')
        this.started = false
        this.povoaTabuleiro()
        this.qtdBombas
        this.qtdFlags = 10
        this.hits = 0
    }

    checkForWin(){
        let hits = 0
        for(let linha = 0; linha < this.tamanho; linha++){
            for(let coluna = 0; coluna < this.tamanho; coluna++){
                let quadrado = this.tabuleiro[linha][coluna]
                //console.log(quadrado.numero, quadrado.original, quadrado.flag)
                if ((quadrado.original === 'B') && (quadrado.flag === true)){
                    hits++
                }
            }
        }
        this.hits = hits
        return this.qtdBombas === this.hits ? true : false
    }

    //método que recebe um limite e gera coordenadas X e Y dentro do limite estipulado
    geraCoordenada(limite) {
        return {
            linha: Math.floor(Math.random() * limite),
            coluna: Math.floor(Math.random() * limite)
        }
    }

    //cria e insere um objeto Quadrado em cada posição do tabuleiro
    povoaTabuleiro(){
        let contador = 0
        for(let linha = 0; linha < this.tabuleiro.length; linha++){
            for (let coluna = 0; coluna < this.tabuleiro[linha].length; coluna++){

                let quadrado = new Quadrado()

                if ((linha + coluna) % 2 === 0 ){
                    quadrado.tomClaro = true
                    quadrado.classes.naoClicado = 'quadrado inicial-claro'
                    quadrado.classes.clicado = 'quadrado clicado-claro'
                } else {
                    quadrado.classes.naoClicado = 'quadrado inicial-escuro'
                    quadrado.classes.clicado = 'quadrado clicado-escuro'
                }
                quadrado.numero = contador++
                this.tabuleiro[linha][coluna] = quadrado
            }
        }
    }

    geraBombas(){
        //garante que ao redor do primeiro click esteja vazio para o jogador ter por onde começar a análise
        //nestes quadrados, preenche o conteúdo com a letra I (inicial).
        for(let linha = Math.max(0,this.inicio.linha - this.espacamento); linha < Math.min(this.inicio.linha + this.espacamento + 1,this.tamanho); linha++){
            for(let coluna = Math.max(0,this.inicio.coluna - this.espacamento); coluna < Math.min(this.inicio.coluna + this.espacamento + 1, this.tamanho); coluna++){
                this.tabuleiro[linha][coluna].conteudo = 'I'

            }
        }

        //enquanto houver bombas a serem colocadas, chama o metodo de geracao aleatorio de coordenadas
        //com a coordenada gerada, verifica se o quadrado está vazio. Se estiver, coloca uma mina
        let bombasColocadas = 0
        while (bombasColocadas < this.qtdBombas){
            let coordenada = this.geraCoordenada(this.tamanho)
            let conteudo = this.tabuleiro[coordenada.linha][coordenada.coluna].conteudo

            if (conteudo === ''){
                this.tabuleiro[coordenada.linha][coordenada.coluna].conteudo = 'B'
                this.tabuleiro[coordenada.linha][coordenada.coluna].original = 'B'
                bombasColocadas++
            }
        } 
    }

    verificaPosicao(linha, coluna){
        // dada uma matriz de 2 dimensões e uma coordenada, verifica se há uma bomba
        //retorna 1 se houver bomba e 0 se não houver
        let linhaValida = ((linha >= 0) && (linha < this.tamanho))
        let colunaValida = ((coluna)>= 0) && (coluna < this.tamanho)
    
        if (linhaValida && colunaValida){
            if (this.tabuleiro[linha][coluna].conteudo === 'B'){
                return 1
            }
        }
        return 0
    }

    //método que calcula o valor de cada célula após a colocacação das minas
    //visita cada quadrado e, se não houver mina, pesquisa os quadrados ao redor, e conta o número de minas
    calculaDicas(){
        let porExtenso = {0: '', 1: 'numero-um', 2: 'numero-dois', 3: 'numero-tres', 4: 'numero-quatro', 5: 'numero-cinco', 6: 'numero-seis'}
        for (let linha = 0; linha < this.tamanho; linha++){
            for (let coluna = 0; coluna < this.tamanho; coluna++){
                if (this.tabuleiro[linha][coluna].conteudo === 'B'){
                    continue
                }
                let noroeste = this.verificaPosicao(linha - 1, coluna - 1)
                let norte = this.verificaPosicao(linha - 1, coluna)
                let nordeste = this.verificaPosicao(linha - 1, coluna + 1)
                let oeste = this.verificaPosicao(linha , coluna - 1)
                let leste = this.verificaPosicao(linha , coluna + 1)
                let sudoeste = this.verificaPosicao(linha + 1, coluna - 1)
                let sul = this.verificaPosicao(linha + 1, coluna)
                let sudeste = this.verificaPosicao(linha + 1, coluna + 1)
    
                let total = noroeste + norte + nordeste + oeste + leste + sudoeste + sul + sudeste
                const conteudo = total > 0 ? total.toString() : ''
                this.tabuleiro[linha][coluna].conteudo = conteudo
                this.tabuleiro[linha][coluna].classes.clicado += ` ${porExtenso[total]}`
            }     
        }
    }

    getInfoQuadrado(coordenada){
        //console.log(`veio a coordenada `, coordenada)
        let linha = Number(coordenada.linha)
        let coluna = Number(coordenada.coluna)
        //console.log(`linha é ${linha} e coluna é ${coluna}`)
        return this.tabuleiro[linha][coluna]
    }

    formataTabuleiro(qtd, inicio){
        this.inicio = inicio
        this.qtdBombas = qtd
        this.geraBombas()
        this.calculaDicas()

    }

    verifica(coordenada){
        for(let linha = Math.max(0,coordenada.linha - 1); linha < Math.min(coordenada.linha + 2,this.tamanho); linha++){
            for(let coluna = Math.max(0, coordenada.coluna - 1); coluna < Math.min(coordenada.coluna + 2, this.tamanho); coluna++){
                if ((this.tabuleiro[linha][coluna].clicado === true) && (this.tabuleiro[linha][coluna].conteudo === '')){
                    return true
                }
            }
        }
        return false
    }

    libera(){
        for(let linha = 0; linha < this.tamanho; linha++){
            //console.log('de cima pra baixo')
            for(let coluna = 0; coluna < this.tamanho; coluna++){
                //console.log('esquerda pra direita')
                let coordenada = {linha: linha, coluna: coluna}
                if ((this.verifica(coordenada)) && (this.conteudo !== 'B')){
                    this.tabuleiro[linha][coluna].clicado = true
                }
            }

        for(let linha = this.tamanho - 1; linha >= 0; linha--){
            //console.log('de baixo para cima')
            for(let coluna = this.tamanho - 1; coluna >= 0; coluna--){
                let coordenada = {linha: linha, coluna: coluna}
                if ((this.verifica(coordenada)) && (this.conteudo !== 'B')){
                    this.tabuleiro[linha][coluna].clicado = true
                }
            }
        }

        }
    }        
    
    hasNeighborFlag(coordenada){
        let contador = 0
        for(let linha = Math.max(0,coordenada.linha - 1); linha < Math.min(coordenada.linha + 2,this.tamanho); linha++){
            for(let coluna = Math.max(0, coordenada.coluna - 1); coluna < Math.min(coordenada.coluna + 2, this.tamanho); coluna++){
                
                if ((this.tabuleiro[linha][coluna].clicado === false) && (this.tabuleiro[linha][coluna].conteudo === 'F')){
                    contador++
                }
            }
        }
        console.log(`Estou na linha ${coordenada.linha} e coluna ${coordenada.coluna}. Flags vizinhas ${contador}.`)
        return contador
    }

    corolarioLogico(coordenada){
        console.log('no corolario')
        let conteudoPermitido = ['1', '2', '3', '4', '5', '6']
        let conteudo = this.tabuleiro[coordenada.linha][coordenada.coluna].conteudo
        if (!conteudoPermitido.includes(conteudo)){
            return
        }
        console.log(`no corolario. Tem ${typeof this.hasNeighborFlag(coordenada)} flags`)
        if(+conteudo === this.hasNeighborFlag(coordenada)){
            console.log('tinha flag')
            for(let linha = Math.max(0,coordenada.linha - 1); linha < Math.min(coordenada.linha + 2,this.tamanho); linha++){
                for(let coluna = Math.max(0, coordenada.coluna - 1); coluna < Math.min(coordenada.coluna + 2, this.tamanho); coluna++){
                    if ((this.tabuleiro[linha][coluna].clicado === false) && (this.tabuleiro[linha][coluna].conteudo !== 'F')){
                        this.tabuleiro[linha][coluna].clicado = true
                        if (this.tabuleiro[linha][coluna].conteudo === 'B'){
                            return true
                        }
                    }
                }
            }
        }
        return false
    }

}



