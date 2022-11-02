const modal = document.getElementById("modal")
const endModal = document.getElementById("modalEnd")
const btnClose = document.getElementById("btnClose")
const btnCloseEnd = document.getElementById("btnCloseEnd")
const btnPlayAgain = document.getElementById("playAgain")
const btnTabuleiro = document.getElementById('btnTabuleiro')
const resultadoJogo = document.getElementById("resultado")
const minUni = document.getElementById('minUni')
const minDec = document.getElementById('minDec')
const secUni = document.getElementById('secUni')
const secDec = document.getElementById('secDec')
let tabuleiro = null
const crono = new Chronometer()
const nivel = {
    'Fácil': {tamanho: 8, qtd: 10},
    'Normal': {tamanho: 16, qtd: 40},
    'Difícil': {tamanho: 20, qtd: 64}
}
let escolhido = 'Normal'
const formEscolha = document.getElementById('formulario')

//ao ler o DOM, chama o método para desenhar o tabuleiro e o método modal para explicar as regras do jogo
document.addEventListener("DOMContentLoaded", (event)=> {
    desenhaTabuleiro(16) //tamanho padrão
    modal.style.display = "block"
});

//adiciona event listener no botão fechar da janela modal
btnClose.addEventListener('click', (event)=>{
    modal.style.display = "none"
})

//adiciona event listener no botão fechar da janela modal
btnCloseEnd.addEventListener('click', (event)=>{
    endModal.style.display = "none"
})

//adiciona event listener no botão play again
btnPlayAgain.addEventListener('click', (event)=>{
    endModal.style.display = "none"
    faxina()
    desenhaTabuleiro(nivel[escolhido].tamanho)
})


function criaTabuleiro(){
    if (tabuleiro != null){
        tabuleiro = new Tabuleiro(nivel[escolhido].tamanho)
    }
}

//se o jogador muda o nível de jogo, limpa a tela e configura as classes CSS dos quadrados
//desenha tabuleiro com base no nível
formEscolha.addEventListener('change', (event)=>{
    faxina()
    
    let escolha = event.target.value
    let divJogo = document.getElementById('jogo')
    let divInfo = document.getElementById('info')

    if (escolha === 'Fácil'){
        divJogo.setAttribute('class','facil')
        divInfo.setAttribute('class', 'info menor')
    } else if (escolha === 'Difícil'){
        divJogo.setAttribute('class','dificil')
        divInfo.setAttribute('class', 'info padrao')
    } else {
        divJogo.setAttribute('class','normal')
        divInfo.setAttribute('class', 'info padrao')
    }
    escolhido = escolha

    counterFlag.innerText = nivel[escolhido].qtd
    desenhaTabuleiro(nivel[escolhido].tamanho)
})


//método que arruma a parte gráfica
//para cronômetro, reseta cronômentro, atualiza placar, apaga os quadrados, reseta o tabuleiro
function faxina(){
    crono.stop()
    crono.reset()
    printTime()
    let componente = document.getElementById('tabuleiro')
    while (componente.firstChild){
        componente.firstChild.remove()
    }
    tabuleiro = null
    let counterFlag = document.getElementById('counterFlag')
    counterFlag.innerText = nivel[escolhido].qtd
}

//lida com o click no botão esquerdo do mouse
function handleOneClick(event){

    let posicao = event.target.id.split('|')
    let coordenada = {linha: Number(posicao[0]), coluna: Number(posicao[1])}

    //se já tem bandeira colocada, interrompe
    if (tabuleiro.tabuleiro[coordenada.linha][coordenada.coluna].flag === true) return

    //se o jogo não começou, inicia o jogo, cria um tabuleiro novo e inicia o cronômetro
    if (tabuleiro.started === false){
        tabuleiro.started = true
        tabuleiro.formataTabuleiro(nivel[escolhido].qtd, coordenada) 
        crono.start(printTime)
    }
    
    //configura o quadrado como clicado
    //verifica se clicou em uma mina. Se clicou, renderiza a tela, avisa que perdeu, faxina e redesenha a tela.
    //se nao clicou em mina, verifica se clicou em local vazio para liberar e renderiza tela novamente
    tabuleiro.tabuleiro[coordenada.linha][coordenada.coluna].clicado = true
    if (tabuleiro.tabuleiro[coordenada.linha][coordenada.coluna].conteudo === 'B'){
        crono.stop()
        renderiza(true)
        resultadoJogo.innerText = "Você perdeu!"
        endModal.style.display = "block"

    } else {
        tabuleiro.libera()
        renderiza(false)
    }

}

//lida com o clique do botão direito do mouse
function handleRightClick(event){
    //se nao começou o jogo, nada faz
    if (tabuleiro.started === false) return

    event.preventDefault()
    let posicao = event.target.id.split('|')
    let coordenada = {linha: Number(posicao[0]), coluna: Number(posicao[1])}
    let info = tabuleiro.getInfoQuadrado(coordenada)

    //só pode colocar bandeira se ainda não foi clicado
    if (info.clicado === false){
        let spanContador = document.getElementById('counterFlag')
        let contador = Number(spanContador.innerText)
        let elemento = document.getElementById(`${coordenada.linha}|${coordenada.coluna}`)
        
        //verifica se já tem uma bandeira. Se tem, retira. Se não, coloca.
        if (tabuleiro.tabuleiro[coordenada.linha][coordenada.coluna].conteudo === 'F'){
            contador++
            elemento.innerHTML = info.anterior
            tabuleiro.tabuleiro[coordenada.linha][coordenada.coluna].conteudo = info.anterior
            tabuleiro.tabuleiro[coordenada.linha][coordenada.coluna].anterior = ''
            tabuleiro.tabuleiro[coordenada.linha][coordenada.coluna].flag = false
             
        } else {
            contador--
            tabuleiro.tabuleiro[coordenada.linha][coordenada.coluna].anterior = tabuleiro.tabuleiro[coordenada.linha][coordenada.coluna].conteudo
            tabuleiro.tabuleiro[coordenada.linha][coordenada.coluna].conteudo = 'F'
            tabuleiro.tabuleiro[coordenada.linha][coordenada.coluna].flag = true
            elemento.innerHTML = '&#128681;'
        }
        spanContador.innerText = contador
    }
    
    //verifica se ganhou. Se sim, limpa o tabuleiro, avisa que ganhou e redesenha o tabuleiro.
    if (tabuleiro.checkForWin() === true){
        crono.stop()
        renderiza(true)
        resultadoJogo.innerText = "Você ganhou!"
        endModal.style.display = "block"
        
    }
    

}


//método que desenha o tabuleiro, criando as divs e colocando event listeners
function desenhaTabuleiro(tamanho){
    //se o objeto tabuleiro é nulo, cria um.
    if (tabuleiro === null){
        tabuleiro = new Tabuleiro(nivel[escolhido].tamanho)
    }
    let componente = document.getElementById('tabuleiro')
    let classeTamanho = nivel[escolhido].tamanho === 20 ? 'tamanho-menor' : 'tamanho'
    for(let linha = 0; linha < tamanho; linha++){
        let line = document.createElement('div')  
        line.setAttribute('class', 'linha')  
        for(let coluna = 0; coluna < tamanho; coluna++){
            let coordenada = {linha: linha, coluna: coluna}
            let classe = tabuleiro.getInfoQuadrado(coordenada).classes.naoClicado
            let quadrado = document.createElement('div')
            quadrado.setAttribute('class', classe)
            quadrado.classList.add(classeTamanho)
            quadrado.setAttribute('id',`${linha}|${coluna}`)
            quadrado.addEventListener('click', handleOneClick)
            quadrado.addEventListener('dblclick', handleDblClick)
            quadrado.addEventListener('contextmenu', handleRightClick)
            line.appendChild(quadrado)
        }
        componente.appendChild(line) 
    }

}

//método que lida com o clique duplo
function handleDblClick(event){
    
    let posicao = event.target.id.split('|')
    let coordenada = {linha: Number(posicao[0]), coluna: Number(posicao[1])}
    
    //chama o método que abre os quadrados ao redor, por ordem do jogador...
    let resultado = tabuleiro.corolarioLogico(coordenada)
    
    //...mas, se um dos quadrados tiver uma mina (retorno igual a true), o jogador perde.
    if (resultado === true){
        crono.stop()
        renderiza(true)
        resultadoJogo.innerText = "Você perdeu!"
        endModal.style.display = "block"
        return
    }
    renderiza(false)
}

//método que redesenha a tela após cada ação do jogador
function renderiza(terminou){
    
    for(let linha = 0; linha < nivel[escolhido].tamanho; linha++){
        for(let coluna = 0; coluna < nivel[escolhido].tamanho; coluna++){
            let elemento = document.getElementById(`${linha}|${coluna}`)
            let coordenada = {linha: linha, coluna: coluna}
            let info = tabuleiro.getInfoQuadrado(coordenada)
            /*if(terminou){
                elemento.innerHTML = info.conteudo === 'B' ? '&#128163;' : info.conteudo
            } else {
                elemento.innerHTML = info.conteudo === 'F'? '&#128681;' : info.conteudo
            }*/
            
            if(terminou === true){
                elemento.innerHTML = ((info.conteudo === 'B') ||  (info.conteudo === 'F')) ? '&#128163;' : info.conteudo
                console.log(`${coordenada.linha} e ${coordenada.coluna} conteudo foi: ${info.conteudo}.`)
                elemento.setAttribute('class',info.classes.clicado)
            } else {
                
                if ((info.clicado !== true) || (info.conteudo === 'F')){
                    elemento.setAttribute('class',info.classes.naoClicado)
                } else {
                    elemento.setAttribute('class',info.classes.clicado)
                    elemento.innerHTML = info.conteudo 
                }

            }
            let classeTamanho = nivel[escolhido].tamanho === 20 ? 'tamanho-menor' : 'tamanho'
            elemento.classList.add(classeTamanho)
        }
    }

}

function printTime() {
    printMinutes();
    printSeconds();

  }
  
  function printMinutes() {
    minUni.innerHTML = crono.computeTwoDigitNumber(crono.getMinutes())[1];
    minDec.innerHTML = crono.computeTwoDigitNumber(crono.getMinutes())[0];
  }
  
  function printSeconds() {
    secUni.innerHTML = crono.computeTwoDigitNumber(crono.getSeconds())[1];
    secDec.innerHTML = crono.computeTwoDigitNumber(crono.getSeconds())[0];
  }