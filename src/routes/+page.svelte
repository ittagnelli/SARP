<script>
	import { page_pre_title, page_title, page_action_modal, page_action_title } from '../js/store';

	$page_pre_title = 'Home';
	$page_title = 'Page';
	$page_action_modal = null;
	$page_action_title = null;

    export let data;
</script>

<br><br>
<h1>Benvenuta/o su <b>S</b>cuola <b>A</b>gnelli <b>R</b>esource <b>P</b>lanning</h1>
<br /><br />
<h2>Obiettivi del progetto:</h2>
<ul>
	<li>Creare un sistema di amministrazione e gestione dei principlai processi della scuola</li>
	<li>
		Ridurre l'uso di documenti cartacei per snellire i processi e muoversi verso il concetto di
		<i>papereless office</i>
	</li>
	<li>
	    Agevolare le attività amministrative per i vari responsabili (docenti, preside,
		amministrazione)
	</li>
	<li>
		Fornire una "palestra" per gli studenti per cimentarsi con un'attività non
		didattica di sviluppo software utilizzando moderne tecnologie web
	</li>
</ul>

<br><br>
<div>
    <img class="logo" src="img/logo_quadrato_nero_small.png" alt="" />
</div>

<div class="modal modal-blur fade" id="modal-name" tabindex="-1" role="dialog" aria-hidden="true">
	<div class="modal-dialog modal-lg" role="document">
		<div class="modal-content">
			<div class="modal-header">
				<h5 class="modal-title">New report</h5>
				<button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close" />
			</div>
			<div class="modal-body">
				<div class="mb-3">
					<label class="form-label" for="text6">Name</label>
					<input
						id="text6"
						type="text"
						class="form-control"
						name="example-text-input"
						placeholder="Your report name"
					/>
				</div>
				<label class="form-label" for="text5">Report type</label>
				<div class="form-selectgroup-boxes row mb-3">
					<div class="col-lg-6">
						<label class="form-selectgroup-item">
							<input
								id="text5"
								type="radio"
								name="report-type"
								value="1"
								class="form-selectgroup-input"
								checked
							/>
							<span class="form-selectgroup-label d-flex align-items-center p-3">
								<span class="me-3">
									<span class="form-selectgroup-check" />
								</span>
								<span class="form-selectgroup-label-content">
									<span class="form-selectgroup-title strong mb-1">Simple</span>
									<span class="d-block text-muted"
										>Provide only basic data needed for the report</span
									>
								</span>
							</span>
						</label>
					</div>
					<div class="col-lg-6">
						<label class="form-selectgroup-item">
							<input type="radio" name="report-type" value="1" class="form-selectgroup-input" />
							<span class="form-selectgroup-label d-flex align-items-center p-3">
								<span class="me-3">
									<span class="form-selectgroup-check" />
								</span>
								<span class="form-selectgroup-label-content">
									<span class="form-selectgroup-title strong mb-1">Advanced</span>
									<span class="d-block text-muted"
										>Insert charts and additional advanced analyses to be inserted in the report</span
									>
								</span>
							</span>
						</label>
					</div>
				</div>
				<div class="row">
					<div class="col-lg-8">
						<div class="mb-3">
							<label class="form-label" for="text4">Report url</label>
							<div class="input-group input-group-flat">
								<span class="input-group-text"> https://tabler.io/reports/ </span>
								<input
									id="text4"
									type="text"
									class="form-control ps-0"
									value="report-01"
									autocomplete="off"
								/>
							</div>
						</div>
					</div>
					<div class="col-lg-4">
						<div class="mb-3">
							<label class="form-label" for="text4">Visibility</label>
							<select id="text4" class="form-select">
								<option value="1" selected>Private</option>
								<option value="2">Public</option>
								<option value="3">Hidden</option>
							</select>
						</div>
					</div>
				</div>
			</div>
			<div class="modal-body">
				<div class="row">
					<div class="col-lg-6">
						<div class="mb-3">
							<label class="form-label" for="text3">Client name</label>
							<input id="text3" type="text" class="form-control" />
						</div>
					</div>
					<div class="col-lg-6">
						<div class="mb-3">
							<label class="form-label" for="text2">Reporting period</label>
							<input id="text2" type="date" class="form-control" />
						</div>
					</div>
					<div class="col-lg-12">
						<div>
							<label class="form-label" for="text1">Additional information</label>
							<textarea id="text1" class="form-control" rows="3" />
						</div>
					</div>
				</div>
			</div>
			<div class="modal-footer">
				<a href="/" class="btn btn-link link-secondary" data-bs-dismiss="modal"> Cancel </a>
				<a href="/" class="btn btn-primary ms-auto" data-bs-dismiss="modal">
					<svg
						xmlns="http://www.w3.org/2000/svg"
						class="icon"
						width="24"
						height="24"
						viewBox="0 0 24 24"
						stroke-width="2"
						stroke="currentColor"
						fill="none"
						stroke-linecap="round"
						stroke-linejoin="round"
						><path stroke="none" d="M0 0h24v24H0z" fill="none" /><line
							x1="12"
							y1="5"
							x2="12"
							y2="19"
						/><line x1="5" y1="12" x2="19" y2="12" /></svg
					>
					Create new report
				</a>
			</div>
		</div>
	</div>
</div>

<style>
	h1 {
		font-size: 3rem;
	}
	h2,
	li {
		font-size: 1.5rem;
	}

	div {
		text-align: center;
	}

    .logo {
        width: 300px;
    }
</style>
