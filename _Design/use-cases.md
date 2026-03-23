# Use cases

## Player earns money in game to purse

```http
PATCH /api/player/:uuid
{
  amount: 999
}
```

## Player dies with X in their purse

```http
POST /api/player/:uuid/death
```

## Player opens bank account

```http
POST /api/accounts

{
  ...creationAttributes
}
```

## Player deposits X from purse to bank account

```http
POST /api/player/:uuid/deposit

{
  amount: XXX,
}
```

## Player withdrawals X from bank account to purse

```http
POST /api/player/:uuid/withdraw

{
  amount: XXX,
}
```
