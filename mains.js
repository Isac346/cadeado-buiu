// Seleção de elementos do DOM
const numeroSenha = document.querySelector('#numero-caracteres');
const campoSenha = document.querySelector('#campo-senha');
const botoes = document.querySelectorAll('.parametro-senha__botao');
const checkbox = document.querySelectorAll('.checkbox');
const forcaSenhaBarra = document.querySelector('#barra-forca-ativa');
const valorEntropia = document.querySelector('#texto-entropia');
const spanAnoAtual = document.querySelector('#ano-atual');

// Configuração inicial
let tamanhoSenha = 12;
numeroSenha.textContent = tamanhoSenha;

// Bancos de caracteres
const letrasMaiusculas = 'ABCDEFGHIJKLMNOPQRSTUVXYWZ';
const letrasMinusculas = 'abcdefghijklmnopqrstuvxywz';
const numeros = '0123456789';
const simbolos = '!@%*?+-_.&'; // Adicionei alguns símbolos comuns

// Atribuição de eventos
botoes[0].onclick = diminuiTamanho; // Botão -
botoes[1].onclick = aumentaTamanho; // Botão +

// Evento para checkboxes
for (let i = 0; i < checkbox.length; i++) {
    checkbox[i].onclick = geraSenha;
}

// Funções dos botões
function diminuiTamanho() {
    if (tamanhoSenha > 1) {
        tamanhoSenha--;
    }
    numeroSenha.textContent = tamanhoSenha;
    geraSenha();
}

function aumentaTamanho() {
    if (tamanhoSenha < 20) {
        tamanhoSenha++;
    }
    numeroSenha.textContent = tamanhoSenha;
    geraSenha();
}

// Função principal: Gerar a senha
function geraSenha() {
    let alfabeto = '';
    
    // Verificação dos checkboxes (usando os IDs definidos no HTML)
    if (document.querySelector('#check-maiusculo').checked) alfabeto += letrasMaiusculas;
    if (document.querySelector('#check-minusculo').checked) alfabeto += letrasMinusculas;
    if (document.querySelector('#check-numero').checked) alfabeto += numeros;
    if (document.querySelector('#check-simbolo').checked) alfabeto += simbolos;

    let senha = '';
    
    // Se nenhum checkbox estiver marcado, limpa o campo
    if (alfabeto.length === 0) {
        campoSenha.value = '';
        classificaSenha(0);
        valorEntropia.textContent = "Selecione pelo menos uma característica.";
        return;
    }

    // Geração aleatória
    for (let i = 0; i < tamanhoSenha; i++) {
        let numeroAleatorio = Math.floor(Math.random() * alfabeto.length);
        senha += alfabeto[numeroAleatorio];
    }
    
    campoSenha.value = senha;
    classificaSenha(alfabeto.length);
}

// Função de classificação da força da senha (Entropia)
function classificaSenha(tamanhoAlfabeto) {
    if (tamanhoAlfabeto === 0) {
        forcaSenhaBarra.style.width = '0%';
        forcaSenhaBarra.classList.remove('fraca', 'media', 'forte');
        return;
    }

    // Cálculo da entropia
    let entropia = tamanhoSenha * Math.log2(tamanhoAlfabeto);
    
    // Reseta classes e define largura baseada na entropia (máximo aprox 130 para 20 chars)
    forcaSenhaBarra.classList.remove('fraca', 'media', 'forte');
    
    // Limita a largura visual para 100%
    let larguraVisual = Math.min((entropia / 100) * 100, 100);
    forcaSenhaBarra.style.width = `${larguraVisual}%`;

    // Lógica de classificação
    if (entropia > 57) {
        forcaSenhaBarra.classList.add('forte');
    } else if (entropia > 35) {
        forcaSenhaBarra.classList.add('media');
    } else {
        forcaSenhaBarra.classList.add('fraca');
    }

    // Texto descritivo
    let diasParaQuebrar = Math.floor(2 ** entropia / (100e6 * 60 * 60 * 24));
    
    if (diasParaQuebrar < 1) {
        valorEntropia.textContent = "Um computador pode levar instantes para descobrir essa senha.";
    } else {
        valorEntropia.textContent = "Um computador pode levar até " + diasParaQuebrar + " dias para descobrir essa senha.";
    }
}

// Adiciona o ano atual no footer
if (spanAnoAtual) {
    spanAnoAtual.textContent = new Date().getFullYear();
}

// Gera a primeira senha ao carregar a página
geraSenha();
