// Insights de IA por documento (mock). Simula o processamento leve que a IA faria:
// resumo, destaques, tags sugeridas, confiança e perguntas sugeridas. Também é a base
// textual usada pela busca por contexto (semântica). Ver utils/semantic.ts.

// Types
import type { AiInsight } from "@/types/ged";

export const AI_INSIGHTS: Record<string, AiInsight> = {
  "d-contrato-fornecimento": {
    summary:
      "Contrato de fornecimento com a Vale Verde, com vigência de 24 meses. Define preços, prazos de entrega e uma multa de 2% por atraso na cláusula 8. Assinado digitalmente por ambas as partes.",
    highlights: [
      "Multa de 2% por atraso de entrega (cláusula 8)",
      "Vigência de 24 meses com renovação automática",
      "Reajuste anual pelo IPCA",
    ],
    suggestedTags: ["multa", "prazo de entrega", "renovação", "fornecedor"],
    confidence: 0.94,
    processedAt: "2026-07-22T18:06:00Z",
    suggestedQuestions: [
      "Qual é a multa por atraso?",
      "Quando o contrato vence?",
      "Como funciona o reajuste?",
    ],
  },
  "d-nfe-julho": {
    summary:
      "Planilha consolidando as notas fiscais eletrônicas emitidas em julho de 2026, com totais de impostos e valores por fornecedor. Fechamento mensal do departamento financeiro.",
    highlights: [
      "Total de impostos apurados no mês",
      "Consolidação por fornecedor e CFOP",
      "Base para conciliação contábil",
    ],
    suggestedTags: ["impostos", "fechamento mensal", "fornecedores"],
    confidence: 0.88,
    processedAt: "2026-07-28T14:36:00Z",
    suggestedQuestions: ["Qual o total de impostos?", "Quantas notas foram emitidas?"],
  },
  "d-politica-home-office": {
    summary:
      "Política de trabalho remoto e híbrido para 2026. Define o modelo híbrido 3x2 (três dias presenciais), regras de auxílio home office, segurança da informação e direito à desconexão.",
    highlights: [
      "Modelo híbrido 3x2 (3 dias no escritório)",
      "Auxílio home office mensal",
      "Regras de segurança da informação em casa",
    ],
    suggestedTags: ["trabalho remoto", "híbrido", "benefícios", "desconexão"],
    confidence: 0.91,
    processedAt: "2026-06-18T09:46:00Z",
    suggestedQuestions: ["Quantos dias presenciais?", "Tem auxílio home office?"],
  },
  "d-orcamento-2027": {
    summary:
      "Planejamento orçamentário estratégico para o ano de 2027, com projeções de receita, CAPEX por diretoria e cenários conservador e agressivo. Material restrito à diretoria.",
    highlights: [
      "CAPEX previsto por diretoria",
      "Cenários conservador e agressivo",
      "Metas de receita e margem para 2027",
    ],
    suggestedTags: ["investimento", "capex", "planejamento", "próximo ano"],
    confidence: 0.9,
    processedAt: "2026-07-29T17:51:00Z",
    suggestedQuestions: ["Quanto vamos investir em 2027?", "Quais são os cenários?"],
  },
  "d-ata-diretoria": {
    summary:
      "Ata da reunião de diretoria do segundo trimestre. Registra decisões estratégicas, aprovação de novos projetos e diretrizes de expansão. Documento restrito.",
    highlights: [
      "Aprovação de novos projetos do trimestre",
      "Diretrizes de expansão",
      "Deliberações estratégicas da diretoria",
    ],
    suggestedTags: ["decisões", "estratégia", "expansão", "reunião"],
    confidence: 0.85,
    processedAt: "2026-07-06T08:12:00Z",
    suggestedQuestions: ["Quais decisões foram tomadas?", "Que projetos foram aprovados?"],
  },
  "d-planta-galpao": {
    summary:
      "Planta baixa e projeto estrutural do novo galpão logístico, com layout de docas, pilares e áreas de armazenagem. Revisão estrutural de pilares aplicada na v2.",
    highlights: [
      "Layout de docas e armazenagem",
      "Revisão de pilares na versão 2",
      "Dimensionamento estrutural",
    ],
    suggestedTags: ["galpão", "logística", "estrutura", "layout"],
    confidence: 0.82,
    processedAt: "2026-07-19T16:41:00Z",
    suggestedQuestions: ["Quantas docas tem o galpão?", "O que mudou na v2?"],
  },
  "d-proposta-comercial": {
    summary:
      "Proposta comercial para o Cliente Aurora, com escopo do projeto, cronograma e tabela de preços por módulo. Ainda em rascunho, aguardando revisão comercial.",
    highlights: [
      "Tabela de preços por módulo",
      "Cronograma de implantação",
      "Escopo e condições comerciais",
    ],
    suggestedTags: ["proposta", "preços", "cliente aurora", "cronograma"],
    confidence: 0.8,
    processedAt: "2026-07-30T09:16:00Z",
    suggestedQuestions: ["Qual o valor da proposta?", "Qual o prazo de implantação?"],
  },
  "d-manual-marca": {
    summary:
      "Guia visual da marca com regras de uso do logotipo, paleta de cores, tipografia e aplicações. Material público de referência para comunicação.",
    highlights: ["Paleta de cores oficial", "Regras de uso do logotipo", "Tipografia da marca"],
    suggestedTags: ["marca", "identidade visual", "logotipo", "design"],
    confidence: 0.87,
    processedAt: "2026-05-02T11:21:00Z",
    suggestedQuestions: ["Quais são as cores da marca?", "Como usar o logo?"],
  },
  "d-holerite-modelo": {
    summary:
      "Modelo de holerite (contracheque) de julho, com proventos, descontos e base de cálculo. Documento confidencial do RH.",
    highlights: ["Proventos e descontos", "Base de cálculo de encargos", "Layout do contracheque"],
    suggestedTags: ["folha de pagamento", "salário", "descontos"],
    confidence: 0.86,
    processedAt: "2026-07-25T08:01:00Z",
    suggestedQuestions: ["Quais descontos aparecem?", "Como é calculado o líquido?"],
  },
  "d-foto-obra": {
    summary:
      "Registro fotográfico da fachada da obra, usado para acompanhamento do andamento físico do projeto de construção.",
    highlights: ["Acompanhamento visual da obra", "Registro da fachada", "Evidência de andamento"],
    suggestedTags: ["obra", "andamento", "construção", "registro"],
    confidence: 0.72,
    processedAt: "2026-07-18T12:01:00Z",
    suggestedQuestions: ["Qual o estágio da obra?"],
  },
  "d-aditivo-contrato": {
    summary:
      "Aditivo contratual que prorroga o prazo de vigência do contrato principal e ajusta o cronograma de entregas. Minuta em elaboração pelo jurídico.",
    highlights: [
      "Prorrogação do prazo de vigência",
      "Ajuste do cronograma de entregas",
      "Vincula-se ao contrato principal",
    ],
    suggestedTags: ["aditivo", "prazo", "prorrogação", "cronograma"],
    confidence: 0.83,
    processedAt: "2026-07-29T10:31:00Z",
    suggestedQuestions: ["Quanto tempo foi prorrogado?", "A que contrato se refere?"],
  },
  "d-relatorio-conciliacao": {
    summary:
      "Relatório de conciliação bancária do período, comparando extratos e lançamentos contábeis, com apontamento de divergências e ajustes.",
    highlights: ["Comparação extrato x contábil", "Divergências apontadas", "Ajustes recomendados"],
    suggestedTags: ["conciliação", "banco", "divergências", "contábil"],
    confidence: 0.84,
    processedAt: "2026-07-16T10:01:00Z",
    suggestedQuestions: ["Houve divergências?", "Qual o saldo conciliado?"],
  },
};
