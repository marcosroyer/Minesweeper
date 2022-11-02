const modal = document.getElementById("modal")
const btnClose = document.getElementById("btnClose")

const btnTabuleiro = document.getElementById('btnTabuleiro')
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

btnClose.addEventListener('click', (event)=>{
    modal.style.display = "none"
})

document.addEventListener("DOMContentLoaded", (event)=> {
    desenhaTabuleiro(16) //tamanho padrão
    modal.style.display = "block"
});

let escolhido = 'Normal'

function criaTabuleiro(){
    if (tabuleiro != null){
        tabuleiro = new Tabuleiro(nivel[escolhido].tamanho)
    }
}


let formEscolha = document.getElementById('formulario')
formEscolha.addEventListener('change', (event)=>{
    faxina()
    //criaTabuleiro()
    
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
    console.log(escolhido)
    counterFlag.innerText = nivel[escolhido].qtd
    desenhaTabuleiro(nivel[escolhido].tamanho)
})
console.log(escolhido)
//let tabuleiro = new Tabuleiro(nivel[escolhido].tamanho)


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



function handleOneClick(event){
    //cada quadrado tem como id a expressão 'x|y', onde x = linha e y = coluna
    //o código obtem o id e transforma em um objeto com as coordenadas para pesquisar no tabuleiro
    let posicao = event.target.id.split('|')
    let coordenada = {linha: Number(posicao[0]), coluna: Number(posicao[1])}

    //se já houver flag marcada, não faz nada
    if (tabuleiro.tabuleiro[coordenada.linha][coordenada.coluna].flag === true) return

    //se ainda não começou o jogo, marca o início, gera as bombas e inicia o cronômetro
    if (tabuleiro.started === false){
        tabuleiro.started = true
        tabuleiro.formataTabuleiro(nivel[escolhido].qtd, coordenada) 
        crono.start(printTime)
    }
    
    //marca o quadrado como clicado lá no tabuleiro
    tabuleiro.tabuleiro[coordenada.linha][coordenada.coluna].clicado = true
    //se no quadrado clicado existir uma mina, avisa ao jogador que ele perdeu, renderiza a tela
    //apaga tudo e redesenha o tabuleiro
    //se não tiver mina, verifica se clicou em espaço em branco e revela os quadrados ao redor. Renderiza a tela.
    if (tabuleiro.tabuleiro[coordenada.linha][coordenada.coluna].conteudo === 'B'){
        renderiza(true)
        alert('Você PERDEUUUUUUU!')  
        faxina()  
        desenhaTabuleiro(nivel[escolhido].tamanho)
    } else {
        tabuleiro.libera()
        renderiza(false)
    }

}

function handleRightClick(event){
    if (tabuleiro.started === false) return

    event.preventDefault()
    let posicao = event.target.id.split('|')
    let coordenada = {linha: Number(posicao[0]), coluna: Number(posicao[1])}
    let info = tabuleiro.getInfoQuadrado(coordenada)

    
    if (info.clicado === false){
        let spanContador = document.getElementById('counterFlag')
        let contador = Number(spanContador.innerText)
        let elemento = document.getElementById(`${coordenada.linha}|${coordenada.coluna}`)
        
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
    console.log(tabuleiro.hits)
    if (tabuleiro.checkForWin() === true){
        faxina()
        alert('GANHOU !!!!')
        desenhaTabuleiro(nivel[escolhido].tamanho)
        
    }
    

}





function desenhaTabuleiro(tamanho){

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


function handleDblClick(event){
    console.log('duplo')
    let posicao = event.target.id.split('|')
    let coordenada = {linha: Number(posicao[0]), coluna: Number(posicao[1])}
    let resultado = tabuleiro.corolarioLogico(coordenada)
    console.log(`o resultado é ${resultado}`)
    if (resultado === true){
        renderiza(true)
        alert('Você PERDEUUUUUUU!')  
        faxina()  
        desenhaTabuleiro(nivel[escolhido].tamanho)
        return
    }
    renderiza(false)
}


function renderiza(terminou){
    console.log('no renderiza')
    for(let linha = 0; linha < nivel[escolhido].tamanho; linha++){
        for(let coluna = 0; coluna < nivel[escolhido].tamanho; coluna++){
            let elemento = document.getElementById(`${linha}|${coluna}`)
            let coordenada = {linha: linha, coluna: coluna}
            let info = tabuleiro.getInfoQuadrado(coordenada)
            if(terminou){
                elemento.innerHTML = info.conteudo === 'B' ? '&#128163;' : info.conteudo
            } else {
                elemento.innerHTML = info.conteudo === 'F'? '&#128681;' : info.conteudo
            }
            
            if ((info.clicado !== true) || (info.conteudo === 'F')){
                elemento.setAttribute('class',info.classes.naoClicado)
            } else {
                elemento.setAttribute('class',info.classes.clicado)
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