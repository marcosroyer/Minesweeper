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
    if (escolha === 'Fácil'){
        divJogo.setAttribute('class','facil')
    } else if (escolha === 'Difícil'){
        divJogo.setAttribute('class','dificil')
    } else {
        divJogo.setAttribute('class','normal')
    }
    escolhido = escolha
    console.log(escolhido)
    let counterFlag = document.getElementById('counterFlag')
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

}



function handleOneClick(event){

    let posicao = event.target.id.split('|')
    let coordenada = {linha: Number(posicao[0]), coluna: Number(posicao[1])}

    if (tabuleiro.tabuleiro[coordenada.linha][coordenada.coluna].flag === true) return

    if (tabuleiro.started === false){
        tabuleiro.started = true
        let counterFlag = document.getElementById('counterFlag').innerText = nivel[escolhido].qtd
        tabuleiro.formataTabuleiro(nivel[escolhido].qtd, coordenada) //atualizar com nivel de dificuldade
        crono.start(printTime)


    }
    
    tabuleiro.tabuleiro[coordenada.linha][coordenada.coluna].clicado = true
    if (tabuleiro.tabuleiro[coordenada.linha][coordenada.coluna].conteudo === 'B'){
        renderiza(true)
        alert('Você PERDEUUUUUUU!')  
        faxina()  
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
        console.log(tabuleiro.tabuleiro[coordenada.linha][coordenada.coluna].conteudo)
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
        
    }
    

}





function desenhaTabuleiro(tamanho){
    if (tabuleiro === null){
        tabuleiro = new Tabuleiro(nivel[escolhido].tamanho)
    }
    let componente = document.getElementById('tabuleiro')
    for(let linha = 0; linha < tamanho; linha++){
        let line = document.createElement('div')  
        line.setAttribute('class', 'linha')  
        for(let coluna = 0; coluna < tamanho; coluna++){
            let coordenada = {linha: linha, coluna: coluna}
            let classe = tabuleiro.getInfoQuadrado(coordenada).classes.naoClicado
            let quadrado = document.createElement('div')
            quadrado.setAttribute('class', classe)
            quadrado.setAttribute('id',`${linha}|${coluna}`)
            quadrado.addEventListener('click', handleOneClick)
            quadrado.addEventListener('contextmenu', handleRightClick)
            line.appendChild(quadrado)
        }
        componente.appendChild(line) 
    }
}

btnTabuleiro.addEventListener('click', () =>{

    desenhaTabuleiro(nivel[escolhido].tamanho) //arrumar tamanho
})

function renderiza(terminou){
    //console.log('no renderiza')
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
            
            if (info.clicado === true){
                elemento.setAttribute('class',info.classes.clicado)
            } else {
                elemento.setAttribute('class',info.classes.naoClicado)
            }
            
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