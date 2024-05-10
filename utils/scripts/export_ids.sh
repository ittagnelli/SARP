#|/bin/sh

# $1: db file
# $2: prefix
                      

sqlite3 -header -csv $1 "select id from Classe order by id;" > $Classe.csv
sqlite3 -header -csv $1 "select id from Insegnamenti order by id;" > $2_Insegnamenti.csv
sqlite3 -header -csv $1 "select id from Materia order by id;" > $2_Materia.csv
sqlite3 -header -csv $1 "select id from PDP order by id;" > $2_PDP.csv
sqlite3 -header -csv $1 "select id from Utente order by id;" > $Utente.csv
sqlite3 -header -csv $1 "select * from _UtenteToruolo_Utente;" > $_UtenteToruolo_Utente.csv
sqlite3 -header -csv $1 "select * from _UtenteTosicurezza_Corso;" > $2__UtenteTosicurezza_Corso.csv
sqlite3 -header -csv $1 "select * from _iscritto;" > $2__iscritto.csv
sqlite3 -header -csv $1 "select * from _prisma_migrations;" > $2__prisma_migrations.csv
sqlite3 -header -csv $1 "select id from kpi_Stats order by id;" > $2_kpi_Stats.csv
sqlite3 -header -csv $1 "select id from pcto_Azienda order by id;" > $2_pcto_Azienda.csv
sqlite3 -header -csv $1 "select id from pcto_Pcto order by id;" > $2_pcto_Pcto.csv
sqlite3 -header -csv $1 "select id from pcto_Presenza order by id;" > $2_pcto_Presenza.csv
sqlite3 -header -csv $1 "select id from pcto_Valutazione order by id;" > $2_pcto_Valutazione.csv
sqlite3 -header -csv $1 "select id from pcto_Valutazione_Studente order by id;" > $2_pcto_Valutazione_Studente.csv
sqlite3 -header -csv $1 "select id from pdp_Template order by id;" > $2_pdp_Template.csv
sqlite3 -header -csv $1 "select id from programmazione_Template order by id;" > $2_programmazione_Template.csv
sqlite3 -header -csv $1 "select id from ruolo_Utente order by id;" > $2_ruolo_Utente.csv
sqlite3 -header -csv $1 "select id from sicurezza_Corso order by id;" > $2_sicurezza_Corso.csv
sqlite3 -header -csv $1 "select id from sicurezza_Test order by id;" > $2_sicurezza_Test.csv
sqlite3 -header -csv $1 "select id from tipo_Utente order by id;" > $2_tipo_Utente.csv
