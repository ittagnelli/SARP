<script>
	export let question;
	export let number;
	export let parent_number;
    export let show;
    export let answer;
</script>

<div class="accordion-item">
	<div class="accordion-header" role="tab">
		<button class="accordion-button" data-bs-toggle="collapse" data-bs-target="#faq-{number}">
			{question}
		</button>
	</div>
	<div
		id="faq-{number}"
		class="accordion-collapse collapse {show ? 'show' : ''}"
		role="tabpanel"
		data-bs-parent="#faq-{parent_number}"
	>
		<div class="accordion-body pt-0">
			<div>
				{@html answer}
			</div>
		</div>
	</div>
</div>
