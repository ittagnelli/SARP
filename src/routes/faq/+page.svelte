<script>
	import { page_pre_title, page_title, page_action_title } from '../../js/store';
	import Faq from '$lib/components/faq/faq.svelte';
	import FaqSection from '$lib/components/faq/faq_section.svelte';
    import { Logger } from '../../js/logger';

    let logger = new Logger("client");

	//configura la pagina pre-titolo, titolo e nome del modale
	$page_pre_title = 'Documentation';
	$page_title = 'Frequently Asked Questions';
	$page_action_title = '';
</script>

<div class="page-wrapper">
	<div class="page-body">
		<div class="container-xl">
			<div class="card card-lg">
				<div class="card-body">
					<div class="space-y-4">
						<FaqSection title="0. Sviluppatori" number="0">
							<Faq
                                show={true}
								number="0-1"
								parent_number="0"
								title="Posso contribuire al progetto?"
							>
								<p>
									Certamente, ogni contributo è benvenuto. Vai sul <a
										href="https://github.com/ittagnelli/SARP"
										target="_blank">github</a
									> del progetto ed inizia a leggere la documentazione, ad esplorare le issue aperte
									e richiedi la partecipazione.
								</p>
							</Faq>
							<Faq
								show={false}
								number="0-2"
								parent_number="0"
								title="Dove trovo informazioni utili allo sviluppo?"
							>
								<p>
									Sul repository github del progetto è presente un <a
										href="https://github.com/ittagnelli/SARP/wiki"
										target="_blank">Wiki</a
									>
									che fornisce tutte le informazioni necessarie ad iniziare lo sviluppo e contribuire
									al progetto
								</p>
							</Faq>
						</FaqSection>
						<FaqSection title="1. Utenti" number="1">
							<Faq show={true} number="1-1" parent_number="1" title="Domanda #1?">
								<p>Risposta #1</p>
							</Faq>
							<Faq show={false} number="1-2" parent_number="1" title="Domanda #2?">
								<p>
                                    Risposta #2
                                </p>
							</Faq>
						</FaqSection>
                        <FaqSection title="2. PCTO" number="2">
							<Faq show={true} number="2-1" parent_number="2" title="Domanda #1?">
								<p>Risposta #1</p>
							</Faq>
							<Faq show={false} number="2-2" parent_number="2" title="Domanda #2?">
								<p>
                                    Risposta #2
                                </p>
							</Faq>
                            <Faq show={false} number="2-3" parent_number="2" title="Domanda #3?">
								<p>
                                    Risposta #3
                                </p>
							</Faq>
                            <Faq show={false} number="2-4" parent_number="2" title="Domanda #4?">
								<p>
                                    Risposta #4
                                </p>
							</Faq>
						</FaqSection>
					</div>
				</div>
			</div>
		</div>
	</div>
</div>
