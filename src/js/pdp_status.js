// Calcolo dello stato dei PDP degli studenti BES.
// Modulo "puro" (nessun accesso al DB): usato sia lato client (PDP Alunni)
// sia lato server (report Excel), così la regola resta scritta in un solo posto.
//
// Regola:
//   studente -> classe -> insegnamenti dell'anno corrente della classe (solo materie con has_pdp)
//   per ogni insegnamento deve esistere un PDP con stesso studente, materia e docente.
//   Il PDP NON dipende dall'anno: la riga creata negli anni precedenti viene riusata.
//
// Stati possibili per ogni insegnamento:
export const PDP_COMPLETO = 'COMPLETO';
export const PDP_NON_COMPLETO = 'NON COMPLETO';
export const PDP_MAI_SALVATO = 'MAI SALVATO';

// insegnamenti: [{ idClasse, idMateria, idDocente, materia: { nome }, docente: { nome, cognome, email } }]
// gli insegnamenti devono essere già filtrati per anno corrente e materia.has_pdp
export const insegnamentiDellaClasse = (insegnamenti, idClasse) =>
	insegnamenti.filter((insegnamento) => insegnamento.idClasse == idClasse);

// stato del PDP di uno studente per uno specifico insegnamento
// studente.pdp: [{ idMateria, idDocente, completo }]
export const statoPdpInsegnamento = (studente, insegnamento) => {
	const pdps = (studente.pdp || []).filter(
		(p) => p.idMateria == insegnamento.idMateria && p.idDocente == insegnamento.idDocente
	);

	if (pdps.length == 0) return PDP_MAI_SALVATO;
	return pdps.some((p) => p.completo == true) ? PDP_COMPLETO : PDP_NON_COMPLETO;
};

// restituisce una riga per ogni insegnamento della classe dello studente con il relativo stato PDP
// studente: { id, nome, cognome, classe: { id, classe, sezione, istituto }, pdp: [...] }
export const statoPdpStudente = (studente, insegnamenti) =>
	insegnamentiDellaClasse(insegnamenti, studente.classe?.id).map((insegnamento) => ({
		idStudente: studente.id,
		studente: `${studente.cognome} ${studente.nome}`,
		cognome: studente.cognome,
		nome: studente.nome,
		istituto: studente.classe.istituto,
		classe: `${studente.classe.classe}${studente.classe.sezione}`,
		idMateria: insegnamento.idMateria,
		materia: insegnamento.materia?.nome,
		idDocente: insegnamento.idDocente,
		docente: insegnamento.docente
			? `${insegnamento.docente.cognome} ${insegnamento.docente.nome}`
			: '',
		email_docente: insegnamento.docente?.email || '',
		stato: statoPdpInsegnamento(studente, insegnamento)
	}));

// stato PDP di tutti gli studenti: lista piatta studente x insegnamento
export const statoPdpStudenti = (studenti, insegnamenti) =>
	studenti.flatMap((studente) => statoPdpStudente(studente, insegnamenti));
