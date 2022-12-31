<script>
	import { page_pre_title, page_title, page_action_title } from '../../js/store';
	import Faq from '$lib/components/faq/faq.svelte';
	import FaqSection from '$lib/components/faq/faq_section.svelte';
	import { Logger } from '../../js/logger';
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
						<FaqSection title="1. Utenti" number="1">
							<Faq
								show={true}
								number="1-1"
								parent_number="1"
								question="Come posso segnalare un malfunzionamento, un suggerimento o una richiesta di modifica?"
								answer={faq('faq1_1')}
							/>
							<Faq
								show={false}
								number="1-2"
								parent_number="1"
								question="Posso effettuare il login con la mia email privata?"
								answer={faq('faq1_2')}
							/>
                            <Faq
								show={false}
								number="1-3"
								parent_number="1"
								question="Perchè non posso accedere a tutte le pagine?"
								answer={faq('faq1_3')}
							/>
						</FaqSection>
						<FaqSection title="2. PCTO" number="2">
							<Faq
								show={true}
								number="2-1"
								parent_number="2"
								question="Domanda #1?"
								answer="<p>Risposta #1</p>"
							/>
							<Faq
								show={false}
								number="2-2"
								parent_number="2"
								question="Domanda #2?"
								answer="<p>Risposta #2</p>"
							/>
						</FaqSection>
						<FaqSection title="0. Sviluppatori" number="0">
							<Faq
								show={true}
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
