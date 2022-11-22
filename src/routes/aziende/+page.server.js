import { PrismaClient } from '@prisma/client';
import PizZip from 'pizzip';
import Docxtemplater from 'docxtemplater';
import fs from 'fs';
import path from 'path';
import { redirect } from '@sveltejs/kit';

// Istanzia il client per il SARP
const SARP = new PrismaClient();

export async function load({ params }) {
	// query SQL al DB per tutte le entry nella tabella todo
	const companies = await SARP.pcto_Azienda.findMany({
		orderBy: [{ id: 'desc' }]
	});

    console.log("AZIENDE:", companies)
	// restituisco il risultato della query SQL
	return companies;
}

export const actions = {
	create: async ({ cookies, request }) => {
		const form_data = await request.formData();

        console.log(form_data)

		await SARP.pcto_Azienda.create({
			data: {
				nome: form_data.get('azienda'),
				idConvenzione: form_data.get('no_convenzione'),
				idUtente: 2,
				dataConvenzione: new Date(form_data.get('data_convenzione')),
				dataProtocollo: new Date(form_data.get('data_protocollo')),
				istituto: form_data.get('istituto'),
                indirizzo: form_data.get('indirizzo'),
                piva: form_data.get('piva'),
                telefono: form_data.get('telefono'),
                direttore: form_data.get('direttore'),
                natoA: form_data.get('natoA'),
                natoIl: new Date(form_data.get('natoIl')),
                codiceF: form_data.get('codiceF'),
			}
		});
	},

	update: async ({ cookies, request }) => {
		const form_data = await request.formData();
		let id = form_data.get('id');

		await SARP.pcto_Azienda.update({
			where: { id: +id },
			data: {
				nome: form_data.get('azienda'),
				idConvenzione: form_data.get('no_convenzione'),
				idUtente: 2,
				dataConvenzione: new Date(form_data.get('data_convenzione')),
				dataProtocollo: new Date(form_data.get('data_protocollo')),
				istituto: form_data.get('istituto'),
                indirizzo: form_data.get('indirizzo'),
                piva: form_data.get('piva'),
                telefono: form_data.get('telefono'),
                direttore: form_data.get('direttore'),
                natoA: form_data.get('natoA'),
                natoIl: new Date(form_data.get('natoIl')),
                codiceF: form_data.get('codiceF'),
			}
		});
	},

	delete: async ({ cookies, request }) => {
		const form_data = await request.formData();
		const id = form_data.get('id');

		await SARP.pcto_Azienda.delete({
			where: { id: +id }
		});
	},

    pdf: async ({ cookies, request }) => {
        console.log("GENERA PDF")

        const form_data = await request.formData();
        const id = form_data.get('id');
        
        // preleva l'azienda dal DB
        const company = await SARP.pcto_Azienda.findUnique({
            where: { id: +id }
        });
        //arricchisce l'oggetto
        company['today'] =  new Date().toLocaleDateString();
        company['natoIl'] = company['natoIl'].toLocaleDateString();

        console.log("RENDER DOC CON:", company)
        const content = fs.readFileSync(
            path.resolve("static/pcto_templates/", "01-Convenzione-generale.docx"), "binary");
        
        const zip = new PizZip(content);
        
        const doc = new Docxtemplater(zip, {
            paragraphLoop: true,
            linebreaks: true,
        });
        
        // let no_convenzione = "2223-28";
        // Render the document (Replace {first_name} by John, {last_name} by Doe, ...)
        // doc.render({
        //     no_convenzione: no_convenzione,
        // });
        
        doc.render(company);
        const buf = doc.getZip().generate({
            type: "nodebuffer",
            // compression: DEFLATE adds a compression step.
            // For a 50MB output document, expect 500ms additional CPU time
            // compression: "DEFLATE",
        });
        
        // buf is a nodejs Buffer, you can either write it to a
        // file or res.send it with express for example.
        fs.writeFileSync(path.resolve("static/pcto_output/", `01-Convenzione-generale-${company.idConvenzione}.docx`), buf);
     
        throw redirect(303, `pcto_output/01-Convenzione-generale-${company.idConvenzione}.docx`);
        // return new Response('custom response');
        
        // var pdf = fs.readFileSync("static/pcto_templates/01-Convenzione-generale.docx")

//   return{
//     status:400,
//     headers: {
//       "Content-type" : "application/octet-stream",
//       "Content-Disposition": 'attachment; filename="01-Convenzione-generale.docx"'

//     },
//     body: content
//   }
     
        
    }   
};
