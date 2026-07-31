// Busca por contexto (semântica) leve — roda no cliente, sem backend.
// Expande a consulta com sinônimos em pt-BR para casar por significado, não só por
// substring. É uma simulação; a versão real usaria embeddings do conteúdo indexado.

const STOPWORDS = new Set([
  "de", "da", "do", "das", "dos", "e", "o", "a", "os", "as", "um", "uma", "para",
  "por", "com", "no", "na", "em", "que", "qual", "quais", "quanto", "quanta",
  "como", "onde", "quando", "ao", "aos", "à", "às", "se", "sobre", "este", "esse",
  "esta", "essa", "meu", "minha", "seu", "sua", "ser", "tem", "the", "of",
]);

// Mapa de sinônimos/contexto: termo da consulta → termos relacionados no acervo.
const SYNONYMS: Record<string, string[]> = {
  investir: ["capex", "investimento", "orcamento"],
  investimento: ["capex", "orcamento", "receita"],
  orcamento: ["capex", "investimento", "financeiro", "custo"],
  proximo: ["2027"],
  ano: ["2027", "anual"],
  futuro: ["2027", "estrategico"],
  multa: ["atraso", "clausula", "penalidade"],
  penalidade: ["multa", "atraso"],
  atraso: ["multa", "prazo", "entrega"],
  prazo: ["vigencia", "prorrogacao", "renovacao", "entrega"],
  vencimento: ["vigencia", "prazo", "renovacao"],
  vigencia: ["prazo", "prorrogacao", "renovacao"],
  fornecedor: ["fornecimento", "contrato", "vale", "verde"],
  imposto: ["nfe", "nota", "fiscal", "tributo"],
  impostos: ["nfe", "nota", "fiscal", "tributo"],
  nota: ["nfe", "fiscal", "imposto"],
  salario: ["holerite", "folha", "proventos", "descontos", "contracheque"],
  pagamento: ["holerite", "folha", "proventos", "descontos"],
  contracheque: ["holerite", "folha", "proventos"],
  remoto: ["home", "office", "hibrido", "desconexao", "teletrabalho"],
  casa: ["home", "office", "hibrido", "remoto"],
  teletrabalho: ["home", "office", "hibrido", "remoto"],
  reuniao: ["ata", "diretoria", "deliberacao"],
  decisao: ["ata", "diretoria", "deliberacao", "estrategia"],
  decisoes: ["ata", "diretoria", "deliberacao", "estrategia"],
  galpao: ["logistico", "docas", "armazenagem", "planta"],
  deposito: ["galpao", "logistico", "armazenagem"],
  marca: ["identidade", "visual", "logotipo", "tipografia", "cores"],
  logo: ["logotipo", "marca", "identidade"],
  cores: ["paleta", "marca", "visual"],
  proposta: ["aurora", "comercial", "preco", "cronograma"],
  cliente: ["aurora", "proposta", "comercial"],
  conciliacao: ["extrato", "contabil", "divergencia", "banco", "bancaria"],
  banco: ["extrato", "conciliacao", "bancaria"],
  obra: ["fachada", "construcao", "andamento"],
  aditivo: ["prorrogacao", "prazo", "cronograma"],
};

function strip(s: string): string {
  return s
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase();
}

function tokenize(text: string): string[] {
  return strip(text)
    .split(/[^a-z0-9]+/)
    .filter((t) => t.length > 2 && !STOPWORDS.has(t));
}

function expand(tokens: string[]): Set<string> {
  const set = new Set(tokens);
  for (const t of tokens) {
    for (const syn of SYNONYMS[t] ?? []) set.add(syn);
  }
  return set;
}

export interface SemanticMatch {
  score: number;
  matched: string[];
}

/** Pontua o quão relacionada uma consulta está a um texto pesquisável. */
export function semanticScore(query: string, searchable: string): SemanticMatch {
  const queryTokens = tokenize(query);
  if (queryTokens.length === 0) return { score: 0, matched: [] };

  const expanded = expand(queryTokens);
  const text = ` ${strip(searchable)} `;

  const direct = new Set(queryTokens);
  const matched: string[] = [];
  let weight = 0;

  for (const term of expanded) {
    if (text.includes(term)) {
      matched.push(term);
      weight += direct.has(term) ? 1 : 0.6; // sinônimos pesam menos
    }
  }

  const score = weight / queryTokens.length;
  return { score, matched: [...new Set(matched)] };
}
