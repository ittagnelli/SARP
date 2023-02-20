#!/bin/bash

###
# SARP Images importer
###

function clean_up_useless_files() { # Rimuove i file 0 to 3, foto vuote generate da M$ Word
    for i in {0..3}; do
        rm -rf $1/-00$i.png
    done
}

function cleanup_files() { # Rimuove i file generati
    rm -rf tmp_$1
    
    mkdir tmp_$1
}

function generate_files() { # Generate i file testo e immagine dal pdf
    pdfimages $1.pdf tmp_$1/ -png
    
    pdftotext $1.pdf tmp_$1/tmp_text_$1.txt
}

function sort_file() {
    if [ $2 == "1" ]
    then
        sort -o tmp_$1/tmp_text_$1.txt tmp_$1/tmp_text_$1.txt  # Riordiniamo i file per sicurezza,
        # potrebbe capire che alcune volte il testo sia in ordine alfabetico e le foto no
        # Osservare il file di testo generato e le foto per capirlo
    fi
}

function scp_upload() {
    echo "La chiave per il caricamento deve essere importata nel ssh agent"
    # Copia tutti i file in $4 nell'host $1:$2 in cartella $3
    scp -P $2 $4/* sarp@$1:$3
}

if [ "$1" == "" ] || [ "$2" == "" ] || [ "$3" == "" ] || [ "$4" == "" ] || [ "$5" == "" ] || [ "$6" == "" ]
then
    echo "Usage: pdf_to_images.sh NOMEFILE SORT SCOSTAMENTO URL PORTA FOLDER"
    echo "SORT può assumere 2 valori 0 = no oppure 1 = si"
    echo "RICORDA: Controlla il file testo generato per capire se può essere utile, nella maggior parte dei casi è inutile"
    echo "Classi in cui è stata testata l'efficacia di SORT: 4INFO"
    exit 1
fi

filename=$(basename "$1" .pdf)

mv "$1" ${filename// /_}.pdf

filename=${filename// /_}

generate_files "$filename"

clean_up_useless_files tmp_$filename

sort_file $filename $2

counter=$((4-$3))    # La prima foto utile è la quarta

cat tmp_$filename/tmp_text_$filename.txt | while read line
do
    if [[ "$line" == *"ENERGIA"* ]] || [[ "$line" == *"LIC"* ]] || [[ "$line" == *"ITT"* ]] || [[ "$line" == *"ELE"* ]] || [[ "$line" == *"ELETTRONICA"* ]] || [[ "$line" == *"INFO"* ]] || [[ "$line" == *"MEC"* ]]
    then   # Salta un giro se c'è il nome della classe o l'istituto
        continue
    fi
    
    if [[ "$line" == *"ISTITUTO"* ]]; then
        continue
    fi
    
    if [ "$line" != "" ]
    then
        if [ "$line" == "Coordinatore" ]   # Se c'è la frase coordinatore siamo arrivati alla fìne
        then
            break
        fi
        echo "Sto creando la foto di $line"
        if [ "$counter" -gt "9" ]   # Se il counter è maggiore di 10 dobbiamo togliere uno zero
        then
            mv tmp_$filename/-0$counter.png tmp_$filename/${line// /_}.png
        else
            mv tmp_$filename/-00$counter.png tmp_$filename/${line// /_}.png
        fi
        ((counter++))
    fi
done

node upload_files_to_db.js tmp_$filename    # Carica le immagini nel DB

scp_upload $4 $5 $6 tmp_$filename

cleanup_files "$filename"