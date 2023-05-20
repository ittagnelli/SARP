<script>
	import { page_pre_title, page_title, page_action_title } from '$js/store';
	import Faq from '$lib/components/faq/faq.svelte';
	import FaqSection from '$lib/components/faq/faq_section.svelte';
	import { Logger } from '$js/logger';
	export let data;

	let logger = new Logger('client');

	//configura la pagina pre-titolo, titolo e nome del modale
	$page_pre_title = 'Documentation';
	$page_title = 'Frequently Asked Questions';
	$page_action_title = '';

	function faq(name) {
		return data.faq[name];
	}
</script>

<div class="page-wrapper">
	<div class="page-body">
		<div class="container-xl">
			<div class="card card-lg">
				<div class="card-body">
					<div class="space-y-4">
                        <FaqSection title="1. SARP" number="1">
							<Faq
								show={false}
								number="1-1"
								parent_number="1"
								question="Cos'è e cosa significa SARP?"
								answer={faq('faq1_1')}
							/>
                            <Faq
								show={false}
								number="1-2"
								parent_number="1"
								question="Come funziona SARP?"
								answer={faq('faq1_2')}
							/>
						</FaqSection>
						<FaqSection title="2. Utenti" number="2">
							<Faq
								show={false}
								number="2-1"
								parent_number="2"
								question="Come posso segnalare un malfunzionamento, un suggerimento o una richiesta di modifica?"
								answer={faq('faq2_1')}
							/>
							<Faq
								show={false}
								number="2-2"
								parent_number="2"
								question="Posso effettuare il login con la mia email privata?"
								answer={faq('faq2_2')}
							/>
                            <Faq
								show={false}
								number="2-3"
								parent_number="2"
								question="Perchè non posso accedere a tutte le pagine?"
								answer={faq('faq2_3')}
							/>
						</FaqSection>
						<FaqSection title="3. PCTO" number="3">
							<Faq
								show={false}
								number="3-1"
								parent_number="3"
								question="Quali sono le principali funzioni dell'applicazione PCTO?"
								answer={faq('faq3_1')}
							/>
                            <Faq
								show={false}
								number="3-2"
								parent_number="3"
								question="Come posso riportare le ore giornaliere svolte da uno stagista?"
								answer={faq('faq3_2')}
							/>
                            <Faq
								show={true}
								number="3-3"
								parent_number="3"
								question="Come posso valutare uno stagista?"
								answer={faq('faq3_3')}
							/>
						</FaqSection>
                        <FaqSection title="4. Tools" number="4">
							<Faq
								show={false}
								number="4-1"
								parent_number="4"
								question="Quali sono le principali funzioni dell'applicazione Convert to Print?"
								answer={faq('faq4_1')}
							/>
						</FaqSection>
                        <FaqSection title="5. Sicurezza sul Lavoro" number="5">
							<Faq
								show={false}
								number="5-1"
								parent_number="5"
								question="Quali sono le principali funzioni dell'applicazione Sicurezza sul Lavoro?"
								answer={faq('faq5_1')}
							/>
						</FaqSection>
						<FaqSection title="0. Sviluppatori" number="0">
							<Faq
								show={false}
								number="0-1"
								parent_number="0"
								question="Posso contribuire al progetto?"
								answer={faq('faq0_1')}
							/>
							<Faq
								show={false}
								number="0-2"
								parent_number="0"
								question="Dove trovo informazioni utili allo sviluppo?"
								answer={faq('faq0_2')}
							/>
						</FaqSection>
					</div>
				</div>
			</div>
		</div>
	</div>
</div>
