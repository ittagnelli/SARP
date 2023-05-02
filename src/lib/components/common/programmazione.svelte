<script>
	export let argomenti;

	/**
	 * @param {number} index
	 */
	function new_sotto_argomento(index) {
		argomenti[index].sotto_argomenti.push('');
		argomenti = argomenti;
	}

	/**
	 * @param {number} index
	 */
	function remove_sotto_argomento(index, index_argomento) {
		argomenti[index_argomento].sotto_argomenti.splice(index, 1);
		argomenti = argomenti;
	}

	function new_argomento() {
		argomenti.push({
			titolo: '',
			sotto_argomenti: ['']
		});
		argomenti = argomenti;
	}

	/**
	 * @param {number} index
	 */
	function remove_argomento(index) {
		argomenti.splice(index, 1);
		argomenti = argomenti;
	}
</script>

<div>
	{#each argomenti as argomento, index}
		<div class="mt-2">
			<!--Per estetica aggiungiamo 1 all'indice-->
			<div class="form-label">Argomento {index + 1}</div>
			<div class="input-group input-group-flat">
				<input
					type="text"
					class="form-control"
					bind:value={argomento.titolo}
					placeholder="Titolo argomento"
				/>
				<span class="input-group-text">
					<a
						href="#0"
						class="link-secondary"
						title="Clear search"
						data-bs-toggle="tooltip"
						on:click={() => new_argomento()}
						><!-- Download SVG icon from http://tabler-icons.io/i/x -->
						<svg
							xmlns="http://www.w3.org/2000/svg"
							class="icon icon-tabler icon-tabler-plus"
							width="24"
							height="24"
							viewBox="0 0 24 24"
							stroke-width="2"
							stroke="currentColor"
							fill="none"
							stroke-linecap="round"
							stroke-linejoin="round"
						>
							<path stroke="none" d="M0 0h24v24H0z" fill="none" />
							<path d="M12 5l0 14" />
							<path d="M5 12l14 0" />
						</svg>
					</a>
					{#if index > 0}
						<a
							href="#"
							class="link-secondary"
							title="Clear search"
							data-bs-toggle="tooltip"
							on:click={() => remove_argomento(index)}
							><!-- Download SVG icon from http://tabler-icons.io/i/x -->
							<svg
								xmlns="http://www.w3.org/2000/svg"
								class="icon icon-tabler icon-tabler-trash-filled"
								width="24"
								height="24"
								viewBox="0 0 24 24"
								stroke-width="2"
								stroke="currentColor"
								fill="none"
								stroke-linecap="round"
								stroke-linejoin="round"
							>
								<path stroke="none" d="M0 0h24v24H0z" fill="none" />
								<path
									d="M20 6a1 1 0 0 1 .117 1.993l-.117 .007h-.081l-.919 11a3 3 0 0 1 -2.824 2.995l-.176 .005h-8c-1.598 0 -2.904 -1.249 -2.992 -2.75l-.005 -.167l-.923 -11.083h-.08a1 1 0 0 1 -.117 -1.993l.117 -.007h16z"
									stroke-width="0"
									fill="currentColor"
								/>
								<path
									d="M14 2a2 2 0 0 1 2 2a1 1 0 0 1 -1.993 .117l-.007 -.117h-4l-.007 .117a1 1 0 0 1 -1.993 -.117a2 2 0 0 1 1.85 -1.995l.15 -.005h4z"
									stroke-width="0"
									fill="currentColor"
								/>
							</svg>
						</a>
					{/if}
				</span>
			</div>
			{#each argomento.sotto_argomenti as sotto_argomento, i}
				<div class="input-group input-group-flat">
					<input
						type="text"
						class="form-control"
						bind:value={sotto_argomento}
						style="margin-left: 1em; margin-top: 1em"
						placeholder="Sotto argomento"
					/>
					<span class="input-group-text">
						<a
							href="#0"
							on:click={() => new_sotto_argomento(i)}
							class="link-secondary"
							title="Clear search"
							data-bs-toggle="tooltip"
							><!-- Download SVG icon from http://tabler-icons.io/i/x -->
							<svg
								xmlns="http://www.w3.org/2000/svg"
								class="icon icon-tabler icon-tabler-plus"
								width="24"
								height="24"
								viewBox="0 0 24 24"
								stroke-width="2"
								stroke="currentColor"
								fill="none"
								stroke-linecap="round"
								stroke-linejoin="round"
							>
								<path stroke="none" d="M0 0h24v24H0z" fill="none" />
								<path d="M12 5l0 14" />
								<path d="M5 12l14 0" />
							</svg>
						</a>
						{#if i > 0}
							<a
								href="#0"
								class="link-secondary"
								title="Clear search"
								data-bs-toggle="tooltip"
								on:click={() => remove_sotto_argomento(i, index)}
								><!-- Download SVG icon from http://tabler-icons.io/i/x -->
								<svg
									xmlns="http://www.w3.org/2000/svg"
									class="icon icon-tabler icon-tabler-trash-filled"
									width="24"
									height="24"
									viewBox="0 0 24 24"
									stroke-width="2"
									stroke="currentColor"
									fill="none"
									stroke-linecap="round"
									stroke-linejoin="round"
								>
									<path stroke="none" d="M0 0h24v24H0z" fill="none" />
									<path
										d="M20 6a1 1 0 0 1 .117 1.993l-.117 .007h-.081l-.919 11a3 3 0 0 1 -2.824 2.995l-.176 .005h-8c-1.598 0 -2.904 -1.249 -2.992 -2.75l-.005 -.167l-.923 -11.083h-.08a1 1 0 0 1 -.117 -1.993l.117 -.007h16z"
										stroke-width="0"
										fill="currentColor"
									/>
									<path
										d="M14 2a2 2 0 0 1 2 2a1 1 0 0 1 -1.993 .117l-.007 -.117h-4l-.007 .117a1 1 0 0 1 -1.993 -.117a2 2 0 0 1 1.85 -1.995l.15 -.005h4z"
										stroke-width="0"
										fill="currentColor"
									/>
								</svg>
							</a>
						{/if}
					</span>
				</div>
			{/each}
		</div>
	{/each}
</div>
