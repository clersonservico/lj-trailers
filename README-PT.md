# LJ Trailers com diagnóstico por IA

## Incluído
- Website LJ Trailers com formulário de diagnóstico ligado ao servidor.
- Envio de fotografia e descrição para análise visual por IA.
- Resultado preliminar: avaria provável, gravidade, recomendação e itens relevantes do catálogo.
- Chave da API guardada no servidor, nunca no HTML.

## Executar
1. Instale Node.js 20 ou superior.
2. Na pasta do projecto, execute `npm install`.
3. Copie `.env.example` para `.env`.
4. Coloque a chave API em `OPENAI_API_KEY` dentro de `.env`.
5. Execute `npm start` e abra `http://localhost:3000`.

## Antes de publicar
- Configure domínio e HTTPS.
- O PIN administrativo 1234 é apenas demonstração; substitua por autenticação segura.
- O catálogo e os pedidos ainda usam armazenamento local do navegador. Para operação real multiutilizador, integrar base de dados e autenticação.
- Configure limites de utilização, política de privacidade e consentimento para fotografias.
- A IA é uma triagem preliminar, não substitui a inspecção de um técnico.
- A API exige chave e facturação activa; nenhuma chave está incluída.
