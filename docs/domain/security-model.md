# Modelo de segurança

Dois eixos independentes: **classificação** (sensibilidade do conteúdo) e
**permissões** (quem pode fazer o quê).

## Classificação (`Classification`)
| Nível          | Cor/tom   | Quem vê por padrão |
|----------------|-----------|--------------------|
| `publico`      | esmeralda | Todos |
| `interno`      | brand/índigo | Colaboradores autenticados |
| `confidencial` | âmbar     | Departamento dono + concedidos |
| `restrito`     | rosa/vermelho | Apenas explicitamente concedidos |

## Papéis (`Role`)
- `admin` — vê tudo, gerencia permissões e conectores.
- `editor` — cria/edita documentos do seu departamento.
- `leitor` — apenas visualiza o que lhe foi concedido.

## Permissões (`Permission`)
`{ subjectType: 'user' | 'role' | 'department', subjectId, level }`
com `level ∈ view < download < edit < owner` (ordem crescente de poder).

### Regra de acesso efetivo (pseudocódigo)
```
podeVer(user, doc):
  if user.role == 'admin': return true
  if doc.classification == 'publico': return true
  if doc.classification == 'interno' and user.autenticado: return true
  return existePermissao(user, doc, nivel >= 'view')
```

> No mock, `services/documents` já expõe helpers de acesso efetivo para a UI
> pintar cadeados e esconder o botão de download quando faltar permissão.
