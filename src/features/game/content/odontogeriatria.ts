import type { ExerciseSeed } from '../types';

const facts: Array<[string,string,string,string]> = [["Polifarmácia aumenta a necessidade de revisar medicamentos na consulta.","Interações e efeitos adversos podem influenciar a saúde oral.","dispensa anamnese","não altera risco"],["Xerostomia é comum em idosos que usam vários medicamentos.","Redução salivar pode aumentar cárie e desconforto.","protege contra cárie","não afeta mucosas"],["Raiz exposta aumenta risco de cárie radicular.","Recessão gengival e menor proteção radicular exigem prevenção individualizada.","diminui risco","não tem relação com cárie"],["Capacidade funcional deve ser considerada ao orientar higiene.","Nem todo paciente consegue executar a mesma técnica sozinho.","é irrelevante","deve-se usar sempre a mesma orientação"],["Próteses removíveis precisam de higiene e acompanhamento.","Biofilme e uso contínuo inadequado podem causar inflamação e lesões.","não precisam de limpeza","podem permanecer sempre na boca"],["Alterações cognitivas podem exigir adaptação da comunicação e apoio do cuidador.","O objetivo é manter autonomia e segurança dentro das possibilidades.","devem ser ignoradas","impedem qualquer tratamento"]];
const make = (): ExerciseSeed[] => facts.flatMap(([statement, explanation, wrong, correct], i) => [
  { id:'geri-' + String(i+1).padStart(2,'0') + 'a', kind:'choice', difficulty:2, prompt:'Qual afirmação está correta?', options:[correct, wrong, 'As duas estão corretas apenas em laboratório', 'Não há relação clínica'], answer:0, explanation },
  { id:'geri-' + String(i+1).padStart(2,'0') + 'b', kind:'boolean', difficulty:1, prompt:'Verdadeiro ou falso?', statement, answer:true, explanation },
]);

export const GERI_EXERCISES: ExerciseSeed[] = make();
