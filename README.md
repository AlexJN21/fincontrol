
# FinControl — Controle financeiro pessoal

Aplicação web responsiva para registrar receitas e despesas, acompanhar o saldo disponível e visualizar os gastos por categoria. Projeto de portfólio desenvolvido com HTML, CSS e JavaScript puro.

> **Status:** projeto de estudo/portfólio. Os dados são armazenados somente no navegador por meio de `localStorage`; não há integração bancária nem sincronização entre dispositivos.

## Demonstração

- **Aplicação online:** `(https://alexjn21.github.io/fincontrol/)`
- **Repositório:** `(https://github.com/AlexJN21/fincontrol)`
- **Captura de tela:** adicione uma imagem da aplicação em `<img width="1366" height="768" alt="Captura de Tela (7)" src="https://github.com/user-attachments/assets/18319689-6552-4ee9-a44e-84f199149361" />` e descomente a linha abaixo.

<!-- ![Prévia do FinControl](assets/fincontrol-preview.png) -->

## Funcionalidades

- Definir e salvar o saldo inicial disponível.
- Cadastrar, editar e excluir receitas e despesas.
- Categorias próprias para entradas e saídas.
- Calcular saldo atual, receitas do mês, despesas do mês e taxa de economia.
- Pesquisar transações por descrição, categoria ou observação.
- Filtrar transações por tipo.
- Resumir despesas por categoria.
- Guardar os dados localmente com `localStorage`.
- Interface adaptável a celulares, tablets e computadores.
- Validar campos básicos antes de salvar uma movimentação.

## Tecnologias e conceitos praticados

- **HTML5:** estrutura semântica, formulários, rótulos e acessibilidade básica.
- **CSS3:** Flexbox, Grid, variáveis CSS, media queries e layout responsivo.
- **JavaScript:** DOM, eventos, funções, arrays, objetos, filtros, cálculos, validação, JSON e `localStorage`.
- **Git e GitHub:** versionamento e publicação do código (após configurar o repositório).

## Como executar localmente

1. Baixe ou clone este repositório.
2. Abra a pasta no Visual Studio Code.
3. Abra `index.html` no navegador ou use a extensão Live Server.
4. Informe seu saldo inicial e registre algumas transações de teste.

Não é necessário instalar dependências ou configurar um servidor para a versão atual.

## Estrutura de arquivos

```text
fincontrol/
├── index.html
├── css/
│   └── style.css
├── js/
│   └── app.js
├── assets/                 # opcional: capturas de tela do projeto
├── .gitignore
└── README.md
```

## Como o saldo é calculado

`Saldo atual = saldo inicial + receitas registradas − despesas registradas`

Os cartões de receitas, despesas e a distribuição por categoria consideram o mês atual. O saldo atual considera todas as transações cadastradas.

## Limitações conhecidas

- As informações ficam no `localStorage` do navegador utilizado. Não são sincronizadas entre dispositivos e podem ser apagadas se os dados do navegador forem removidos.
- Não há login, banco de dados, integração com bancos, exportação ou backup automático.
- Esta versão é uma ferramenta simples de organização pessoal, não substitui extratos bancários ou orientação financeira.
- Evite inserir senhas, dados de cartão ou outras informações sensíveis.

## Próximas melhorias

- [ ] Exportar e importar transações em CSV.
- [ ] Definir orçamento mensal por categoria.
- [ ] Adicionar metas financeiras e vencimentos.
- [ ] Criar testes automatizados.
- [ ] Melhorar navegação por teclado e auditoria de acessibilidade.
- [ ] Avaliar uma API e banco de dados para sincronização entre dispositivos.

## Uso no portfólio

Este projeto demonstra a construção de uma aplicação front-end com operações CRUD (criar, consultar, atualizar e excluir), tratamento de formulários, persistência local e apresentação responsiva de dados.

**Descrição curta para a página do portfólio:**

> FinControl é uma aplicação responsiva de controle financeiro pessoal. Permite registrar e gerenciar receitas e despesas, definir um saldo inicial, pesquisar movimentações e acompanhar gastos por categoria. Desenvolvida com HTML, CSS e JavaScript, utilizando `localStorage` para persistência no navegador.

