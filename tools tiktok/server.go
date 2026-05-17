package main

import (
	"log"
	"net/http"
)

func main() {
	port := "8080"
	log.Printf("Starting server on port %s... (http://0.0.0.0:%s/)", port, port)
	err := http.ListenAndServe("0.0.0.0:"+port, http.FileServer(http.Dir(".")))
	if err != nil {
		log.Fatal(err)
	}
}
