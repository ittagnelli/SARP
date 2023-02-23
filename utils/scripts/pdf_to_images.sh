#!/bin/bash

###
# SARP Images importer
###

if [ "$1" == "" ] || [ "$2" == "" ] || [ "$3" == "" ]
then
    echo "Usage: pdf_to_images.sh NOMEFILETESTO CARTELLACLASSE SCOSTAMENTO"
    exit 1
fi

counter=$(($3))   # La prima foto utile è la quarta

cat $1 | while read line
do
    
    if [ "$line" != "" ]
    then
        echo "Sto creando la foto di $line"

        if [ "$counter" -gt "9" ]   # Se il counter è maggiore di 10 dobbiamo togliere uno zero
        then
            mv $2/-0$counter.png $2/${line// /_}.png
        else
            mv $2/-00$counter.png $2/${line// /_}.png
        fi
        ((counter++))
    fi
done