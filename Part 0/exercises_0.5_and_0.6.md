# Exercise 0.5


sequenceDiagram
    participant browser
    participant server

    browser ->>server: GET   https://studies.cs.helsinki.fi/exampleapp/spa
    activate server
    server-->>browser:  HTML document
    deactivate server

    browser ->>server: GET   https://studies.cs.helsinki.fi/exampleapp/main.css
    activate server
    server-->>browser:  the css file
    deactivate server

    browser ->>server: GET   https://studies.cs.helsinki.fi/exampleapp/spa.js
    activate server
    server-->>browser:  the JavaScript file
    deactivate server

    spa.js ->>server: GET   https://studies.cs.helsinki.fi/exampleapp/data.json
    activate server
    server-->>browser:  [{ "content": "sudo", "date": "2026-04-26T20:13:35.957Z" }, ... ]
    deactivate server

    Note right of browser: JavaScript renders the json data received from the server

# Exercise 0.6

    participant browser
    participant server

    spa.js ->>server: POST https://studies.cs.helsinki.fi/exampleapp/new_note_spa (JSON: {"content":"Finally the last exercise","date":"2026-04-27T13:30:08.269Z"} )
    activate server
    server-->>browser: HTTP/1.1 201 Created
    deactivate server

    Note right of browser: JavaScript updates the notes without redirect
