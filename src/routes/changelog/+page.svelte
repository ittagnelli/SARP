<script>
	import { page_pre_title, page_title, page_action_title } from '../../js/store';
	import ChangeVersion from '$lib/components/changelog/change_version.svelte';
	import Fix from '$lib/components/changelog/fix.svelte';
	import Change from '$lib/components/changelog/change.svelte';
	import { Logger } from '../../js/logger';

	let logger = new Logger('client');

	//configura la pagina pre-titolo, titolo e nome del modale
	$page_pre_title = 'Documentazione';
	$page_title = 'Changelog';
	$page_action_title = '';
</script>

<div class="page-wrapper">
	<div class="page-body">
		<div class="container-xl">
			<div class="card card-lg">
				<div class="card-body">
					<div class="markdown">
						<ChangeVersion version="v0.5.4" date="22 Dicembre 2022">
							<Fix issue="68" text="aggiungere changelog" />
							<Fix issue="92" text="inserimento logo SARP" />
							<Fix issue="90" text="Validazione form per tutte le viste" />
							<Fix
								issue="78"
								text="possibilità di inserire cifre e caratteri speciali nel nome e nel cognome"
							/>
							<Fix issue="77" text="formato incorretto del numero telefonico" />
							<Fix issue="76" text="formato email non corretto" />
							<Fix issue="84" text="rimozione console.log" />
						</ChangeVersion>
						<ChangeVersion version="v0.5.0" date="18 Dicembre 2022">
							<Fix issue="83" text="Auditing" />
						</ChangeVersion>
						<ChangeVersion version="v0.4.0" date="18 Dicembre 2022">
							<Fix issue="63" text="aggiungere server e client logging" />
							<Change text="Aggiunto show_users()" />
							<Change text="Aggiunto script wiki" />
							<Fix issue="58" text="Typo footer tabelle" />
							<Change text="Aggiornato CSP policy" />
							<Change text="Aggiunto can_login" />
							<Change text="aggiunta pagina FAQ e componenti di sviluppo" />
						</ChangeVersion>
						<ChangeVersion version="v0.3.1" date="09 Dicembre 2022">
							<Fix issue="55" text="Aggiungere una pagina 400/500" />
						</ChangeVersion>
						<ChangeVersion version="v0.2.0" date="08 Dicembre 2022">
							<Fix issue="49" text="Aggiungere login con google account " />
							<Fix text="Aggiunti header HTTP" />
						</ChangeVersion>
						<ChangeVersion version="v0.1.0" date="03 Dicembre 2022">
							<Fix issue="35" text="Aggiungere validazione client side form" />
							<Change text="tests: add fill_role and change logic in fill_user" />
							<Change text="assegnati ruoli" />
							<Change text="aggiunto tabella team" />
							<Fix issue="32" text="Generazione foglio convenzione in PDF" />
							<Change text="Feature/profmancusoa presenze" />
							<Change text="Feature/profmancusoa nuove viste" />
							<Change text="valutazioni: Rename import from store" />
							<Change text="valutazione: fix problem with modal" />
							<Change text="risolto problema aziende e aggiunto helper" />
							<Change text="Aggiunta view valutazioni" />
							<Change text="Profmancusoa/feature/view aziende" />
							<Fix issue="15" text="Navbar non permette più voci di sottomenu e sottosotto menu" />
							<Change text="first run di prettier sui sorgenti" />
							<Change
								text="aggiunto husky per fare la formattazione automatica prima di ogni commit"
							/>
							<Change
								text="aggiornato .prettierignore per rimuovere le directory con file statici o non da formattare"
							/>
							<Change text="refactor della navbar a componenti" />
							<Change text="added updated ER diagram, jpg and source file" />
							<Change text="added prisma scheme and .env file" />
							<Change text="Implement multiple rows" />
							<Change text="Fix layout problem" />
							<Fix issue="1" text="diagramma ER per applicazione PCTO " />
							<Change text="routes revert page changes" />
							<Change text="Revert some changes" />
							<Change text="Remove ts, svelte preprocessor and useless component" />
							<Change text="Cleanup project" />
							<Change text="Add stabler component and fix a problem with modal" />
							<Change
								text="Risolto bug tremendo in tabler.js - aggiunto store per comunicazione tra componenti - reso parametrico il pre-title, title e il tasto azione - creato lo skeleton per la pagina convenzioni"
							/>
							<Change
								text="aggiunta la directory tabler che contiene tutti i file della dist originale di tabler - aggiunto il layout di SERP"
							/>
							<Change text="aggiunto mockup" />
							<Change text="obiettivi iniziali" />
						</ChangeVersion>
						<ChangeVersion version="v0.0.0" date="26 Settembre 2022" comment="primo commit" />
					</div>
				</div>
			</div>
		</div>
	</div>
</div>
