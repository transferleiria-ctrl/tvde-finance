# Politicas de Seguranca do tvde-finance

## Responsaveis
- Admin principal: carloslucaspt2023@gmail.com

## Medidas de Seguranca Implementadas

### Autenticacao
- Google OAuth 2.0 (OAuth2)
- Firebase Auth com validacao de ID token
- Email obrigatorio para todos os usuarios

### Dados
- Firestore Security Rules com isolamento por UID
- Cada usuario so acessa seus proprios dados
- Admin (carloslucaspt2023@gmail.com) tem acesso total
- Schema validation em todos os writes
- Previne escalonamento de privilegios

### Headers de Seguranca (CSP)
- X-Frame-Options: DENY (previne clickjacking)
- X-Content-Type-Options: nosniff
- X-XSS-Protection: 1; mode=block
- Referrer-Policy: strict-origin-when-cross-origin
- Permissions-Policy: geolocation/microphone/camera bloqueados
- Content-Security-Policy: restrito a self e Google/Firebase

### Firebase Storage
- Validacao de tipo de arquivo (apenas imagens)
- Tamanho maximo: 5MB
- Isolamento por UID para fotos de perfil

### Variaveis de Ambiente
- Configuracao Firebase via .env (NUNCA hardcoded)
- .env.example com placeholders
- .env no .gitignore

### CI/CD Seguro
- GitHub Actions com build antes do deploy
- Lint TypeScript no pipeline
- Nao expoe secrets nos logs

## Reportar Vulnerabilidade

Se encontrar uma vulnerabilidade de seguranca, envie um email para:
carloslucaspt2023@gmail.com

Nao divulgue publicamente a vulnerabilidade antes de ser corrigida.
