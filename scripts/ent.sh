#!/bin/bash

if command -v ent &> /dev/null
then
    echo "ent installed"
    ent generate ./domain/schema
else
    echo "ent not install"
    go install entgo.io/ent/cmd/ent
    ent generate ./domain/schema
fi
