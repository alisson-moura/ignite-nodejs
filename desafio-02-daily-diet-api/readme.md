# Daily Diet API

Este é um projeto de API para controle de dieta diária, a Daily Diet API, desenvolvido em Node.js, TypeScript, Knex e Zod.

## Requisitos da Aplicação

Nesse desafio, a API deve atender aos seguintes requisitos:

### Requisitos Funcionais

1. **Cadastro de Usuário**
   - A aplicação deve permitir o cadastro de usuários.

2. **Identificação de Usuário**
   - A aplicação deve fornecer mecanismos para identificar os usuários entre as requisições.

3. **Registro de Refeição**
   - Os usuários devem ser capazes de registrar informações sobre uma refeição, incluindo nome, descrição, data e hora, e se ela está dentro ou fora da dieta.

4. **Edição de Refeição**
   - Os usuários devem poder editar informações de uma refeição, incluindo nome, descrição, data e hora, e status da dieta.

5. **Exclusão de Refeição**
   - Deve ser possível excluir uma refeição registrada.

6. **Listagem de Refeições**
   - Os usuários devem poder listar todas as refeições que eles registraram.

7. **Visualização de Refeição**
   - Os usuários devem poder visualizar os detalhes de uma refeição específica.

8. **Recuperação de Métricas do Usuário**
   - Os usuários devem poder obter informações sobre suas métricas, incluindo a quantidade total de refeições registradas, a quantidade de refeições dentro e fora da dieta, e a melhor sequência de refeições dentro da dieta.

9. **Restrição de Acesso**
   - Os usuários só podem visualizar, editar e apagar as refeições que eles criaram.

### Regras de Negócios

1. **Refeições Relacionadas a Usuários**
   - Todos os registros de refeições devem estar relacionados a um usuário específico.

2. **Acesso Controlado**
   - Os usuários só podem visualizar, editar e apagar as refeições que eles criaram. Isso implica que a API deve implementar mecanismos de autenticação e autorização para garantir o acesso controlado.

### Requisitos Não Funcionais

1. **Segurança**
   - A API deve implementar medidas de segurança, como autenticação e autorização, para proteger os dados dos usuários.

2. **Desempenho**
   - A API deve ser eficiente e responsiva, especialmente ao recuperar métricas para evitar atrasos significativos.

3. **Escalabilidade**
   - A aplicação deve ser capaz de lidar com um número crescente de usuários e refeições à medida que o sistema cresce.

4. **Usabilidade**
   - A API deve ser projetada com interfaces de usuário claras e documentação adequada para facilitar o uso e a compreensão.

5. **Manutenibilidade**
   - O código da API deve ser bem organizado e documentado para facilitar a manutenção e futuras atualizações.

## Requisitos
- Git
- Node.js: [link para o download](https://nodejs.org/)
- Outras dependências: Execute `npm install` para instalar todas as dependências do projeto.

## Configuração

1. Clone o repositório:

```shell
git clone https://github.com/seu-usuario/daily-diet-api.git
cd daily-diet-api
npm install
```

2. Configure as variáveis de ambiente:

Crie um arquivo .env na raiz do projeto.
Copie o conteúdo do arquivo .env.example para .env.
Edite as variáveis de ambiente no arquivo .env conforme necessário.

3. Crie o banco de dados
```shell
npm run knex migrate:latest
```
4. Inicie o servidor
```shell
npm run dev
```
A API estará disponível em http://localhost:3000.