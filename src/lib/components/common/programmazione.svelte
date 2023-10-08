<script>
	export let argomenti;

	/**
	 * @param {number} index
	 */
	function new_sotto_argomento(index, current_index) {
		argomenti[index].sotto_argomenti.splice(current_index + 1, 0, {
			sotto_argomento_text: '',
			sotto_sotto_argomenti: ['']
		});
		argomenti = argomenti;
	}

	/**
	 * @param {number} index
	 */
	function remove_sotto_argomento(index, index_to_remove) {
		argomenti[index].sotto_argomenti.splice(index_to_remove, 1);
		argomenti = argomenti;
	}

	function new_argomento() {
		argomenti.push({
			titolo: '',
			sotto_argomenti: [
				{
					sotto_argomento_text: '',
					sotto_sotto_argomenti: ['']
				}
			]
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

    const text_validation_str = `
    1234567890
    ABCDEFGHIJKLMNOPQRSTUVXYWZ
    abcdefghijklmnopqrstuvxywz
    |!"£$%&/()=?^é*ç°;:_<>
    'ìè+ùòà,.-
    []@#{}~
    `;

    const text_validation_special_key = [
        'Backspace',
        'Delete',
        'ArrowLeft',
        'ArrowRight'
    ];

    function is_valid_typed_char(c) {
        return is_valid_char(c.key) || c.key == '\\';
    }

    function is_valid_char(c) {
        return (
            text_validation_str.includes(c) ||
            text_validation_special_key.includes(c)
        );
    }
	function validate_key(e) {
        if (!is_valid_typed_char(e)) e.preventDefault();
	}

    function validate_paste(text) {
        let valid = true;

        text.split('').forEach(c => {
            if (!is_valid_char(c)) valid = false;
        });
        return valid ? text : 'Inseriti caratteri non validi';
    }

	function add_sotto_sotto_argomento(index, index_sotto_argomento, current_index) {
		argomenti[index].sotto_argomenti[index_sotto_argomento].sotto_sotto_argomenti.splice(current_index + 1, 0, "");
		argomenti = argomenti;
	}

	function remove_sotto_sotto_argomento(index, index_sotto_argomento, index_to_remove) {
		argomenti[index].sotto_argomenti[index_sotto_argomento].sotto_sotto_argomenti.splice(
			index_to_remove,
			1
		);
		argomenti = argomenti;
	}
</script>

<div>
	{#each argomenti as argomento, index}
		<div class="mt-2">
			<!--Per estetica aggiungiamo 1 all'indice-->
			<div class="form-label">Argomento {index + 1}</div>
			<div class="input-group input-group-flat">
				<textarea
					class="form-control"
					bind:value={argomento.titolo}
					placeholder="Argomento"
					maxlength="128"
					rows="2"
					on:keydown={validate_key}
                    on:paste={() => setTimeout(() => argomento.titolo = validate_paste(argomento.titolo), 2)}
				/>
				<span class="input-group-text">
					<a
						href="#0"
						class="link-secondary"
						title="Aggiungi argomento"
						data-bs-toggle="tooltip"
						on:click={() => new_argomento()}
						><!-- Download SVG icon from http://tabler-icons.io/i/x -->
						<svg
							xmlns="http://www.w3.org/2000/svg"
							class="icon icon-tabler icon-tabler-plus add-icon"
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
							class="link-secondary spacer"
							title="Rimuovi argomento"
							data-bs-toggle="tooltip"
							on:click={() => remove_argomento(index)}
							><!-- Download SVG icon from http://tabler-icons.io/i/x -->
							<svg
								xmlns="http://www.w3.org/2000/svg"
								class="icon icon-tabler icon-tabler-trash-filled del-icon"
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
						<textarea
							class="form-control"
							bind:value={sotto_argomento.sotto_argomento_text}
							style="margin-left: 1em; margin-top: 1em"
							placeholder="Sotto argomento"
							rows="2"
							maxlength="512"
							on:keydown={validate_key}
                            on:paste={() => setTimeout(() => sotto_argomento.sotto_argomento_text = validate_paste(sotto_argomento.sotto_argomento_text), 2)}
						/>
						<span class="input-group-text">
							<a
								href="#0"
								on:click={() => new_sotto_argomento(index, i)}
								class="link-secondary"
								title="Aggiungi sotto argomento"
								data-bs-toggle="tooltip"
								><!-- Download SVG icon from http://tabler-icons.io/i/x -->
								<svg
									xmlns="http://www.w3.org/2000/svg"
									class="icon icon-tabler icon-tabler-plus add-icon"
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
									class="link-secondary spacer"
									title="Rimuovi sotto argomento"
									data-bs-toggle="tooltip"
									on:click={() => remove_sotto_argomento(index, i)}
									><!-- Download SVG icon from http://tabler-icons.io/i/x -->
									<svg
										xmlns="http://www.w3.org/2000/svg"
										class="icon icon-tabler icon-tabler-trash-filled del-icon"
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
				{#each sotto_argomento.sotto_sotto_argomenti as sotto_sotto_argomento, j}
					<div class="input-group input-group-flat">
						<textarea
							class="form-control"
							bind:value={sotto_argomento.sotto_sotto_argomenti[j]}
							style="margin-left: 2em; margin-top: 1em"
							placeholder="Sotto sotto argomento"
							rows="2"
							maxlength="512"
							on:keydown={validate_key}
                            on:paste={() => setTimeout(() => sotto_argomento.sotto_sotto_argomenti[j] = validate_paste(sotto_argomento.sotto_sotto_argomenti[j]), 2)}
						/>
						<span class="input-group-text">
							<a
								href="#0"
								on:click={() => add_sotto_sotto_argomento(index, i, j)}
								class="link-secondary"
								title="Aggiungi sotto sotto argomento"
								data-bs-toggle="tooltip"
								><!-- Download SVG icon from http://tabler-icons.io/i/x -->
								<svg
									xmlns="http://www.w3.org/2000/svg"
									class="icon icon-tabler icon-tabler-plus add-icon"
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
						{#if j > 0}
							<a
								href="#0"
								class="link-secondary spacer"
								title="Rimuovi sotto sotto argomento"
								data-bs-toggle="tooltip"
								on:click={() => remove_sotto_sotto_argomento(index, i, j)}
								><!-- Download SVG icon from http://tabler-icons.io/i/x -->
								<svg
									xmlns="http://www.w3.org/2000/svg"
									class="icon icon-tabler icon-tabler-trash-filled del-icon"
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
			{/each}
		</div>
	{/each}
</div>

<style>
    .add-icon {
        color: green;
        font-weight: bolder;
    }

    .del-icon {
        color: red;
        font-weight: bolder;
    }

    .spacer {
        padding-left: 20px;
    }

</style>