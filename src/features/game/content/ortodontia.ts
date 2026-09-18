import type { ExerciseSeed } from '../types';

const facts: Array<[string,string,string,string]> = [["Movimento ortodôntico depende de remodelação do ligamento periodontal e osso.","Forças aplicadas produzem resposta biológica dos tecidos.","move o dente apenas por desgaste","não envolve osso"],["Overjet descreve a relação horizontal entre incisivos superiores e inferiores.","É diferente de overbite, que descreve a relação vertical.","é sempre vertical","mede apenas a linha média"],["Overbite descreve a sobreposição vertical dos incisivos.","A avaliação faz parte da análise da relação anterior.","é uma medida exclusivamente horizontal","é sinônimo de overjet"],["Retenção é necessária após movimentação ortodôntica.","Os tecidos precisam se adaptar e há risco de recidiva.","não é necessária","serve apenas para estética"],["Crescimento facial influencia o planejamento ortodôntico.","Idade e padrão de crescimento podem modificar a conduta.","crescimento não interfere","todos crescem da mesma forma"],["Higiene oral é essencial durante tratamento ortodôntico fixo.","Brackets podem aumentar retenção de biofilme.","é irrelevante","apenas o ortodontista precisa higienizar"]];
const make = (): ExerciseSeed[] => facts.flatMap(([statement, explanation, wrong, correct], i) => [
  { id:'orto-' + String(i+1).padStart(2,'0') + 'a', kind:'choice', difficulty:2, prompt:'Qual afirmação está correta?', options:[correct, wrong, 'As duas estão corretas apenas em laboratório', 'Não há relação clínica'], answer:0, explanation },
  { id:'orto-' + String(i+1).padStart(2,'0') + 'b', kind:'boolean', difficulty:1, prompt:'Verdadeiro ou falso?', statement, answer:true, explanation },
]);

export const ORTO_EXERCISES: ExerciseSeed[] = make();
