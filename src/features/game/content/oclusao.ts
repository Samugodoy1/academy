import type { ExerciseSeed } from '../types';

const facts: Array<[string,string,string,string]> = [["Máxima intercuspidação é uma posição determinada pelo encaixe dentário.","Ela não é sinônimo de relação cêntrica.","é sempre igual à relação cêntrica","depende apenas da ATM"],["Guia anterior pode contribuir para desoclusão posterior em excursões.","O contato anterior influencia a dinâmica mandibular.","atua apenas em repouso","não participa de movimentos excursivos"],["Contato prematuro pode alterar a distribuição de forças.","A avaliação clínica deve considerar sintomas, função e contexto.","sempre causa necrose","nunca precisa ser ajustado"],["Bruxismo envolve atividade repetitiva dos músculos mastigatórios.","A avaliação deve considerar história, sinais e sintomas.","é definido apenas por desgaste","ocorre somente durante o dia"],["Dimensão vertical deve ser avaliada dentro do planejamento protético.","Alterações indiscriminadas podem comprometer função e estética.","não tem relação com prótese","é definida apenas por uma fotografia"],["Articulador é uma ferramenta de análise e não substitui exame clínico.","O instrumento deve ser interpretado dentro do diagnóstico.","substitui a anamnese","diagnostica sozinho"]];
const make = (): ExerciseSeed[] => facts.flatMap(([statement, explanation, wrong, correct], i) => [
  { id:'ocl-' + String(i+1).padStart(2,'0') + 'a', kind:'choice', difficulty:2, prompt:'Qual afirmação está correta?', options:[correct, wrong, 'As duas estão corretas apenas em laboratório', 'Não há relação clínica'], answer:0, explanation },
  { id:'ocl-' + String(i+1).padStart(2,'0') + 'b', kind:'boolean', difficulty:1, prompt:'Verdadeiro ou falso?', statement, answer:true, explanation },
]);

export const OCL_EXERCISES: ExerciseSeed[] = make();
