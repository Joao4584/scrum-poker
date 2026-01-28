# Scrum Poker

## Migrations (API)

### Criar uma migration
```bash
pnpm --filter api typeorm migration:generate ./src/infrastructure/migrations/AddCharacterKey
```

### Rodar as migrations
```bash
pnpm --filter api typeorm migration:run
```

