package main

import (
  "log"
  "net/http"
  "net/http/httputil"
  "net/url"
)

func main() {
  localProxyUrl, _ := url.Parse("http://192.168.1.2:8101")
  localProxy := httputil.NewSingleHostReverseProxy(localProxyUrl)
  http.Handle("/", localProxy)

  log.Println("Serving on localhost:8080")
  log.Fatal(http.ListenAndServeTLS(":8080", "server.crt", "server.key", nil))
}
