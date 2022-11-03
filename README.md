# Campo Minado (Minesweeper)

Este é um clone do clássico jogo Campo Minado, criado em 1989 por Robert Donner e imortalizado pela Microsoft ao incluí-lo por padrão no sistema operacional Windows.

O jogo aqui apresentado tenta ser um clone da [versão disponível no Google](https://g.co/kgs/pxpNXw).

A versão por mim elaborada foi feita como requisito/avaliação do curso de web development da [Ironhack](https://www.ironhack.com/br) e por ser acessada [neste link](https://marcosroyer.github.io/Minesweeper/).

O **código fonte** pode ser encontrado neste [repositório](https://github.com/marcosroyer/Minesweeper).

Os slides da apresentação do jogo encontram-se neste [link](https://docs.google.com/presentation/d/1RTUhjBpFnUzyVeIRLOuWgHisTPsObA3LcI_fX19ZQH0/edit?usp=sharing).

# Regras do jogo

A ideia do jogo é simular um campo minado. O objetivo do jogador (e, portanto, modo de vitória) é identificar em quais quadrados estão as minas. O jogo é iniciado com um clique do jogador em qualquer lugar do campo. O primeiro clique abrirá um território vazio e é garantido ao jogador que não será clicado em uma mina. 

Os quadrados já revelados podem ter informação sobre sua vizinhança. Isto é, se o conteúdo revelado for o número 1, é certo que ao redor deste quadrado existe somente uma mina. Se o conteúdo for o número 2, duas minas. A lógica permanece para os demais números. Portanto, se um quadrado indicar o número 1 e ao redor dele todos os outros quadrados já foram revelados, com exceção de um único, é possível afirmar que neste quadrado não revelado encontra-se uma mina.

Utilize o botão esquerdo do mouse para revelar o conteúdo de um quadrado.

Utilize o botão direito do mouse para marcar o local com uma bandeira indicativa de existência de uma mina.

Dois cliques com o botão esquerdo podem ser utilizados para revelar todos os quadrados adjacentes, desde que ao redor do quadrado clicado haja bandeiras em número idêntico ao conteúdo do quadrado. Ou seja, se o quadrado tem o número 2 e há duas bandeiras ao redor, os outros 6 quadrados serão revelados. Se existir uma mina nos quadrados a serem revelados (erro de lógica do jogador), ela será disparada e o jogador perde.
